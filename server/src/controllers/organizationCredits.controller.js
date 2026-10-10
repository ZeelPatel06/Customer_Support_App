import organizationCredentialsModel from "../models/organizationCredits.model.js";
import { createOrganizationCredentials } from "../services/credentials/organizationCredential.service.js";

export const generateOrganizationCredentails = async (req, res) => {
    try {
        if (req.user.role !== "owner") {
            return res.status(403).json({
                message: "Only the organization owner can generate API credentials",
            });
        }
        const { environment = "test" } = req.body;
        if (!["test", "live"].includes(environment)) {
            return res.status(400).json({
                message: "Invalid environment",
            });
        }
        const { credential, secretKey } = await createOrganizationCredentials({
            organizationId: req.user.organizationId,
            environment,
        });
        return res.status(201).json({
            message: `${environment} credentials generated successfully`,
            credentials: {
                id: credential._id,
                publicKey: credential.publicKey,
                secretKey,
                environment: credential.environment,
                status: credential.status,
                createdAt: credential.createdAt
            },
        });
    } catch (err) {
        if (
            err.message.includes("Active test credentials already exist") ||
            err.message.includes("Active live credentials already exist")
        ) {
            return res.status(409).json({
                message: err.message
            });
        }

        console.error("Error generating organization credentials:", err);

        return res.status(500).json({
            message: "Error generating organization credentials",
        });
    }
};

export const getOrganizationCredentials = async (req, res) => {
    try {
        if (req.user.role !== "owner") {
            return res.status(403).json({
                message: "Only the organization owner can view API credentials."
            });
        }
        const credentials = await organizationCredentialsModel.find({ organizationId: req.user.organizationId }).select("-secretKeyHash").sort({ createdAt: -1 });
        return res.status(200).json({
            message: "Organization credentials retrieved successfully",
            credentials
        });
    } catch (err) {
        console.error("Error retrieving organization credentials:", err);
        return res.status(500).json({
            message: "Error retrieving organization credentials",
        });
    }
};

export const revokeOrganizationCredentials = async (req, res) => {
    try {
        if (req.user.role !== "owner") {
            return res.status(403).json({
                message: "Only the organization owner can revoke API credentials"
            });
        }
        const { credentialId } = req.params;
        const credential = await organizationCredentialsModel.findOne({ _id: credentialId, organizationId: req.user.organizationId, status: "active", });
        if (!credential) {
            return res.status(404).json({
                message: "Active credential not found",
            });
        }
        credential.status = "revoked";
        await credential.save();
        return res.status(200).json({
            message: "Credential revoked successfully"
        });
    } catch (err) {
        console.error("Error revoking organization credential:", err);
        return res.status(500).json({
            message: "Error revoking organization credential"
        });
    }
};