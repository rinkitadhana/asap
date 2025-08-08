import express from "express";
import { upload, handleUploadError } from "../middlewares/upload-middleware.ts";
import { handleQualityCheck, getQualityCheckResult } from "../controllers/qualityCheck-controller.ts";

const router = express.Router();

router.post("/", (req, res, next) => {
    upload.single("media")(req, res, (err) => {
        if (err) {
            return handleUploadError(err, req, res, next);
        }
        handleQualityCheck(req, res);
    });
});

router.get("/result/:id", (req, res) => {
    getQualityCheckResult(req, res);
});


export default router;
