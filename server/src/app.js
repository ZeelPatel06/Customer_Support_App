import connectDB from "./config/db.js";
import express from "express";

// Importing Routes
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import knowledgeRouter from "./routes/knowledge.routes.js";
import organizationCredentialRouter from "./routes/organizationCredits.routes.js";

// Importing Packages Required
import { errorHandler } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import config from "./config/config.js";
import { dynamicCors } from "./middlewares/widgetSession.middleware.js";
import allowedOriginRouter from "./routes/allowedOrigin.routes.js";

connectDB();

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(dynamicCors);

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server API is healthy",
    });
});

// Routes for Web API
app.use("/api/auth", authRouter);
app.use("/api/knowledge/data", knowledgeRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/organization/credentials", organizationCredentialRouter);
app.use("/api/organization", allowedOriginRouter);

app.use(errorHandler);

export default app;