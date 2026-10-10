import knowledgeSourceModel from "../models/knowledgeSource.model.js";
import { getConversationCount } from "../services/vector/conversationCounter.service.js";

export const getDashboardStats = async (req, res) => {
    try {
        const organizationId = req.user.organizationId;
        if (!organizationId) {
            return res.status(400).json({
                success: false,
                message: "Organization ID is required."
            });
        }
        const [knowledgeSources, readySources, failedSources, aiConversations] = await Promise.all([knowledgeSourceModel.countDocuments({ organizationId, }), knowledgeSourceModel.countDocuments({organizationId, status: "ready"}), knowledgeSourceModel.countDocuments({organizationId, status: "failed"}), getConversationCount(organizationId),]);
        return res.status(200).json({
            success: true,
            data: {
                knowledgeSources,
                readySources,
                failedSources,
                aiConversations
            },
        });
    } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        return res.status(500).json({
            success: false,
            message: "Error fetching dashboard stats",
        });
    }
};