import {
    generateGeminiEmbeddings,
} from "./providers/gemini.provider.js";

const EMBEDDING_PROVIDER = "gemini";

const providers = {
    gemini: generateGeminiEmbeddings,
};


const getEmbeddingProvider = () => {

    const provider =
        providers[EMBEDDING_PROVIDER];

    if (!provider) {
        throw new Error(
            `Unsupported embedding provider: ${EMBEDDING_PROVIDER}`
        );
    }

    return provider;
};


/**
 * Generate an embedding for a single text.
 *
 * @param {string} text
 * @param {"document"|"query"} type
 * @returns {Promise<number[]>}
 */
export const generateEmbedding = async (
    text,
    type = "document"
) => {

    try {

        if (!text || typeof text !== "string") {
            throw new Error(
                "Text is required to generate embedding"
            );
        }

        const cleanedText = text.trim();

        if (!cleanedText) {
            throw new Error(
                "Text cannot be empty"
            );
        }

        const provider =
            getEmbeddingProvider();

        const embeddings =
            await provider(
                [cleanedText],
                type
            );

        return embeddings[0];

    } catch (err) {

        console.error(
            "[Embedding Service] Error generating embedding:",
            err.message
        );

        throw new Error(
            `Failed to generate embedding: ${err.message}`
        );
    }
};


/**
 * Generate embeddings for multiple texts.
 *
 * @param {string[]} texts
 * @param {"document"|"query"} type
 * @returns {Promise<number[][]>}
 */
export const generateEmbeddings = async (
    texts,
    type = "document"
) => {

    try {

        if (
            !Array.isArray(texts) ||
            texts.length === 0
        ) {
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

        const provider =
            getEmbeddingProvider();

        return await provider(
            cleanedTexts,
            type
        );

    } catch (err) {

        console.error(
            "[Embedding Service] Error generating embeddings:",
            err.message
        );

        throw new Error(
            `Failed to generate embeddings: ${err.message}`
        );
    }
};