import knowledgeChunkModel from "../models/knowledgeChunk.model.js";
import knowledgeSourceModel from "../models/knowledgeSource.model.js";

export const getKnowledgeChunks = async (req, res) => {
    try {
        const { sourceId } = req.params;
        const organizationId = req.user.organizationId;
        const source = await knowledgeSourceModel.findOne({
            _id: sourceId,
            organizationId
        });
        if (!source) {
            return res.status(404).json({
                success: false,
                message: "Knowledge source not found"
            });
        }
        const chunks = await knowledgeChunkModel.find({ sourceId, organizationId }).select("-embedding").sort({ chunkIndex: 1 });
        return res.status(200).json({
            success: true,
            data: chunks
        });
    } catch (err) {
        console.error("Error fetching knowledge chunks", err);
        return res.status(500).json({
            success: false,
            message: "Error fetching knowledge chunks"
        });
    }
};