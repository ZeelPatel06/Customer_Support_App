import redisClient from "../../config/redis.js";

const CONTEXT_TTL = 60 * 30; // 30 minutes
const MAX_MESSAGES = 10;

const getContextKey = (conversationId) => {
    return `conversation:context:${conversationId}`;
};

export const getConversationContext = async (conversationId) => {
    if (!conversationId) {
        throw new Error("Conversation ID is required");
    }

    const key = getContextKey(conversationId);

    const context = await redisClient.get(key);

    if (!context) {
        return [];
    }

    return JSON.parse(context);
};

export const addMessageToContext = async (
    conversationId,
    role,
    content
) => {
    if (!conversationId) {
        throw new Error("Conversation ID is required");
    }

    if (!role || !content) {
        throw new Error("Role and content are required");
    }

    const key = getContextKey(conversationId);

    const context = await getConversationContext(conversationId);

    context.push({
        role,
        content,
    });

    // Keep only the latest messages
    const recentContext = context.slice(-MAX_MESSAGES);

    await redisClient.set(key, JSON.stringify(recentContext), {
        EX: CONTEXT_TTL,
    });

    return recentContext;
};

export const clearConversationContext = async (conversationId) => {
    if (!conversationId) {
        throw new Error("Conversation ID is required");
    }

    const key = getContextKey(conversationId);

    await redisClient.del(key);
};