import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { findOrCreateUser } from "../services/auth.service";

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Failed to get user", details: "No user context" });
      return;
    }
    const user = await findOrCreateUser(req.user);
    res.status(200).json({ user });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: "Failed to get user", details: errorMessage });
    return;
  }
}

export async function syncUser(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized", details: "No user context" });
      return;
    }
    const user = await findOrCreateUser(req.user);
    res.status(200).json({ message: "User synced", user });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to sync user";
    res.status(500).json({ error: "Failed to sync user", details: errorMessage });
    return;
  }
}
