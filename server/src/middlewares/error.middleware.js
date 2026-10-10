// server/src/middlewares/error.middleware.js
import multer from "multer";

export const errorHandler = (err, req, res, next) => {
    // Multer errors (fileFilter rejection, file too large, etc.)
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            warning: true,
            message: err.message,
            code: err.code,
        });
    }

    // Plain Error thrown from fileFilter
    if (err?.message?.startsWith("Unsupported file type")) {
        return res.status(400).json({
            success: false,
            warning: true,
            message: err.message,
        });
    }

    // Everything else
    console.error("Unhandled error:", err);
    return res.status(500).json({
        success: false,
        message: err.message || "Internal server error",
    });
};