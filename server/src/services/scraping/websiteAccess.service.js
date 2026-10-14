import organizationModel from "../../models/organization.model.js";

const isLocalHostname = (hostname) => {
    return (
        hostname === "localhost" ||
        hostname.endsWith(".localhost") ||
        hostname === "127.0.0.1" ||
        hostname === "::1"
    );
};

export const validateWebsiteAccess = async ({
    pageUrl,
    organizationId,
}) => {
    if (!pageUrl || !organizationId) {
        return {
            allowed: false,
            reason: "Missing page URL or organization",
        };
    }

    let parsedUrl;

    try {
        parsedUrl = new URL(pageUrl);
    } catch {
        return {
            allowed: false,
            reason: "Invalid page URL",
        };
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return {
            allowed: false,
            reason: "Unsupported URL protocol",
        };
    }

    if (parsedUrl.username || parsedUrl.password) {
        return {
            allowed: false,
            reason: "Credentials in URLs are not allowed",
        };
    }

    // Reject local development addresses in production.
    if (
        process.env.NODE_ENV === "production" &&
        isLocalHostname(parsedUrl.hostname)
    ) {
        return {
            allowed: false,
            reason: "Localhost is not allowed in production",
        };
    }

    const organization = await organizationModel
        .findById(organizationId)
        .select("allowedOrigins")
        .lean();

    if (!organization) {
        return {
            allowed: false,
            reason: "Organization not found",
        };
    }

    // Compare the exact parsed origin, not URL substrings.
    if (!organization.allowedOrigins.includes(parsedUrl.origin)) {
        return {
            allowed: false,
            reason: "Page origin is not authorized",
        };
    }

    return {
        allowed: true,
        url: parsedUrl,
    };
};