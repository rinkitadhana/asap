import multer from "multer";
import type { Request } from "express";

// Store in memory instead of writing to disk
const storage = multer.memoryStorage();

// File filter function to validate file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allowed video formats
    const videoTypes = [
        'video/mp4',
        'video/webm',
        'video/ogg',
        'video/quicktime',
        'video/x-msvideo', // .avi
        'video/x-ms-wmv'   // .wmv
    ];

    // Allowed audio formats
    const audioTypes = [
        'audio/mp3',
        'audio/mpeg',
        'audio/wav',
        'audio/ogg',
        'audio/aac',
        'audio/webm',
        'audio/x-m4a'
    ];

    const allowedTypes = [...videoTypes, ...audioTypes];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`));
    }
};

export const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50 MB limit for video files
        fieldSize: 50 * 1024 * 1024,
    },
    fileFilter,
});

// Error handling middleware for multer
export const handleUploadError = (error: any, req: Request, res: any, next: any) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File too large',
                message: 'File size must be less than 50MB',
                maxSize: '50MB'
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                error: 'Unexpected field',
                message: 'Please use the field name "media" for file uploads'
            });
        }
    }

    if (error.message.includes('Invalid file type')) {
        return res.status(400).json({
            error: 'Invalid file type',
            message: error.message
        });
    }

    return res.status(500).json({
        error: 'Upload error',
        message: 'An error occurred during file upload'
    });
};
