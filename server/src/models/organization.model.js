import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
    organizationName: {
        type: String,
        required: [true, "Organization name is required"],
    },
    organizationWebsite: {
        type: String,
        required: [true, "Organization website is required"],
    },
    allowedOrigins: {
        type: [String],
        default: [],
    },
    organizationEmail: {
        type: String,
    },
    organizationContactNumber: {
        type: String,
    }
}, {
    timestamps: true
});

const organizationModel = mongoose.model("organization", organizationSchema);

export default organizationModel;