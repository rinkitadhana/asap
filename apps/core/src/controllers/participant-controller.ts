import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth-middleware";
import {
  joinSpace,
  leaveSpace,
  getSpaceParticipants,
  updateParticipantRole,
  kickParticipant,
  isUserHost,
  getParticipantById,
} from "../services/participant-service";
import { findOrCreateUser } from "../services/auth-service";

export async function joinSpaceController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { spaceId } = req.params;
    const { displayName, participantSessionId } = req.body;

    if (!spaceId) {
      res.status(400).json({ error: "Bad Request", details: "Space ID is required" });
      return;
    }

    if (!participantSessionId || typeof participantSessionId !== "string" || participantSessionId.trim().length === 0) {
      res.status(400).json({ error: "Bad Request", details: "Participant session ID is required" });
      return;
    }

    let userId: string | undefined;
    let finalDisplayName: string;
    let isGuest: boolean;

    if (req.user) {
      const user = await findOrCreateUser(req.user);
      userId = user.id;
      finalDisplayName = displayName?.trim() || user.name;
      isGuest = false;
    } else {
      if (!displayName || typeof displayName !== "string" || displayName.trim().length === 0) {
        res.status(400).json({ error: "Bad Request", details: "Display name is required for guest users" });
        return;
      }
      finalDisplayName = displayName.trim();
      isGuest = true;
    }

    const result = await joinSpace({
      spaceId,
      participantSessionId: participantSessionId.trim(),
      displayName: finalDisplayName,
      userId,
      isGuest,
    });

    res.status(200).json({
      participant: result.participant,
      space: result.space,
      isRejoin: result.isRejoin,
      message: result.isRejoin ? "Rejoined space successfully" : "Joined space successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "SPACE_NOT_FOUND") {
        res.status(404).json({ error: "Not Found", details: "Space not found" });
        return;
      }
      if (error.message === "SPACE_NOT_LIVE") {
        res.status(400).json({ error: "Bad Request", details: "Space is not currently live" });
        return;
      }
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: "Failed to join space", details: errorMessage });
  }
}

export async function leaveSpaceController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { spaceId } = req.params;
    const { participantSessionId } = req.body;

    if (!spaceId) {
      res.status(400).json({ error: "Bad Request", details: "Space ID is required" });
      return;
    }

    let userId: string | undefined;

    if (req.user) {
      const user = await findOrCreateUser(req.user);
      userId = user.id;
    }

    if (!userId && (!participantSessionId || typeof participantSessionId !== "string")) {
      res.status(400).json({ error: "Bad Request", details: "Participant session ID is required for guest users" });
      return;
    }

    const participant = await leaveSpace({
      spaceId,
      participantSessionId: participantSessionId?.trim(),
      userId,
    });

    res.status(200).json({
      success: true,
      participant,
      message: "Left space successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "PARTICIPANT_NOT_FOUND") {
        res.status(404).json({ error: "Not Found", details: "Participant not found in this space" });
        return;
      }
      if (error.message === "PARTICIPANT_ALREADY_LEFT") {
        res.status(400).json({ error: "Bad Request", details: "You have already left this space" });
        return;
      }
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: "Failed to leave space", details: errorMessage });
  }
}


export async function getParticipantsController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { spaceId } = req.params;
    const { active } = req.query;

    if (!spaceId) {
      res.status(400).json({ error: "Bad Request", details: "Space ID is required" });
      return;
    }

    // Parse active query param (defaults to true)
    const activeOnly = active !== "false";

    const participants = await getSpaceParticipants(spaceId, activeOnly);

    res.status(200).json({
      success: true,
      participants,
      count: participants.length,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "SPACE_NOT_FOUND") {
      res.status(404).json({ error: "Not Found", details: "Space not found" });
      return;
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: "Failed to get participants", details: errorMessage });
  }
}

export async function updateRoleController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized", details: "Authentication required" });
      return;
    }

    const { spaceId, participantId } = req.params;
    const { role } = req.body;

    if (!spaceId) {
      res.status(400).json({ error: "Bad Request", details: "Space ID is required" });
      return;
    }

    if (!participantId) {
      res.status(400).json({ error: "Bad Request", details: "Participant ID is required" });
      return;
    }

    if (!role || !["CO_HOST", "GUEST"].includes(role)) {
      res.status(400).json({ error: "Bad Request", details: "Role must be CO_HOST or GUEST" });
      return;
    }

    // Verify user is the host
    const user = await findOrCreateUser(req.user);
    const isHost = await isUserHost(spaceId, user.id);

    if (!isHost) {
      res.status(403).json({ error: "Forbidden", details: "Only the host can update participant roles" });
      return;
    }

    // Verify participant belongs to this space
    const participant = await getParticipantById(participantId);
    if (!participant || participant.spaceId !== spaceId) {
      res.status(404).json({ error: "Not Found", details: "Participant not found in this space" });
      return;
    }

    const updatedParticipant = await updateParticipantRole(participantId, role);

    res.status(200).json({
      success: true,
      participant: updatedParticipant,
      message: "Participant role updated successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "PARTICIPANT_NOT_FOUND") {
        res.status(404).json({ error: "Not Found", details: "Participant not found" });
        return;
      }
      if (error.message === "CANNOT_CHANGE_HOST_ROLE") {
        res.status(400).json({ error: "Bad Request", details: "Cannot change the host's role" });
        return;
      }
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: "Failed to update role", details: errorMessage });
  }
}

export async function kickParticipantController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized", details: "Authentication required" });
      return;
    }

    const { spaceId, participantId } = req.params;

    if (!spaceId) {
      res.status(400).json({ error: "Bad Request", details: "Space ID is required" });
      return;
    }

    if (!participantId) {
      res.status(400).json({ error: "Bad Request", details: "Participant ID is required" });
      return;
    }

    // Verify user is the host
    const user = await findOrCreateUser(req.user);
    const isHost = await isUserHost(spaceId, user.id);

    if (!isHost) {
      res.status(403).json({ error: "Forbidden", details: "Only the host can kick participants" });
      return;
    }

    // Verify participant belongs to this space
    const participant = await getParticipantById(participantId);
    if (!participant || participant.spaceId !== spaceId) {
      res.status(404).json({ error: "Not Found", details: "Participant not found in this space" });
      return;
    }

    const kickedParticipant = await kickParticipant(participantId);

    res.status(200).json({
      success: true,
      participant: kickedParticipant,
      message: "Participant kicked successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "PARTICIPANT_NOT_FOUND") {
        res.status(404).json({ error: "Not Found", details: "Participant not found" });
        return;
      }
      if (error.message === "CANNOT_KICK_HOST") {
        res.status(400).json({ error: "Bad Request", details: "Cannot kick the host" });
        return;
      }
      if (error.message === "PARTICIPANT_ALREADY_LEFT") {
        res.status(400).json({ error: "Bad Request", details: "Participant has already left" });
        return;
      }
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: "Failed to kick participant", details: errorMessage });
  }
}

