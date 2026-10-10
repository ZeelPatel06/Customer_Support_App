import { parse } from "csv-parse/sync";

export const extractedTextFromCSV = async (fileBuffer) => {
    try {
        const csvText = fileBuffer.toString("utf-8");
        const records = parse(csvText, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });
        let extractedText = "";
        records.forEach((record, index) => {
            extractedText += `Row ${index + 1}: \n`;
            Object.entries(record).forEach(([key, value]) => {
                extractedText += `${key}: ${value}\n`;
            });
            extractedText += "\n";
        });
        return extractedText.trim();
    } catch (err) {
        console.error("Error extracting text from CSV: ", err);
        throw new Error("Failed to extract text from CSV");
    }
};