import { generateLLMResponse } from "../llms/llms.service.js";
import { checkKnowledgeRelevance } from "../relevanceCheck.service.js";
import { searchKnowledge } from "../vector/vectorSearch.service.js";

import {
    getConversationContext,
    addMessageToContext,
} from "../vector/talkContext.service.js";

import { rewriteQuery } from "./queryRewrite.service.js";

import { getWebsiteFallback } from "../scraping/websiteFallback.service.js";
import { generateWebsiteAnswer } from "../scraping/websiteAnswer.service.js";

const FALLBACK_MESSAGE =
    "I don't have enough information to answer that. OR Please once ask same question after Clear on top.";


// ==========================================
// Website fallback helper
// ==========================================

const answerFromWebsite = async ({
    question,
    organizationId,
    pageUrl,
    pageText,
}) => {
    try {
        if (!pageUrl) {
            return null;
        }

        const websiteContent = await getWebsiteFallback({
            question,
            pageUrl,
            pageText,
            organizationId,
        });

        if (!websiteContent?.text?.trim()) {
            return null;
        }

        const webAnswer = await generateWebsiteAnswer({
            question,
            websiteContent,
        });

        if (
            !webAnswer ||
            webAnswer
                .trim()
                .startsWith(
                    "I don't have enough information to answer that."
                )
        ) {
            return null;
        }

        return webAnswer;

    } catch (error) {
        console.error(
            "Website answer generation error:",
            error.message
        );

        return null;
    }
};


// ==========================================
// Main RAG service
// ==========================================

export const generateRAGAnswer = async ({
    question,
    organizationId,
    conversationId,
    pageUrl,
    pageText,
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

        const normalizedQuestion = question.trim();

        // ==========================================
        // 2. Get conversation context
        // ==========================================

        const conversationContext =
            await getConversationContext(conversationId);

        // ==========================================
        // 3. Try current webpage first
        // ==========================================

        let answer = null;

        const hasCurrentPage =
            typeof pageUrl === "string" &&
            pageUrl.trim().length > 0 &&
            typeof pageText === "string" &&
            pageText.trim().length > 0;

        if (hasCurrentPage) {
            console.log("[Chat] Trying current webpage");

            answer = await answerFromWebsite({
                question: normalizedQuestion,
                organizationId,
                pageUrl,
                pageText,
            });
        }

        // ==========================================
        // 4. If webpage cannot answer, search MongoDB
        // ==========================================

        if (!answer) {
            console.log("[Chat] Searching MongoDB knowledge");

            const searchQuery = await rewriteQuery({
                question: normalizedQuestion,
                conversationContext,
            });

            console.log("[DEBUG] Original question:", normalizedQuestion);
            console.log("[DEBUG] Rewritten query:", searchQuery);
            console.log("[DEBUG] Organization ID:", organizationId);

            const results = await searchKnowledge({
                query: searchQuery,
                organizationId,
                limit: 3,
            });

            console.log("[DEBUG] Retrieved chunks:", results.length);
            console.log(
                "[DEBUG] Retrieved content:",
                results.map((chunk) => chunk.content)
            );

            let relevantChunks = [];

            if (results.length > 0) {
                relevantChunks = await checkKnowledgeRelevance({
                    question: normalizedQuestion,
                    knowledgeChunks: results,
                });
            }

            console.log("[DEBUG] Relevant chunks:", relevantChunks.length);
            console.log(
                "[DEBUG] Relevant content:",
                relevantChunks.map((chunk) => chunk.content)
            );

            if (relevantChunks.length > 0) {
                const knowledgeContext = relevantChunks
                    .map((chunk) => chunk.content)
                    .join("\n\n");

                const systemPrompt = `
You are a customer support assistant.

Answer using ONLY the supplied knowledge-base information.

Rules:
- Answer directly and accurately.
- Do not invent facts or use outside knowledge.
- Preserve names, numbers, dates, and conditions.
- If the information is insufficient, return exactly:
${FALLBACK_MESSAGE}
- Return only the answer.
`;

                const userPrompt = `
KNOWLEDGE BASE:
${knowledgeContext}

QUESTION:
${normalizedQuestion}
`;

                const response = await generateLLMResponse({
                    systemPrompt,
                    userPrompt,
                });

                const ragAnswer = response?.answer?.trim();

                if (
                    ragAnswer &&
                    !ragAnswer.startsWith(
                        "I don't have enough information to answer that."
                    )
                ) {
                    answer = ragAnswer;
                }
            }
        }

        // ==========================================
        // 5. Final fallback
        // ==========================================

        if (!answer) {
            answer = FALLBACK_MESSAGE;
        }
        // ==========================================
        // 9. Save conversation once
        // ==========================================

        await addMessageToContext(
            conversationId,
            "user",
            normalizedQuestion
        );

        await addMessageToContext(
            conversationId,
            "assistant",
            answer
        );

        // ==========================================
        // 10. Return final answer
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