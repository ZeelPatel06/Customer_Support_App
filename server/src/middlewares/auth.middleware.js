import jwt from "jsonwebtoken";
import config from "../config/config.js";
import redisClient from "../config/redis.js";
import userModel from "../models/user.model.js";

export const tokenMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.["jwt-token"] || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Not authorized" });
        }
        const isBlacklisted = await redisClient.get(`blacklist:${token}`);
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token is blacklisted" });
        }
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = await userModel.findById(decoded.id || decoded._id);
        req.tokenPayload = decoded;
        if (!req.user) {
            return res.status(404).json({ message: "User account Not Found" })
        }
        next();
    } catch (error) {
        console.error("Error in token middleware:", error);
        res.status(401).json({ message: "Invalid or Expired token", error });
    }
};
