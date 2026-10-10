import { generateRAGAnswer } from "../services/rag/rag.service.js";
import { createNewWidgetConversationService } from "../services/credentials/widgetSession.service.js";

export const widgetChatController = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({
                message: "Message is required",
            });
        }
        const answer = await generateRAGAnswer({
            question: message,
            organizationId: req.organizationId,
            conversationId: req.conversationId,
        });

        return res.status(200).json({
            message: "Chat response generated successfully",
            data: {
                answer,
            },
        });
    } catch (err) {
        console.error("Widget chat error", err);
        if (err.message === "Question is required") {
            return res.status(400).json({
                message: err.message,
            });
        }
        if (err.message === "Organization ID is required") {
            return res.status(401).json({
                message: "Invalid widget session"
            });
        }
        if (err.message === "Conversation ID is required") {
            return res.status(400).json({
                message: err.message,
            })
        }
        return res.status(500).json({
            message: "Error processing chat request",
        });
    }
};

export const createNewWidgetConversationController = async (
    req,
    res
) => {
    try {
        const result =
            await createNewWidgetConversationService({
                sessionId: req.widgetSession.sessionId,
            });

        return res.status(200).json({
            message: "New conversation created successfully",
            conversationId: result.conversationId,
        });
    } catch (error) {
        if (
            error.message ===
            "Invalid or expired widget session" ||
            error.message ===
            "Widget session has expired" ||
            error.message ===
            "Widget credential is inactive"
        ) {
            return res.status(401).json({
                message: error.message,
            });
        }

        console.error(
            "New widget conversation error:",
            error
        );

        return res.status(500).json({
            message: "Error creating new conversation",
        });
    }
};