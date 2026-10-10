import knowledgeChunkModel from "../models/knowledgeChunk.model.js";
import knowledgeSourceModel from "../models/knowledgeSource.model.js";
import { chunkText } from "../services/chunking.service.js";
import { generateEmbedding } from "../services/embeddings/embedding.service.js";

export const getAllKnowledgeSources = async (req, res) => {
    try {

        const organizationId = req.user.organizationId;
        const sources = await knowledgeSourceModel.find({ organizationId }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: sources });
    } catch (err) {
        console.error("Error fetching knowledge sources", err);
        return res.status(500).json({
            success: false,
            message: "Error fetching knowledge sources."
        });
    }
};

export const getKnowledgeSourceById = async (req, res) => {
    try {
        const { id } = req.params;
        const organizationId = req.user.organizationId;

        const source = await knowledgeSourceModel.findOne({ _id: id, organizationId });
        if (!source) {
            return res.status(404).json({
                success: false,
                message: "Knowledge source not found"
            });
        }
        return res.status(200).json({
            success: true,
            data: source
        });
    } catch (err) {
        console.error("Error fetching knowledge source", err);
        return res.status(500).json({
            success: false,
            message: "Error fetching knowledge source"
        });
    }
};

export const deleteKnowledgeSource = async (req, res) => {
    try {
        const { id } = req.params;
        const organizationId = req.user.organizationId;

        const source = await knowledgeSourceModel.findOne({ _id: id, organizationId });
        if (!source) {
            return res.status(404).json({
                success: false,
                message: "Knowledge source not found"
            });
        }
        await knowledgeChunkModel.deleteMany({
            sourceId: source._id,
            organizationId
        });
        await knowledgeSourceModel.deleteOne({
            _id: source._id,
        });

        return res.status(200).json({
            success: true,
            message: "Knowledge source deleted successfully"
        });
    } catch (err) {
        console.error("Error Deleting knowledge source.", err);
        return res.status(500).json({
            success: false,
            message: "Error deleting knowledge source"
        });
    }
};

export const updateKnowledgeSource = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const organizationId = req.user.organizationId;
        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }
        const source = await knowledgeSourceModel.findOneAndUpdate(
            {
                _id: id,
                organizationId
            },
            {
                title: title.trim()
            },
            {
                new: true
            }
        );
        if (!source) {
            return res.status(404).json({
                success: false,
                message: "Knowledge source not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Knowledge source updated successfully",
            data: source
        });
    } catch (err) {
        console.error("Error Updating knowledge source", err);
        return res.status(500).json({
            success: false,
            message: "Error updating knowledge source"
        });
    }
};

export const updateManualText = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            title,
            content,
        } = req.body;

        const organizationId =
            req.user.organizationId;


        // ---------------------------------------------
        // 1. Validate request
        // ---------------------------------------------

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title is required",
            });
        }

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Content is required",
            });
        }


        // ---------------------------------------------
        // 2. Find manual knowledge source
        // ---------------------------------------------

        const source =
            await knowledgeSourceModel.findOne({
                _id: id,
                organizationId,
                sourceType: "text",
            });

        if (!source) {
            return res.status(404).json({
                success: false,
                message: "Manual knowledge source not found",
            });
        }


        // ---------------------------------------------
        // 3. Chunk new content
        // ---------------------------------------------

        const chunks =
            chunkText(content.trim());

        if (
            !Array.isArray(chunks) ||
            chunks.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "No chunks could be created from the content",
            });
        }


        // ---------------------------------------------
        // 4. Remove invalid/empty chunks
        // ---------------------------------------------

        const validChunks = chunks
            .filter(
                (chunk) =>
                    typeof chunk === "string"
            )
            .map((chunk) => chunk.trim())
            .filter(Boolean);


        if (validChunks.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid content chunks were created",
            });
        }


        // ---------------------------------------------
        // 5. Generate ONE embedding per chunk
        // ---------------------------------------------

        const embeddings = [];

        for (const chunk of validChunks) {

            if (!chunk) {
                throw new Error(
                    "Cannot generate embedding for empty chunk"
                );
            }

            const embedding =
                await generateEmbedding(chunk);

            if (
                !Array.isArray(embedding) ||
                embedding.length === 0
            ) {
                throw new Error(
                    "Invalid embedding returned from embedding service"
                );
            }

            embeddings.push(embedding);
        }


        // ---------------------------------------------
        // 6. Final mismatch protection
        // ---------------------------------------------

        if (
            validChunks.length !==
            embeddings.length
        ) {
            throw new Error(
                `Chunks and embeddings count mismatch. Chunks: ${validChunks.length}, Embeddings: ${embeddings.length}`
            );
        }


        // ---------------------------------------------
        // 7. Delete old chunks
        // ---------------------------------------------

        await knowledgeChunkModel.deleteMany({
            sourceId: source._id,
            organizationId,
        });


        // ---------------------------------------------
        // 8. Create new chunk documents
        // ---------------------------------------------

        const chunkDocuments =
            validChunks.map(
                (chunk, index) => ({
                    organizationId,
                    sourceId: source._id,
                    content: chunk,
                    chunkIndex: index,
                    embedding: embeddings[index],
                })
            );


        // ---------------------------------------------
        // 9. Insert new chunks
        // ---------------------------------------------

        await knowledgeChunkModel.insertMany(
            chunkDocuments
        );


        // ---------------------------------------------
        // 10. Update source
        // ---------------------------------------------

        source.title =
            title.trim();

        source.status =
            "ready";

        await source.save();


        // ---------------------------------------------
        // 11. Response
        // ---------------------------------------------

        return res.status(200).json({
            success: true,
            message:
                "Manual knowledge updated successfully",

            data: {
                knowledgeSource: source,
                chunksCreated:
                    validChunks.length,
            },
        });

    } catch (err) {

        console.error(
            "Error updating manual knowledge:",
            err
        );

        return res.status(500).json({
            success: false,
            message:
                "Error updating manual knowledge",
            error: err.message,
        });
    }
};

export const getManualKnowledgeContent = async (req, res) => {
    try {
        const { id } = req.params;
        const organizationId = req.user.organizationId;

        const source = await knowledgeSourceModel.findOne({
            _id: id,
            organizationId,
            sourceType: "text",
        });

        if (!source) {
            return res.status(404).json({
                success: false,
                message: "Manual knowledge source not found",
            });
        }

        const chunks = await knowledgeChunkModel
            .find({
                sourceId: source._id,
                organizationId,
            })
            .sort({ chunkIndex: 1 });

        const content = chunks
            .map((chunk) => chunk.content)
            .join("\n\n");

        return res.status(200).json({
            success: true,
            data: {
                title: source.title,
                content,
            },
        });

    } catch (err) {
        console.error(
            "Error fetching manual knowledge content:",
            err
        );

        return res.status(500).json({
            success: false,
            message: "Error fetching manual knowledge content",
        });
    }
};