import mongoose from "mongoose";

const organizationCredentialsSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "organization",
        required: [true, "OrganizationId is required"],
        index: true,
    },
    publicKey: {
        type: String,
        required: [true, "Public Key is required"],
        unique: true,
        index: true
    },
    secretKeyHash: {
        type: String,
        required: true,
        select: false
    },
    environment: {
        type: String,
        enum: ["test", "live"],
        default: "test",
        required: [true, "Environment is required"]
    },
    status: {
        type: String,
        enum: ["active", "revoked"],
        default: "active",
        required: [true, "status is required"]
    },
    lastUsedAt: {
        type: Date,
        default: null
    },
}, {
    timestamps: true
});

const organizationCredentialsModel = mongoose.model("organizationCredit", organizationCredentialsSchema);

export default organizationCredentialsModel;