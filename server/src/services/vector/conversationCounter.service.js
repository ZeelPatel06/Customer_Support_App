import redisClient from "../../config/redis.js";

const getConversationCountKey = (organizationId) => {
    return `organization:conversation-count:${organizationId}`;
};

export const incrementConversationCount = async (organizationId) => {
    if(!organizationId) {
        throw new Error("Organization ID is required");
    }

    const key = getConversationCountKey(organizationId);
    return await redisClient.incr(key);
};

export const getConversationCount = async (organizationId) => {
    if(!organizationId) {
        throw new Error("Organization ID is required")
    }

    const key = getConversationCountKey(organizationId);
    const count = await redisClient.get(key);
    return count ? Number(count) : 0;
};