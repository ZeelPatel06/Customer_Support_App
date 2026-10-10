// server/src/services/documentExtractor.service.js
import path from "path";
import { extractTextFromPDF } from "./ingestion/pdfparse.service.js";
import { extractTextFromDOCX } from "./ingestion/docx.service.js";
import { extractTextFromXLSX } from "./ingestion/xlsx.service.js";
import { extractedTextFromCSV } from "./ingestion/csv.service.js";
import { extractedTextFromTXT } from "./ingestion/txt.service.js";

export const extractDocumentText = async (file) => {
    if (!file?.buffer) {
        throw new Error("No file or buffer provided to extractDocumentText");
    }

    const ext = path.extname(file.originalname || "").toLowerCase();
    const mime = file.mimetype;


    // Dispatch by extension first (browsers lie about MIME), fall back to MIME
    try {
        if (ext === ".pdf" || mime === "application/pdf") {
            return await extractTextFromPDF(file.buffer);
        }
        if (
            ext === ".docx" ||
            mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
            return await extractTextFromDOCX(file.buffer);
        }
        if (
            ext === ".xlsx" ||
            mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
            return await extractTextFromXLSX(file.buffer);
        }
        if (ext === ".txt" || mime === "text/plain") {
            return await extractedTextFromTXT(file.buffer);
        }
        if (
            ext === ".csv" ||
            mime === "text/csv" ||
            mime === "application/vnd.ms-excel"
        ) {
            return await extractedTextFromCSV(file.buffer);
        }

        throw new Error(
            `Unsupported file type: "${file.originalname}" (${mime}). Allowed: .pdf, .docx, .xlsx, .csv, .txt`
        );
    } catch (err) {
        console.error("Document extraction error:", err.message);
        // Preserve the original message — do NOT replace it
        throw new Error(`Failed to extract text from "${file.originalname}": ${err.message}`);
    }
};