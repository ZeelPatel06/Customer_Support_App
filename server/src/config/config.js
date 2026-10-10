import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in the env file");
}

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the env file");
}

if (!process.env.REDIS_URI) {
    throw new Error("REDIS_URI is not defined in the env file");
}

if (!process.env.FRONTEND_URL) {
    throw new Error("FRONTEND_URL is not defined in the env file");
}

if (!process.env.LLM_API_KEY) {
    throw new Error("LLM_API_KEY is not defined in the env file");
}

if (!process.env.EMBEDDING_API_KEY) {
    throw new Error("EMBEDDING_API_KEY is not defined in the env file");
}

const config = {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV || "development",
    REDIS_URI: process.env.REDIS_URI,
    FRONTEND_URL: process.env.FRONTEND_URL,
    LLM_API_KEY: process.env.LLM_API_KEY,
    LLM_PROVIDER: process.env.LLM_PROVIDER,
    EMBEDDING_API_KEY: process.env.EMBEDDING_API_KEY,
}


export default config;