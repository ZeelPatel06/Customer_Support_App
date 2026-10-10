import mongoose from "mongoose";

const widgetSessionSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: [true, "Session ID is required"],
        unique: true,
        index: true
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "organization",
        index: true,
        required: [true, "Organization ID is required"]
    },
    conversationId: {
        type: String,
        required: [true, "Conversation ID is required"],
        index: true
    },
    credentialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "organizationCredit",
        required: true
    },
    expiresAt: {
        type: Date,
        required: [true, "Expires Date is required"],
    },
}, {
    timestamps: true
});

widgetSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const widgetSessionModel = mongoose.model("widgetSession", widgetSessionSchema);

export default widgetSessionModel;