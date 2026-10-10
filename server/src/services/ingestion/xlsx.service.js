import XLSX from "xlsx";

export const extractTextFromXLSX = async (fileBuffer) => {
    try {
        const workbook = XLSX.read(fileBuffer, {
            type: "buffer",
        });

        const extractedRows = [];

        workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];

            const rows = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
                defval: "",
                raw: false,
            });

            if (!rows.length) {
                return;
            }

            const headers = rows[0];

            rows.slice(1).forEach((row, index) => {
                const rowData = [];

                headers.forEach((header, columnIndex) => {
                    const value = row[columnIndex];

                    if (
                        header !== undefined &&
                        header !== "" &&
                        value !== undefined &&
                        value !== ""
                    ) {
                        rowData.push(`${header}: ${value}`);
                    }
                });

                if (rowData.length > 0) {
                    extractedRows.push(
                        `Sheet: ${sheetName}\n` +
                        `Row: ${index + 2}\n` +
                        rowData.join("\n")
                    );
                }
            });
        });

        return extractedRows.join("\n\n");
    } catch (err) {
        console.error("Error extracting text from XLSX:", err);
        throw new Error("Failed to extract text from XLSX");
    }
};