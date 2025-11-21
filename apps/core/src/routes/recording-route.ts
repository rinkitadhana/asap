import express from "express";
import { authMiddleware } from "../middlewares/auth-middleware.ts";

const router = express.Router();

router.get("/record", authMiddleware);

export default router;
