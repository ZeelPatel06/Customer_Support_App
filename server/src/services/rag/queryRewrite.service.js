import { generateLLMResponse } from "../llms/llms.service.js";

const MAX_CONTEXT_MESSAGES = 2;

const getContext = (conversationContext) => {
    if (!Array.isArray(conversationContext)) {
        return [];
    }

    return conversationContext
        .filter(
            (message) =>
                message &&
                (message.role === "user" ||
                    message.role === "assistant") &&
                typeof message.content === "string" &&
                message.content.trim()
        )
        .slice(-MAX_CONTEXT_MESSAGES);
};

export const rewriteQuery = async ({
    question,
    conversationContext = [],
}) => {
    try {
        // ==========================================
        // 1. Validate question
        // ==========================================

        if (!question || typeof question !== "string") {
            throw new Error("Question is required.");
        }

        const currentQuestion = question.trim();

        if (!currentQuestion) {
            throw new Error("Question cannot be empty.");
        }

        // ==========================================
        // 2. Get conversation context
        // ==========================================

        const context = getContext(conversationContext);

        // No conversation context
        // → No rewriting required
        if (!context.length) {
            return currentQuestion;
        }

        // ==========================================
        // 3. Build conversation text
        // ==========================================

        const conversationText = context
            .map(
                (message) =>
                    `${message.role}: ${message.content.trim()}`
            )
            .join("\n");

        // ==========================================
        // 4. System instructions
        // ==========================================

        const systemPrompt = `
You rewrite customer questions into standalone search queries.

Your task is ONLY to rewrite the current question so that it can be understood without the previous conversation.

Rules:
- Use the conversation only to understand missing context.
- Preserve the original meaning.
- Do not answer the question.
- Do not add information that is not present in the conversation.
- If the current question is already standalone, return it unchanged.
- Return only the rewritten question.
- Never return None.
- Never return null.
- Never return an empty response.
`;

        // ==========================================
        // 5. User input
        // ==========================================

        const userPrompt = `
Conversation:
${conversationText}

Current question:
${currentQuestion}
`;

        // ==========================================
        // 6. Generate rewritten query
        // ==========================================

        const response = await generateLLMResponse({
            systemPrompt,
            userPrompt,
        });

        // ==========================================
        // 7. Extract rewritten query
        // ==========================================

        const rewrittenQuery =
            response?.answer
                ?.trim()
                .replace(/^["']|["']$/g, "");

        // ==========================================
        // 8. Validate rewritten query
        // ==========================================

        if (
            !rewrittenQuery ||
            rewrittenQuery.toLowerCase() === "none" ||
            rewrittenQuery.toLowerCase() === "null"
        ) {
            return currentQuestion;
        }

        return rewrittenQuery;

    } catch (error) {
        console.error(
            "Query Rewrite Error:",
            error
        );

        // If rewriting fails,
        // use the original question.
        return question.trim();
    }
};