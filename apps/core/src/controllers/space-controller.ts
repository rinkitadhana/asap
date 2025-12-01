import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth-middleware";
import {
  createSpace,
  updateSpace,
  endSpace,
  getSpaceById,
  getSpaceByJoinCode,
  verifySpaceHost,
  isUserParticipant,
} from "../services/space-service";
import { findOrCreateUser } from "../services/auth-service";

export async function createSpaceController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized", details: "No user context" });
      return;
    }

    const { title, description, joinCode } = req.body;

    if (!joinCode || typeof joinCode !== "string" || joinCode.trim().length === 0) {
      res.status(400).json({ error: "Bad Request", details: "Join code is required" });
      return;
    }

    const user = await findOrCreateUser(req.user);
    const spaceTitle = (title && title.trim()) || `${user.name}'s Space`;
    const spaceDescription = (description && description.trim()) || `This is ${user.name}'s space`;

    try {
      const space = await createSpace({
        title: spaceTitle,
        description: spaceDescription,
        joinCode: joinCode.trim(),
        hostId: user.id,
      });

      res.status(201).json({
        space,
        message: "Space created and started successfully!",
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "JOIN_CODE_EXISTS") {
        res.status(409).json({
          error: "Conflict",
          details: "A space with this join code already exists",
        });
        return;
      }
      throw error;
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      error: "Failed to create space",
      details: errorMessage,
    });
  }
}

export async function updateSpaceController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized", details: "No user context!" });
      return;
    }

    const { spaceId } = req.params;
    
    if (!spaceId) {
      res.status(400).json({ error: "Bad Request", details: "Space ID is required!" });
      return;
    }

    const { title, description } = req.body;

    if (title === undefined && description === undefined) {
      res.status(400).json({
        error: "Bad Request",
        details: "At least one field (title or description) must be provided!",
      });
      return;
    }

    const user = await findOrCreateUser(req.user);

    const isHost = await verifySpaceHost(spaceId, user.id);
    if (!isHost) {
      res.status(403).json({
        error: "Forbidden",
        details: "Only the host can update space details!",
      });
      return;
    }

    const space = await updateSpace(spaceId, {
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description?.trim() }),
    });

    res.status(200).json({
      space,
      message: "Space updated successfully!",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      error: "Failed to update space!",
      details: errorMessage,
    });
  }
}

export async function endSpaceController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized", details: "No user context!" });
      return;
    }

    const { spaceId } = req.params;
    
    if (!spaceId) {
      res.status(400).json({ error: "Bad Request", details: "Space ID is required" });
      return;
    }

    const user = await findOrCreateUser(req.user);

    const isHost = await verifySpaceHost(spaceId, user.id);
    if (!isHost) {
      res.status(403).json({
        error: "Forbidden",
        details: "Only the host can end the space!",
      });
      return;
    }

    try {
      const space = await endSpace(spaceId);

      res.status(200).json({
        space,
        message: "Space ended successfully!",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "SPACE_NOT_FOUND") {
          res.status(404).json({
            error: "Not Found",
            details: "Space not found!",
          });
          return;
        }
        if (error.message === "SPACE_NOT_LIVE") {
          res.status(400).json({
            error: "Bad Request",
            details: "Space is not currently live!",
          });
          return;
        }
      }
      throw error;
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      error: "Failed to end space",
      details: errorMessage,
    });
  }
}

export async function getSpaceByIdController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized", details: "No user context!" });
      return;
    }

    const { spaceId } = req.params;
    
    if (!spaceId) {
      res.status(400).json({ error: "Bad Request", details: "Space ID is required!" });
      return;
    }

    const user = await findOrCreateUser(req.user);

    const space = await getSpaceById(spaceId);

    if (!space) {
      res.status(404).json({
        error: "Not Found",
        details: "Space not found",
      });
      return;
    }

    const isHost = space.hostId === user.id;
    const isParticipant = await isUserParticipant(spaceId, user.id);

    if (!isHost && !isParticipant) {
      res.status(403).json({
        error: "Forbidden",
        details: "You are not authorized to view this space!",
      });
      return;
    }

    res.status(200).json({
      space,
      message: "Space retrieved successfully!",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      error: "Failed to get space!",
      details: errorMessage,
    });
  }
}

export async function getSpaceByJoinCodeController(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { joinCode } = req.params;

    if (!joinCode) {
      res.status(400).json({
        error: "Bad Request",
        details: "Join code is required!",
      });
      return;
    }

    const space = await getSpaceByJoinCode(joinCode);

    if (!space) {
      res.status(404).json({
        error: "Not Found",
        details: "Space not found with this join code!",
      });
      return;
    }

    res.status(200).json({
      space,
      message: "Space retrieved successfully!",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      error: "Failed to get space!",
      details: errorMessage,
    });
  }
}

