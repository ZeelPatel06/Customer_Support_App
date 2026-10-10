import { PDFParse } from "pdf-parse";

export const extractTextFromPDF = async (fileBuffer) => {
    try {
        const uint8 = new Uint8Array(
            fileBuffer.buffer,
            fileBuffer.byteOffset,
            fileBuffer.byteLength
        );

        const parser = new PDFParse(uint8);
        const result = await parser.getText();
        return (result.text ?? "").trim();
    } catch (err) {
        console.error("Error extracting text from PDF:", err);
        throw new Error("Failed to extract text from PDF", { cause: err });
    }
};