import Groq from "groq-sdk";
import config from "../../../config/config.js";

const groq = new Groq({
    apiKey: config.LLM_API_KEY,
});

const GROQ_MODEL = "openai/gpt-oss-20b";

export const generateGroqResponse = async ({
    systemPrompt,
    userPrompt,
}) => {

    const response = await groq.chat.completions.create({
        model: GROQ_MODEL,

        messages: [
            {
                role: "system",
                content: systemPrompt,
            },
            {
                role: "user",
                content: userPrompt,
            },
        ],

        temperature: 0.1,
    });

    return {
        answer:
            response?.choices?.[0]?.message?.content?.trim() || "",

        usage: response?.usage || null,
    };
};