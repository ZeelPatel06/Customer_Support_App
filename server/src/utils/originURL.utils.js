export const normalizeOrigin = (value) => {
    if (!value || typeof value !== "string") {
        throw new Error("Origin is required");
    }

    const trimmedOrigin = value.trim();

    let url;

    try {
        url = new URL(trimmedOrigin);
    } catch {
        throw new Error("Invalid origin");
    }

    if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error("Only HTTP and HTTPS origins are allowed");
    }

    if (url.pathname !== "/" && url.pathname !== "") {
        throw new Error(
            "Origin must not contain a path"
        );
    }

    if (url.search || url.hash) {
        throw new Error(
            "Origin must not contain query parameters or hash"
        );
    }

    return url.origin;
};