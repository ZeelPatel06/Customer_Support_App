const DEFAULT_MAX_CHARS = 1200;
const DEFAULT_OVERLAP_CHARS = 150;

/**
 * Splits a long section into smaller sentence-based chunks.
 */
const splitLongSection = (text, maxChars, overlap) => {
    const sentences = text
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.trim())
        .filter(Boolean);

    const chunks = [];

    let current = "";

    for (const sentence of sentences) {
        const candidate = current
            ? `${current} ${sentence}`
            : sentence;

        if (candidate.length <= maxChars) {
            current = candidate;
            continue;
        }

        if (current) {
            chunks.push(current.trim());
        }

        const overlapText = current.slice(-overlap).trim();

        current = overlapText
            ? `${overlapText} ${sentence}`
            : sentence;
    }

    if (current.trim()) {
        chunks.push(current.trim());
    }

    return chunks;
};

/**
 * Splits XLSX row-based content into independent chunks.
 *
 * XLSX extractor produces blocks like:
 *
 * Sheet: Sheet1
 * Row: 10
 * Column: Value
 * Column: Value
 *
 * Each row is treated as an independent semantic unit.
 */
const XLSX_ROWS_PER_CHUNK = 10;

const splitXLSXRows = (text, maxChars) => {
    const rows = text
        .split(/\n(?=Sheet:\s)/)
        .map((row) => row.trim())
        .filter(Boolean);

    const chunks = [];

    for (let i = 0; i < rows.length; i += XLSX_ROWS_PER_CHUNK) {
        const rowGroup = rows.slice(
            i,
            i + XLSX_ROWS_PER_CHUNK
        );

        const chunk = rowGroup.join("\n\n");

        if (chunk.length <= maxChars) {
            chunks.push(chunk);
            continue;
        }

        // Safety fallback if 10 rows exceed maxChars
        chunks.push(
            ...splitLongSection(chunk, maxChars, 0)
        );
    }

    return chunks;
};

export const chunkText = (
    text,
    maxChars = DEFAULT_MAX_CHARS,
    overlap = DEFAULT_OVERLAP_CHARS
) => {
    if (!text || typeof text !== "string") {
        throw new Error("Text is required");
    }

    if (maxChars <= 0) {
        throw new Error("maxChars must be greater than 0");
    }

    if (overlap < 0 || overlap >= maxChars) {
        throw new Error("Overlap must be smaller than maxChars");
    }

    const normalizedText = text
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .replace(/[ \t]+/g, " ")
        .trim();

    if (!normalizedText) {
        return [];
    }

    /**
     * Detect XLSX row-based content.
     *
     * Our XLSX extractor generates:
     *
     * Sheet: Sheet1
     * Row: 2
     * ...
     */
    const isXLSXContent = /^Sheet:\s.+\nRow:\s\d+/m.test(
        normalizedText
    );

    if (isXLSXContent) {
        return splitXLSXRows(
            normalizedText,
            maxChars
        );
    }

    /**
     * Split the document using numbered section headings.
     */
    const sections = normalizedText
        .split(/\n(?=\d+\.\s)/)
        .map((section) => section.trim())
        .filter(Boolean);

    /**
     * Check whether meaningful numbered sections exist.
     */
    const hasNumberedSections = sections.some((section) => {
        const lines = section
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);

        return (
            lines.length > 1 ||
            /^\d+\.\s/.test(lines[0])
        );
    });

    /**
     * Normal plain text.
     */
    if (!hasNumberedSections) {
        if (normalizedText.length <= maxChars) {
            return [normalizedText];
        }

        return splitLongSection(
            normalizedText,
            maxChars,
            overlap
        );
    }

    /**
     * Remove standalone document titles.
     */
    const filteredSections = sections.filter((section) => {
        const lines = section
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);

        return (
            lines.length > 1 ||
            /^\d+\.\s/.test(lines[0])
        );
    });

    const chunks = [];

    for (const section of filteredSections) {
        if (section.length <= maxChars) {
            chunks.push(section);
            continue;
        }

        const sectionChunks = splitLongSection(
            section,
            maxChars,
            overlap
        );

        chunks.push(...sectionChunks);
    }

    return chunks;
};