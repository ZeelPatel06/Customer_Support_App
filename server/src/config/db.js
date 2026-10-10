import config from "./config.js";
import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(config.MONGODB_URI)
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection Failed:", error.message);
    }
};

export default connectDb;