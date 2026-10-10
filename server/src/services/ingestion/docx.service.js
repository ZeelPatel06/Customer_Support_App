import mammoth from "mammoth";

export const extractTextFromDOCX = async (fileBuffer) => {
    try {
        const result = await mammoth.extractRawText({
            buffer: fileBuffer
        });
        return result.value.trim();
    } catch (err) {
        console.error("Error extracting text from DOCX: ", err);
        throw new Error("Failed to extract text from DOCX");
    }
};