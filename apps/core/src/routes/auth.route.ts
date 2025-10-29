import express from "express";
import { getMe } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware.ts";

const router = express.Router();

router.get("/me", authMiddleware, getMe);

export default router;
