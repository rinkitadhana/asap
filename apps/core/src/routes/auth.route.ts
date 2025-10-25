import express from "express";
import { getMe, syncUser } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware.ts";

const router = express.Router();

router.get("/me", authMiddleware, getMe);
router.post("/sync-user", authMiddleware, syncUser);


export default router;
