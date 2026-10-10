import knowledgeChunkModel from "../models/knowledgeChunk.model.js";
import knowledgeSourceModel from "../models/knowledgeSource.model.js";

import { chunkText } from "../services/chunking.service.js";
import { generateEmbeddings } from "../services/embeddings/embedding.service.js";
import { extractDocumentText } from "../services/documentExtractor.service.js";

export const addManualText = async (req, res) => {
    let knowledgeSource;
    try {
        const { title, content } = req.body;
        const organizationId = req.user.organizationId;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and Content are required.",
            });
        }

        knowledgeSource = await knowledgeSourceModel.create({
            organizationId,
            title: title.trim(),
            sourceType: "text",
            status: "processing",
        });

        // Create chunks
        const chunks = chunkText(content);

        if (!Array.isArray(chunks) || chunks.length === 0) {
            throw new Error(
                "Text chunking failed: chunkText did not return an array of strings."
            );
        }

        // Generate embeddings
        const embeddings = await generateEmbeddings(chunks);

        if (chunks.length !== embeddings.length) {
            throw new Error("Chunks and embeddings count do not match.");
        }

        // Prepare chunk documents
        const chunkDocuments = chunks.map((chunk, index) => ({
            organizationId,
            sourceId: knowledgeSource._id,
            content: chunk,
            chunkIndex: index,
            embedding: embeddings[index],
        }));

        // Save chunks
        await knowledgeChunkModel.insertMany(chunkDocuments);

        // Mark source as ready
        knowledgeSource.status = "ready";
        await knowledgeSource.save();

        return res.status(201).json({
            success: true,
            message: "Knowledge added successfully",
            data: {
                knowledgeSource,
                chunksCreated: chunks.length,
            },
        });
    } catch (err) {
        if(knowledgeSource) {
            knowledgeSource.status = "failed";
            await knowledgeSource.save();
        }
        console.error("Error adding manual knowledge:", err);

        return res.status(500).json({
            success: false,
            message: "Error adding manual knowledge.",
            error: err.message,
        });
    }
};

const getSourceType = (mimetype) => {
    const sourceTypes = {
        "application/pdf": "pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            "docx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            "xlsx",
        "text/plain": "txt",
        "text/csv": "csv",
    };

    return sourceTypes[mimetype];
};

export const addDocumentKnowledge = async (req, res) => {
    let knowledgeSource;

    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Document file is required",
            });
        }

        const organizationId = req.user.organizationId;
        const { title } = req.body;
        const { originalname, mimetype } = req.file;

        const sourceType = getSourceType(mimetype);

        if (!sourceType) {
            return res.status(400).json({
                success: false,
                message: "Unsupported document type",
            });
        }

        knowledgeSource = await knowledgeSourceModel.create({
            organizationId,
            title: title?.trim() || originalname,
            sourceType,
            status: "processing",
        });

        // Extract text
        const extractedText = await extractDocumentText(req.file);

        if (!extractedText || !extractedText.trim()) {
            knowledgeSource.status = "failed";
            await knowledgeSource.save();

            return res.status(400).json({
                success: false,
                message: "No readable text found in the document",
            });
        }

        // Create chunks
        const chunks = chunkText(extractedText);

        if (!Array.isArray(chunks) || chunks.length === 0) {
            knowledgeSource.status = "failed";
            await knowledgeSource.save();

            return res.status(400).json({
                success: false,
                message: "No chunks could be created from the document",
            });
        }

        // Generate embeddings
        const embeddings = await generateEmbeddings(chunks);

        if (!Array.isArray(embeddings) || chunks.length !== embeddings.length) {
            throw new Error("Chunks and embeddings count do not match.");
        }

        // Prepare MongoDB documents
        const chunkDocuments = chunks.map((chunk, index) => ({
            organizationId,
            sourceId: knowledgeSource._id,
            content: chunk,
            chunkIndex: index,
            embedding: embeddings[index],
        }));

        // Save chunks + embeddings
        await knowledgeChunkModel.insertMany(chunkDocuments);

        // Mark source as ready
        knowledgeSource.status = "ready";
        await knowledgeSource.save();

        return res.status(201).json({
            success: true,
            message: "Document processed successfully",
            data: {
                knowledgeSource,
                chunksCreated: chunks.length,
            },
        });
    } catch (err) {
        console.error("Error processing document:", err);

        if (knowledgeSource) {
            knowledgeSource.status = "failed";
            await knowledgeSource.save();
        }

        return res.status(500).json({
            success: false,
            message: "Error in processing document.",
            error: err.message,
        });
    }
};