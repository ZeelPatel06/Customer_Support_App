export const extractedTextFromTXT = async (fileBuffer) => {
    try {
        const extractedText = fileBuffer.toString("utf-8").trim();
        return extractedText;
    } catch (err) {
        console.error("Error extrating text from TXT: ", err);
        throw new Error("Failed to extract text from TXT");
    }
};