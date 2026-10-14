import * as cheerio from "cheerio";

const MAX_RESPONSE_BYTES = 1_000_000;
const FETCH_TIMEOUT_MS = 8_000;

export const fetchWebsiteContent = async (url) => {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, FETCH_TIMEOUT_MS);

    try {
        const response = await fetch(url, {
            method: "GET",
            redirect: "manual",
            signal: controller.signal,
            headers: {
                Accept: "text/html",
                "User-Agent": "CusSupAI/1.0",
            },
        });

        // Redirects require a separately validated destination.
        if (
            response.status >= 300 &&
            response.status < 400
        ) {
            return null;
        }

        if (!response.ok) {
            return null;
        }

        const contentType =
            response.headers.get("content-type") || "";

        if (!contentType.toLowerCase().includes("text/html")) {
            return null;
        }

        const contentLength = Number(
            response.headers.get("content-length") || 0
        );

        if (
            contentLength > MAX_RESPONSE_BYTES
        ) {
            return null;
        }

        if (!response.body) {
            return null;
        }

        const reader = response.body.getReader();

        const chunks = [];
        let totalBytes = 0;

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }

            totalBytes += value.byteLength;

            if (totalBytes > MAX_RESPONSE_BYTES) {
                await reader.cancel();
                return null;
            }

            chunks.push(Buffer.from(value));
        }

        const html = Buffer.concat(chunks).toString("utf8");

        const $ = cheerio.load(html);

        $(
            "script, style, noscript, iframe, svg, nav, footer, header"
        ).remove();

        const title = $("title").text().trim();

        const text = $("body")
            .text()
            .replace(/\s+/g, " ")
            .trim();

        if (!text) {
            return null;
        }

        return {
            title,
            text: text.slice(0, 30_000),
            fetchedAt: Date.now(),
        };
    } catch (error) {
        if (error.name === "AbortError") {
            console.warn("Website fetch timed out");
        } else {
            console.error("Website fetch failed:", error.message);
        }

        return null;
    } finally {
        clearTimeout(timeout);
    }
};