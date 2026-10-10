import config from "../../config/config.js";
import { generateGroqResponse } from "./providers/groq.provider.js";

const providers = {
    groq: generateGroqResponse,
};

export const generateLLMResponse = async ({
    systemPrompt,
    userPrompt,
}) => {

    const providerName =
        config.LLM_PROVIDER || "ollama";

    const provider =
        providers[providerName];

    if (!provider) {
        throw new Error(
            `Unsupported LLM provider: ${providerName}`
        );
    }

    return provider({
        systemPrompt,
        userPrompt,
    });
};