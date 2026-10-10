import { generateLLMResponse } from "../llms/llms.service.js";
import { checkKnowledgeRelevance } from "../relevanceCheck.service.js";
import { searchKnowledge } from "../vector/vectorSearch.service.js";

import {
    getConversationContext,
    addMessageToContext,
} from "../vector/talkContext.service.js";

import { rewriteQuery } from "./queryRewrite.service.js";


const FALLBACK_MESSAGE =
    "I don't have enough information to answer that. OR Please once ask same question after Clear on top.";

export const generateRAGAnswer = async ({
    question,
    organizationId,
    conversationId,
}) => {
    try {
        // ==========================================
        // 1. Validate input
        // ==========================================

        if (!question || !question.trim()) {
            throw new Error("Question is required");
        }

        if (!organizationId) {
            throw new Error("Organization ID is required");
        }

        if (!conversationId) {
            throw new Error("Conversation ID is required");
        }

        // ==========================================
        // 2. Get conversation context
        // ==========================================

        const conversationContext =
            await getConversationContext(
                conversationId
            );

        // ==========================================
        // 3. Rewrite query
        // ==========================================

        const searchQuery = await rewriteQuery({
            question,
            conversationContext,
        });

        console.log(
            "Original question:",
            question
        );

        console.log(
            "Conversation context:",
            conversationContext
        );

        console.log(
            "Rewritten query:",
            searchQuery
        );

        console.log(
            "RAG organizationId:",
            organizationId
        );

        // ==========================================
        // 4. Vector search
        // ==========================================

        const results = await searchKnowledge({
            query: searchQuery,
            organizationId,
            limit: 3,
        });

        console.log(
            "\n[RAG] Retrieved results:",
            results.length
        );

        // ==========================================
        // 5. No knowledge found
        // ==========================================

        if (!results.length) {
            console.log(
                "[RAG] No relevant knowledge found."
            );

            await addMessageToContext(
                conversationId,
                "user",
                question.trim()
            );

            await addMessageToContext(
                conversationId,
                "assistant",
                FALLBACK_MESSAGE
            );

            return FALLBACK_MESSAGE;
        }

        // ==========================================
        // 6. Build knowledge context
        // ==========================================

        // ==========================================
        // 6. Check knowledge relevance
        // ==========================================

        const relevantChunks =
            await checkKnowledgeRelevance({
                question: question.trim(),
                knowledgeChunks: results,
            });

        console.log(
            "\n[RAG] Relevant chunks:",
            relevantChunks.length
        );

        if (!relevantChunks.length) {

            console.log(
                "[RAG] Retrieved knowledge was not relevant."
            );

            await addMessageToContext(
                conversationId,
                "user",
                question.trim()
            );

            await addMessageToContext(
                conversationId,
                "assistant",
                FALLBACK_MESSAGE
            );

            return FALLBACK_MESSAGE;
        }

        // ==========================================
        // 7. Build relevant knowledge context
        // ==========================================

        const knowledgeContext =
            relevantChunks
                .map((chunk) => chunk.content)
                .join("\n\n");

        console.log(
            "\n========== RELEVANT KNOWLEDGE =========="
        );

        console.log(knowledgeContext);

        console.log(
            "=========================================\n"
        );


        // ==========================================
        // 9. Generate grounded answer
        // ==========================================

        const systemPrompt = `
You are a knowledge-based customer support assistant.

Answer the user's question using ONLY the INFORMATION provided by the application.

Rules:
- Understand the meaning of the question.
- Different wording, grammar, or question style is allowed.
- Answer directly from the information.
- You may summarize or rephrase information without changing its meaning.
- Do not add facts, assumptions, opinions, or general knowledge.
- Preserve important conditions, qualifications, numbers, dates, names, prices, and restrictions.
- Do not treat one condition as another condition.
- If the information does not contain enough evidence to answer the question, return exactly:

I don't have enough information to answer that. OR Please once ask same question after Clear on top.

- Return only the answer.
`;

        const userPrompt = `
INFORMATION:
${knowledgeContext}

QUESTION:
${question.trim()}
`;

        // ==========================================
        // 10. LLM answer generation
        // ==========================================

        const response = await generateLLMResponse({
            systemPrompt,
            userPrompt,
        });
        // ==========================================
        // 12. Extract answer
        // ==========================================

        const answer =
            response?.answer?.trim() ||
            FALLBACK_MESSAGE;

        console.log(
            "\n========== RAW LLM RESPONSE =========="
        );

        console.log(answer);

        console.log(
            "=======================================\n"
        );

        // ==========================================
        // 13. Save conversation
        // ==========================================

        await addMessageToContext(
            conversationId,
            "user",
            question.trim()
        );

        await addMessageToContext(
            conversationId,
            "assistant",
            answer
        );

        // ==========================================
        // 14. Return answer
        // ==========================================

        return answer;

    } catch (error) {
        console.error(
            "RAG service error:",
            error
        );

        throw error;
    }
};