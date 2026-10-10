import { generateLLMResponse } from "./llms/llms.service.js";

export const checkKnowledgeRelevance = async ({
    question,
    knowledgeChunks,
}) => {
    try {
        if (
            !question ||
            typeof question !== "string"
        ) {
            return [];
        }

        if (
            !Array.isArray(knowledgeChunks) ||
            knowledgeChunks.length === 0
        ) {
            return [];
        }

        const knowledgeText =
            knowledgeChunks
                .map(
                    (chunk, index) =>
                        `CHUNK ${index + 1}:
${chunk.content}`
                )
                .join("\n\n");

        const systemPrompt = `
You are a strict knowledge relevance classifier for a customer support chatbot.

Determine which knowledge chunks contain enough information to help answer the user's question.

Rules:
- Do NOT answer the question.
- Do NOT use outside knowledge.
- Do NOT make assumptions.
- A chunk is relevant only if its actual content directly supports answering the question.
- Similar words or unrelated topics are NOT sufficient.
- If no chunk contains enough relevant information, return an empty array.
- Return ONLY valid JSON.

Required format:

{
  "relevantChunkIndexes": [1, 3]
}

If none are relevant:

{
  "relevantChunkIndexes": []
}
`;

        const userPrompt = `
USER QUESTION:
${question.trim()}

KNOWLEDGE:

${knowledgeText}
`;

        const response =
            await generateLLMResponse({
                systemPrompt,
                userPrompt,
            });

        const rawAnswer =
            response?.answer?.trim();

        if (!rawAnswer) {
            return [];
        }

        const cleanedAnswer = rawAnswer
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        let result;

        try {
            result = JSON.parse(cleanedAnswer);
        } catch (error) {
            console.error(
                "[Relevance Check] Invalid JSON:",
                rawAnswer
            );

            return [];
        }

        if (
            !Array.isArray(
                result.relevantChunkIndexes
            )
        ) {
            return [];
        }

        const validIndexes =
            result.relevantChunkIndexes
                .filter(
                    (index) =>
                        Number.isInteger(index) &&
                        index >= 1 &&
                        index <= knowledgeChunks.length
                );

        return validIndexes.map(
            (index) =>
                knowledgeChunks[index - 1]
        );

    } catch (error) {
        console.error(
            "[Relevance Check] Error:",
            error.message
        );

        // Fail closed.
        return [];
    }
};