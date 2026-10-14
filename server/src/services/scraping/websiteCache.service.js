import redis from "../../config/redis.js";

const WEBSITE_CACHE_TTL = 300;

const createCacheKey = ({
    organizationId,
    pageUrl,
}) => {
    const normalizedUrl = new URL(pageUrl);

    // Remove fragments because they do not identify server-side content.
    normalizedUrl.hash = "";

    return [
        "website-cache",
        organizationId.toString(),
        encodeURIComponent(normalizedUrl.toString()),
    ].join(":");
};

export const getCachedWebsiteContent = async ({
    organizationId,
    pageUrl,
}) => {
    const key = createCacheKey({
        organizationId,
        pageUrl,
    });

    const cached = await redis.get(key);

    if (!cached) {
        return null;
    }

    try {
        return JSON.parse(cached);
    } catch {
        await redis.del(key);
        return null;
    }
};

export const cacheWebsiteContent = async ({
    organizationId,
    pageUrl,
    content,
}) => {
    const key = createCacheKey({
        organizationId,
        pageUrl,
    });

    await redis.set(
        key,
        JSON.stringify(content),
        "EX",
        WEBSITE_CACHE_TTL
    );
};