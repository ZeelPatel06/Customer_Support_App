import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "User name is required"]
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "organization",
        required: [true, "Organization ID is required"]
    },
    role: {
        type: String,
        required: [true, "User role is required"],
        enum: ["owner", "staff", "user"],
        default: "user"
    },
    email: {
        type: String,
        required: [true, "User email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "User password is required"],
        select: false
    },
    contactNumber: {
        type: String,
        required: [true, "User contact number is required"],
        unique: true
    },
}, {
    timestamps: true
})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        console.error("Error hashing password:", error);
        throw error;
    }
});

const userModel = mongoose.model("user", userSchema);

export default userModel;