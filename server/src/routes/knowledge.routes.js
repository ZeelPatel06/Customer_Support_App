import express from "express";
import { addManualText, addDocumentKnowledge } from "../controllers/knowledge.controller.js";
import { tokenMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { deleteKnowledgeSource, getAllKnowledgeSources, getKnowledgeSourceById, getManualKnowledgeContent, updateKnowledgeSource, updateManualText } from "../controllers/knowledgeSource.controller.js";
import { getKnowledgeChunks } from "../controllers/knowledgeChunk.controller.js";

const knowledgeRouter = express.Router();

// Knowledge Uploading APIs
knowledgeRouter.post("/manual-text", tokenMiddleware, addManualText);
knowledgeRouter.post("/document", tokenMiddleware, upload.single("file"), addDocumentKnowledge);

// Knowledge Source APIs
knowledgeRouter.get("/", tokenMiddleware, getAllKnowledgeSources);
knowledgeRouter.get("/:id", tokenMiddleware, getKnowledgeSourceById);
knowledgeRouter.delete("/:id", tokenMiddleware, deleteKnowledgeSource);
knowledgeRouter.patch("/:id", tokenMiddleware, updateKnowledgeSource);
knowledgeRouter.put("/knowledge/:id", tokenMiddleware, updateManualText);

// Knowledge Chunks APIs
knowledgeRouter.get("/:sourceId/chunks", tokenMiddleware, getKnowledgeChunks);
knowledgeRouter.get("/knowledge/:id/content", tokenMiddleware, getManualKnowledgeContent);

export default knowledgeRouter;