import type { Request, Response } from "express";
import { geminiClient } from "../config/gemini-config.ts";
import { generateUUID } from "../utils/uuid-util.ts";

// In-memory storage for results (in production, use Redis or database)
const qualityCheckResults = new Map<string, any>();

interface QualityCheckResult {
    requestId: string;
    status: 'processing' | 'completed' | 'error';
    videoQuality?: {
        overall: 'good' | 'fair' | 'poor';
        issues: string[];
        details: {
            brightness: 'good' | 'too_dark' | 'too_bright';
            clarity: 'clear' | 'blurry' | 'pixelated';
            lighting: 'good' | 'poor' | 'uneven';
        };
    };
    audioQuality?: {
        overall: 'good' | 'fair' | 'poor';
        issues: string[];
        details: {
            clarity: 'clear' | 'distorted' | 'muffled';
            volume: 'good' | 'too_low' | 'too_high';
            echo: 'none' | 'slight' | 'significant';
            background_noise: 'none' | 'low' | 'high';
        };
    };
    recommendations?: string[];
    error?: string;
}

export const handleQualityCheck = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: "No file uploaded",
                message: "Please upload a video or audio file for quality checking"
            });
        }

        const requestId = generateUUID();
        const fileType = req.file.mimetype.startsWith('video') ? 'video' : 'audio';

        console.log(`Processing quality check for ${fileType} - Request ID: ${requestId}`);

        // Initialize result with processing status
        qualityCheckResults.set(requestId, {
            requestId,
            status: 'processing',
            fileType
        });

        // Return request ID immediately for async processing
        res.json({
            requestId,
            status: 'processing',
            message: 'Quality check started. Use the request ID to get results.',
            estimatedTime: '10-30 seconds'
        });

        // Process quality check asynchronously
        processQualityCheckAsync(requestId, req.file, fileType);

    } catch (error: any) {
        console.error("Quality Check Error:", error.message);
        return res.status(500).json({
            error: "Internal server error",
            message: "Failed to start quality check process"
        });
    }
};

export const getQualityCheckResult = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "Missing request ID",
                message: "Please provide a valid request ID"
            });
        }

        const result = qualityCheckResults.get(id);

        if (!result) {
            return res.status(404).json({
                error: "Result not found",
                message: "No quality check found with this ID"
            });
        }

        return res.json(result);

    } catch (error: any) {
        console.error("Get Result Error:", error.message);
        return res.status(500).json({
            error: "Internal server error",
            message: "Failed to retrieve quality check result"
        });
    }
};

async function processQualityCheckAsync(requestId: string, file: Express.Multer.File, fileType: string) {
    try {
        // Note: gemini-2.5-flash is not a valid model name
        // Use gemini-pro-vision for image/video analysis
        const model = geminiClient.getGenerativeModel({ model: "gemini-pro-vision" });

        // Create specific prompts based on file type
        const prompt = fileType === 'video' ? getVideoQualityPrompt() : getAudioQualityPrompt();

        // Convert file to base64 for Gemini
        const base64Data = file.buffer.toString('base64');

        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64Data,
                    mimeType: file.mimetype
                }
            },
            { text: prompt }
        ]);

        const response = result.response;
        const text = response.text();

        // Parse AI response
        let qualityData;
        try {
            qualityData = JSON.parse(text);
        } catch (parseError) {
            console.error("Failed to parse AI response:", text);
            qualityData = {
                error: "Failed to parse AI analysis",
                raw_response: text
            };
        }

        // Update result with completed analysis
        const finalResult: QualityCheckResult = {
            requestId,
            status: 'completed',
            ...(fileType === 'video' ? { videoQuality: qualityData } : { audioQuality: qualityData }),
            recommendations: qualityData.recommendations || []
        };

        qualityCheckResults.set(requestId, finalResult);

        console.log(`Quality check completed for Request ID: ${requestId}`);

    } catch (error: any) {
        console.error(`Quality check failed for Request ID: ${requestId}`, error.message);

        qualityCheckResults.set(requestId, {
            requestId,
            status: 'error',
            error: error.message || 'Unknown error occurred during analysis'
        });
    }
}

function getVideoQualityPrompt(): string {
    return `
You are an AI assistant analyzing video quality for a video call pre-join check.
Analyze the provided video and return a JSON response with the following structure:

{
    "overall": "good" | "fair" | "poor",
    "issues": ["list of specific issues found"],
    "details": {
        "brightness": "good" | "too_dark" | "too_bright",
        "clarity": "clear" | "blurry" | "pixelated", 
        "lighting": "good" | "poor" | "uneven"
    },
    "recommendations": ["specific suggestions to improve video quality"]
}

Focus on these video quality aspects:
- **Brightness**: Is the video too dark, too bright, or well-lit?
- **Clarity**: Is the video sharp and clear, or blurry/pixelated?
- **Lighting**: Is the lighting even and flattering, or harsh/uneven?
- **Overall composition**: Frame composition, background distractions

Provide specific, actionable recommendations for any issues found.
If the video quality is good overall, still mention what's working well.
`;
}

function getAudioQualityPrompt(): string {
    return `
You are an AI assistant analyzing audio quality for a video call pre-join check.
Analyze the provided audio and return a JSON response with the following structure:

{
    "overall": "good" | "fair" | "poor",
    "issues": ["list of specific issues found"],
    "details": {
        "clarity": "clear" | "distorted" | "muffled",
        "volume": "good" | "too_low" | "too_high",
        "echo": "none" | "slight" | "significant",
        "background_noise": "none" | "low" | "high"
    },
    "recommendations": ["specific suggestions to improve audio quality"]
}

Focus on these audio quality aspects:
- **Clarity**: Is the audio clear and understandable, or distorted/muffled?
- **Volume**: Is the audio at appropriate levels, or too quiet/loud?
- **Echo**: Is there any echo or reverberation present?
- **Background Noise**: Are there distracting background sounds?
- **Overall quality**: General audio fidelity and call readiness

Provide specific, actionable recommendations for any issues found.
If the audio quality is good overall, still mention what's working well.
`;
}
