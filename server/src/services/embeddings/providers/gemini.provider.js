import { GoogleGenAI } from "@google/genai";
import config from "../../../config/config.js";

const ai = new GoogleGenAI({
    apiKey: config.EMBEDDING_API_KEY,
});

const GEMINI_EMBEDDING_MODEL = "gemini-embedding-2";

const EMBEDDING_DIMENSIONS = Number(768);

/**
 * Generate embeddings for multiple texts.
 *
 * @param {string[]} texts
 * @param {"RETRIEVAL_DOCUMENT"|"RETRIEVAL_QUERY"} taskType
 * @returns {Promise<number[][]>}
 */
export const generateGeminiEmbeddings = async (
    texts,
    taskType = "RETRIEVAL_DOCUMENT"
) => {

    if (!Array.isArray(texts) || texts.length === 0) {
        throw new Error(
            "Texts must be a non-empty array"
        );
    }

    const cleanedTexts = texts
        .filter(
            (text) =>
                typeof text === "string" &&
                text.trim().length > 0
        )
        .map((text) => text.trim());

    if (cleanedTexts.length === 0) {
        throw new Error(
            "No valid texts provided"
        );
    }

    const response =
        await ai.models.embedContent({
            model: GEMINI_EMBEDDING_MODEL,

            contents: cleanedTexts,

            config: {
                outputDimensionality:
                    EMBEDDING_DIMENSIONS,
            },
        });

    if (
        !response?.embeddings ||
        response.embeddings.length !==
            cleanedTexts.length
    ) {
        throw new Error(
            "Invalid embedding response from Gemini"
        );
    }

    return response.embeddings.map(
        (embedding) => embedding.values
    );
};