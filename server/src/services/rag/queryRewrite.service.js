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
You rewrite customer questions into effective standalone search queries
for a knowledge-base retrieval system.

Rules:
- Use conversation context to resolve references to previous messages.
- Preserve the user's original intent.
- Preserve names and important keywords from the question.
- If a person is mentioned by a shortened first name, use the full name
  only when the conversation explicitly establishes it.
- Do not invent names, facts, projects, or other details.
- Do not answer the question.
- If the question is already standalone, return it unchanged.
- Return only the rewritten question.
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