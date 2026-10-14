import { generateRAGAnswer } from "../services/rag/rag.service.js";
import crypto from "crypto";
import { clearConversationContext } from "../services/vector/talkContext.service.js";
import { incrementConversationCount } from "../services/vector/conversationCounter.service.js";
import { createWidgetSessionService } from "../services/credentials/widgetSession.service.js";

export const chat = async (req, res, next) => {
    try {
        const { question, conversationId: existingConversationId } = req.body;
        const organizationId = req.user.organizationId;
        const isNewConversation = !existingConversationId;
        const conversationId = existingConversationId || crypto.randomUUID();

        if (!question || !question.trim()) {
            return res.status(400).json({
                success: false,
                message: "Question is requierd",
            });
        }
        if (!organizationId) {
            return res.status(400).json({
                success: false,
                message: "Organization ID is required",
            });
        }
        if (!conversationId) {
            return res.status(400).json({
                success: false,
                message: "Conversation ID is required",
            });
        }

        if (isNewConversation) {
            await incrementConversationCount(organizationId);
        }

        const answer = await generateRAGAnswer({
            question: question.trim(),
            organizationId,
            conversationId,
        });

        return res.status(200).json({
            success: true,
            data: {
                question: question.trim(),
                answer,
                conversationId,
            },
        });
    } catch (err) {
        next(err);
    }
};

export const clearChat = async (req, res) => {
    try {
        const { conversationId } = req.body;
        const organizationId = req.user.organizationId;

        if (!conversationId) {
            return res.status(400).json({
                success: false,
                message: "Conversation ID is required"
            });
        }
        if (!organizationId) {
            return res.status(400).json({
                success: false,
                message: "Organization ID is required"
            })
        }
        await clearConversationContext(conversationId);
        return res.status(200).json({
            success: true,
            message: "Conversation cleared successfully"
        });
    } catch (err) {
        console.error("Error clearing conversation", err);
        return res.status(500).json({
            success: false,
            message: "Error clearing conversation"
        });
    }
};

export const createWidgetSession = async (req, res) => {
    // This is for render deploy testing in localhost.
    // const delay = (ms) =>
    // new Promise((resolve) => setTimeout(resolve, ms));
    // await delay(60_000);
    try {
        const {
            publicKey,
            environment = "test",
        } = req.body;

        const origin = req.headers.origin;

        if (!publicKey) {
            return res.status(400).json({
                success: false,
                code: "PUBLIC_KEY_REQUIRED",
                message: "Chatbot configuration is incomplete.",
            });
        }

        if (!origin) {
            return res.status(400).json({
                success: false,
                code: "ORIGIN_REQUIRED",
                message: "Unable to determine website origin.",
            });
        }

        const session = await createWidgetSessionService({
            publicKey,
            environment,
            origin,
        });

        return res.status(201).json({
            success: true,
            message: "Widget session created successfully",
            data: {
                sessionId: session.sessionId,
                conversationId: session.conversationId,
                expiresAt: session.expiresAt,
            },
        });

    } catch (error) {
        console.error(
            "Error creating widget session:",
            error
        );

        if (error.message === "Origin is not allowed") {
            return res.status(403).json({
                success: false,
                code: "ORIGIN_NOT_ALLOWED",
                message:
                    "This chatbot is not available on this website.",
            });
        }

        if (error.message === "Invalid or inactive public key") {
            return res.status(401).json({
                success: false,
                code: "INVALID_PUBLIC_KEY",
                message:
                    "This chatbot is temporarily unavailable.",
            });
        }

        if (error.message === "Organization not found") {
            return res.status(404).json({
                success: false,
                code: "ORGANIZATION_NOT_FOUND",
                message:
                    "This chatbot is temporarily unavailable.",
            });
        }

        return res.status(500).json({
            success: false,
            code: "WIDGET_SESSION_ERROR",
            message:
                "Unable to connect to support right now. Please try again later.",
        });
    }
};