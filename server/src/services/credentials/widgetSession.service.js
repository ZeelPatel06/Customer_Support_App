import crypto from "crypto";
import organizationCredentialsModel from "../../models/organizationCredits.model.js";
import organizationModel from "../../models/organization.model.js";
import widgetSessionModel from "../../models/widgetSession.model.js";

const WIDGET_SESSION_DURATION = 60 * 60 * 1000;

const generateSessionId = () => {
    return `ws_${crypto.randomBytes(32).toString("hex")}`;
};

const generateConversationId = () => {
    return `conv_${crypto.randomBytes(16).toString("hex")}`;
};

export const createWidgetSessionService = async ({ publicKey, environment = "test", origin }) => {
    if (!publicKey) {
        throw new Error("Public key is required");
    }

    if (!["test", "live"].includes(environment)) {
        throw new Error("Invalid environment");
    }

    const credential = await organizationCredentialsModel.findOne({ publicKey, environment, status: "active" });
    if (!credential) {
        throw new Error("Invalid or inactive public key");
    }

    const organization = await organizationModel.findById(credential.organizationId);

    if (!organization) {
        throw new Error("Organization not found");
    }

    const allowedOrigins =
        organization.allowedOrigins || [];

    if (!origin) {
        throw new Error("Origin is required");
    }

    if (!organization.allowedOrigins.includes(origin)) {
        throw new Error(
            "This website is not allowed to use the chatbot"
        );
    }

    const sessionId = generateSessionId();
    const conversationId = generateConversationId();
    const expiresAt = new Date(Date.now() + WIDGET_SESSION_DURATION);

    const session = await widgetSessionModel.create({
        sessionId,
        conversationId,
        organizationId: organization._id,
        credentialId: credential._id,
        expiresAt,
    });
    return {
        sessionId: session.sessionId,
        conversationId: session.conversationId,
        expiresAt: session.expiresAt,
        organizationId: session.organizationId
    }
}

export const createNewWidgetConversationService = async ({
    sessionId,
}) => {
    const session = await widgetSessionModel.findOne({
        sessionId,
    });

    if (!session) {
        throw new Error("Invalid or expired widget session");
    }

    if (session.expiresAt <= new Date()) {
        throw new Error("Widget session has expired");
    }

    const credential = await organizationCredentialsModel.findOne({
        _id: session.credentialId,
        organizationId: session.organizationId,
        status: "active",
    });

    if (!credential) {
        throw new Error("Widget credential is inactive");
    }

    const conversationId = `conv_${crypto
        .randomBytes(16)
        .toString("hex")}`;

    session.conversationId = conversationId;

    await session.save();

    return {
        conversationId: session.conversationId,
    };
};