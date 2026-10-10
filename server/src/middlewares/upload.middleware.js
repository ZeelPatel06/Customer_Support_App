// server/src/middlewares/upload.middleware.js
import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

// Correct MIME types
const allowedMimeTypes = [
    "application/pdf",                                                          // .pdf
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",   // .docx
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",         // .xlsx
    "text/plain",                                                                // .txt
    "text/csv",                                                                  // .csv
    // Common browser fallbacks:
    "application/vnd.ms-excel",   // some browsers send this for .csv/.xlsx
    "application/octet-stream",   // generic — validated by extension below
];

// Extensions we actually accept
const allowedExtensions = [".pdf", ".docx", ".xlsx", ".csv", ".txt"];

export const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
    fileFilter: (req, file, callback) => {
        const ext = path.extname(file.originalname).toLowerCase();

        const extOk = allowedExtensions.includes(ext);
        const mimeOk = allowedMimeTypes.includes(file.mimetype);

        if (extOk && mimeOk) {
            return callback(null, true);
        }

        return callback(
            new Error(
                `Unsupported file type: ${file.originalname} (${file.mimetype}). ` +
                `Allowed: ${allowedExtensions.join(", ")}`
            ),
            false
        );
    },
});