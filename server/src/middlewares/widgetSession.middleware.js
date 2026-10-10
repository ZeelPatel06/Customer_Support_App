import widgetSessionModel from "../models/widgetSession.model.js";
import organizationCredentialModel from "../models/organizationCredits.model.js";
import cors from "cors";
import organizationModel from "../models/organization.model.js";
import config from "../config/config.js";

export const widgetSessionMiddlware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({
                message: "Widget Session token is required.",
            });
        }

        const sessionId = authHeader.split(" ")[1];

        if (!sessionId) {
            return res.status(401).json({
                message: "Widget session token is required"
            })
        }

        const session = await widgetSessionModel.findOne({ sessionId });
        if (!session) {
            return res.status(401).json({
                message: "Invalid or expired widget session",
            });
        }
        if (session.expiresAt <= new Date()) {
            return res.status(401).json({
                message: "Widget session has expired"
            });
        }
        const credential = await organizationCredentialModel.findOne({
            _id: session.credentialId,
            organizationId: session.organizationId,
            status: "active"
        });
        if (!credential) {
            return res.status(401).json({
                message: "Widget credential is inactive"
            });
        }
        req.organizationId = session.organizationId;
        req.conversationId = session.conversationId;
        req.widgetSession = session;
        next();
    } catch (err) {
        console.error("Widget session middlware error:", err);

        return res.status(500).json({
            message: "Error validating widget session",
        });
    }
};

export const widgetOriginMiddleware = async (req, res, next) => {
    try {
        const origin = req.headers.origin;

        // Non-browser requests may not contain Origin.
        // For the widget, browser requests should contain it.
        if (!origin) {
            return res.status(403).json({
                message: "Origin is required",
            });
        }

        const organizationId =
            req.organizationId;

        if (!organizationId) {
            return res.status(401).json({
                message: "Organization not identified",
            });
        }

        const organization =
            await organizationModel.findById(
                organizationId
            ).select("allowedOrigins");

        if (!organization) {
            return res.status(404).json({
                message: "Organization not found",
            });
        }

        const allowedOrigins =
            organization.allowedOrigins || [];

        if (!allowedOrigins.includes(origin)) {
            return res.status(403).json({
                message:
                    "This website is not allowed to use the chatbot",
            });
        }

        next();

    } catch (error) {

        console.error(
            "Widget origin validation error:",
            error
        );

        return res.status(500).json({
            message:
                "Error validating widget origin",
        });
    }
};

export const widgetCors = cors({
    origin: async (origin, callback) => {

        try {

            // Requests without Origin
            if (!origin) {
                return callback(null, false);
            }

            const organization =
                await organizationModel.findOne({
                    allowedOrigins: origin,
                }).select("_id");

            if (!organization) {
                return callback(
                    new Error("Origin not allowed")
                );
            }

            return callback(null, origin);

        } catch (error) {

            return callback(error);
        }
    },

    methods: ["POST", "OPTIONS"],

    allowedHeaders: [
        "Content-Type",
        "Authorization",
    ],

    credentials: false,
});

export const dynamicCors = cors({
    origin: async (origin, callback) => {
        try {
            // Allow requests without Origin
            // Example: Postman / server-to-server requests
            if (!origin) {
                return callback(null, true);
            }

            // Allow your dashboard frontend
            if (origin === config.FRONTEND_URL) {
                return callback(null, true);
            }

            // Check organization allowed origins
            const organization = await organizationModel.findOne({
                allowedOrigins: origin,
            });

            if (organization) {
                return callback(null, true);
            }

            return callback(
                new Error("Origin not allowed by CORS")
            );

        } catch (error) {
            return callback(error);
        }
    },

    credentials: true,
});