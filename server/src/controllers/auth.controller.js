import userModel from "../models/user.model.js";
import organizationModel from "../models/organization.model.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";
import bcrypt from "bcryptjs";


const generateToken = (user) => {
    const tokenPayload = {
        id: user._id,
        email: user.email,
        contactNumber: user.contactNumber,
        organizationId: user.organizationId,
    };
    return jwt.sign(
        tokenPayload,
        config.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

export const registerUser = async (req, res) => {
    const { name, email, password, contactNumber, role, organizationName, organizationWebsite, organizationEmail, organizationContactNumber } = req.body;
    if (!name || !email || !password || !contactNumber || !role || !organizationName || !organizationWebsite) {
        return res.status(400).json({ message: "Register fields are required" });
    }
    try {
        const existingUser = await userModel.findOne({ $or: [{ email }, { contactNumber }] });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User with this email or contact number already exists" });
        }
        const organization = await organizationModel.create({ organizationName, organizationWebsite, organizationEmail, organizationContactNumber });
        const newUser = await userModel.create({ name, email, password, contactNumber, role, organizationId: organization._id });
        const token = generateToken(newUser); // Generate token for the new user
        const cookieOptions = {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: config.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        };
        res.cookie("jwt-token", token, cookieOptions);
        res.status(201).json({ message: "User registered successfully", user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, organizationId: newUser.organizationId } });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error registering user", error });
    }
}

export const loginUser = async (req, res) => {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
        return res.status(400).json({ message: "Login fields are required" });
    }
    try {
        const user = await userModel.findOne({ $or: [{ email: identifier }, { contactNumber: identifier }] }).select("+password");
        if (!user) {
            return res.status(404).json({ message: "User not found Please Sign Up" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = generateToken(user); // Generate token for the logged-in user
        const cookieOptions = {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: config.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        };
        res.cookie("jwt-token", token, cookieOptions);
        res.status(200).json({ message: "User logged in successfully", user: { id: user._id, name: user.name, email: user.email, role: user.role, organizationId: user.organizationId } });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Error logging in user", error });
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await userModel
            .findById(req.user._id)
            .populate("organizationId")
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "User retrieved successfully",
            user,
        });
    } catch (error) {
        console.error("Error retrieving user:", error);

        return res.status(500).json({
            message: "Error retrieving user",
        });
    }
};

export const logoutUser = async (req, res) => {
    try {
        const token =
            req.cookies?.["jwt-token"] ||
            req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "No token found"
            });
        }

        const currentTimeInSeconds = Math.floor(Date.now() / 1000);

        const timeToLive =
            req.tokenPayload.exp - currentTimeInSeconds;

        if (timeToLive > 0) {
            await redisClient.set(
                `blacklist:${token}`,
                "true",
                {
                    EX: timeToLive
                }
            );
        }

        res.clearCookie("jwt-token", {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: config.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
        });

        return res.status(200).json({
            message: "User logged out successfully"
        });
    } catch (error) {
        console.error("Error logging out user:", error);

        return res.status(500).json({
            message: "Error logging out user"
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, email, contactNumber, organizationName, organizationWebsite, organizationEmail, organizationContactNumber } = req.body;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }
        const userUpdates = {};
        if (name) userUpdates.name = name;
        if (contactNumber && contactNumber !== user.contactNumber) {
            const existingPhone = await userModel.findOne({ contactNumber });
            if (existingPhone) {
                return res.status(400).json({ message: "Contact Number already in use." });
            }
            userUpdates.contactNumber = contactNumber;
        }
        if (email && email !== user.email) {
            const existingEmail = await userModel.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ message: "Email is already in use." });
            }
            userUpdates.email = email;
        }
        const orgUpdates = {};
        if (organizationName) orgUpdates.organizationName = organizationName;
        if (organizationWebsite) orgUpdates.organizationWebsite = organizationWebsite;
        if (organizationEmail) orgUpdates.organizationEmail = organizationEmail;
        if (organizationContactNumber) orgUpdates.organizationContactNumber = organizationContactNumber;

        let updatedOrg = null;
        if (Object.keys(orgUpdates).length > 0 && user.organizationId) {
            updatedOrg = await organizationModel.findByIdAndUpdate(
                user.organizationId, { $set: orgUpdates }, { returnDocument: 'after', runValidators: true }
            );
        }
        const updatedUser = await userModel.findByIdAndUpdate(userId, { $set: userUpdates }, { returnDocument: 'after', runValidators: true }).populate('organizationId');
        return res.status(200).json({ message: "Profile Updated Successfully", user: { ...updatedUser.toObject(), organizationId: updatedOrg || user.organizationId, }, });
    } catch (error) {
        console.error("Profile Update Error", error);
        res.status(500).json({ message: "Error Updating user", error });
    }
}