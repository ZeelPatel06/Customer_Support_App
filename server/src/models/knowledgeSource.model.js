import mongoose from "mongoose";

const knowledgeSourceSchema = new mongoose.Schema({
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "organization",
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ["processing", "ready", "failed"],
            default: "processing"
        },
        sourceType: {
            type: String,
            enum: ["text", "xlsx", "pdf", "docx", "txt", "csv"],
            default: "text"
        }
    },
{
    timestamps: true
})

const knowledgeSourceModel = mongoose.model("knowledgesource", knowledgeSourceSchema);

export default knowledgeSourceModel;