import {
    addAllowedOriginService,
    removeAllowedOriginService,
    getAllowedOriginsService,
} from "../services/credentials/originAllowed.service.js";


export const getAllowedOrigins = async (req, res) => {

    try {

        const organizationId =
            req.user.organizationId;

        const origins =
            await getAllowedOriginsService({
                organizationId,
            });

        return res.status(200).json({
            success: true,
            data: origins,
        });

    } catch (error) {

        console.error(
            "Error fetching allowed origins:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Error fetching allowed origins",
        });
    }
};


export const addAllowedOrigin = async (req, res) => {

    try {

        const organizationId =
            req.user.organizationId;

        const { origin } = req.body;

        if (!origin) {
            return res.status(400).json({
                success: false,
                message: "Origin is required",
            });
        }

        const origins =
            await addAllowedOriginService({
                organizationId,
                origin,
            });

        return res.status(201).json({
            success: true,
            message: "Allowed origin added successfully",
            data: origins,
        });

    } catch (error) {

        if (
            error.message ===
            "Origin is already allowed"
        ) {
            return res.status(409).json({
                success: false,
                message: error.message,
            });
        }

        if (
            error.message ===
            "Invalid origin" ||
            error.message.includes(
                "Only HTTP and HTTPS"
            ) ||
            error.message.includes(
                "must not contain"
            )
        ) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        console.error(
            "Error adding allowed origin:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Error adding allowed origin",
        });
    }
};


export const removeAllowedOrigin = async (req, res) => {

    try {

        const organizationId =
            req.user.organizationId;

        const { origin } = req.body;

        if (!origin) {
            return res.status(400).json({
                success: false,
                message: "Origin is required",
            });
        }

        const origins =
            await removeAllowedOriginService({
                organizationId,
                origin,
            });

        return res.status(200).json({
            success: true,
            message: "Allowed origin removed successfully",
            data: origins,
        });

    } catch (error) {

        if (
            error.message === "Origin is required" ||
            error.message ===
            "This website is not allowed to use the chatbot"
        ) {
            return res.status(403).json({
                message: error.message,
            });
        }

        if (
            error.message === "Invalid origin"
        ) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        console.error(
            "Error removing allowed origin:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Error removing allowed origin",
        });
    }
};