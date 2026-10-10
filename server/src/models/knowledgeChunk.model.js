import mongoose from "mongoose";

const knowledgeChunkSchema = new mongoose.Schema({
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "organization",
            required: [true, "organizationId is required"]
        },
        sourceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "knowledgesource",
            required: [true, "sourceId is required"]
        },
        content: {
            type: String,
            required: [true, "content is required"]
        },
        chunkIndex: {
            type: Number,
            required: [true, "chunkIndex is required"]
        },
        embedding: {
            type: [Number],
            required: [true, "embedding are required"]
        }
    },
{
    timestamps: true
})

const knowledgeChunkModel = mongoose.model("knowledgeChunk", knowledgeChunkSchema);

export default knowledgeChunkModel;