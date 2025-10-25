import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { findOrCreateUser } from "../services/auth.service";

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized", details: "No user context" });
      return;
    }
    const user = await findOrCreateUser(req.user);
    res.status(200).json({ user });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: "Internal server error", details: errorMessage });
    return;
  }
}
