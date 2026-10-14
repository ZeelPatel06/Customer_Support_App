export const chunkWebsiteText = ({
    text,
    chunkSize = 1000,
    overlap = 200,
}) => {
    if (!text || typeof text !== "string") {
        return [];
    }

    const normalizedText = text
        .replace(/\r\n/g, "\n")
        .replace(/[ \t]+/g, " ")
        .trim();

    if (!normalizedText) {
        return [];
    }

    const chunks = [];
    let start = 0;

    while (start < normalizedText.length) {
        let end = Math.min(
            start + chunkSize,
            normalizedText.length
        );

        // Prefer breaking at a word boundary.
        if (end < normalizedText.length) {
            const lastSpace = normalizedText.lastIndexOf(
                " ",
                end
            );

            if (lastSpace > start) {
                end = lastSpace;
            }
        }

        const content = normalizedText
            .slice(start, end)
            .trim();

        if (content) {
            chunks.push({
                index: chunks.length,
                content,
            });
        }

        if (end >= normalizedText.length) {
            break;
        }

        start = Math.max(0, end - overlap);
    }

    return chunks;
};