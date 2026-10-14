import {
    validateWebsiteAccess,
} from "./websiteAccess.service.js";

import {
    fetchWebsiteContent,
} from "./websiteFetch.service.js";

import {
    getCachedWebsiteContent,
    cacheWebsiteContent,
} from "./websiteCache.service.js";

export const getWebsiteFallback = async ({
    question,
    pageUrl,
    organizationId,
    pageText,
}) => {
    try {
        const access = await validateWebsiteAccess({
            pageUrl,
            organizationId,
        });

        if (!access.allowed) {
            console.warn(
                "Website access denied:",
                access.reason
            );

            return null;
        }
        if (typeof pageText === "string" && pageText.trim()) {
            return {
                title: "",
                text: pageText.trim().slice(0, 30000),
            };
        }
        // Do not read cache until URL authorization succeeds.
        const cached = await getCachedWebsiteContent({
            organizationId,
            pageUrl: access.url.toString(),
        });

        if (cached) {
            return cached;
        }

        const content = await fetchWebsiteContent(
            access.url.toString()
        );

        if (!content) {
            return null;
        }

        await cacheWebsiteContent({
            organizationId,
            pageUrl: access.url.toString(),
            content,
        });

        return content;
    } catch (error) {
        console.error(
            "Website fallback error:",
            error.message
        );

        return null;
    }
};