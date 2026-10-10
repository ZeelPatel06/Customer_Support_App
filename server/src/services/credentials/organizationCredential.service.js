import crypto from "crypto";
import bcrypt from "bcryptjs";
import organizationCredentialsModel from "../../models/organizationCredits.model.js";

const generateKey = (prefix) => {
    const randomPart = crypto.randomBytes(24).toString("hex");
    return `${prefix}_${randomPart}`;
};

export const createOrganizationCredentials = async ({
    organizationId,
    environment = "test",
}) => {
    const existingCredential =
        await organizationCredentialsModel.findOne({
            organizationId,
            environment,
            status: "active",
        });

    if (existingCredential) {
        const error = new Error(
            `Active ${environment} credentials already exist for this organization`
        );

        error.code = "CREDENTIAL_ALREADY_EXISTS";

        throw error;
    }

    const publicKey = generateKey(
        environment === "live" ? "pk_live" : "pk_test"
    );

    const secretKey = generateKey(
        environment === "live" ? "sk_live" : "sk_test"
    );

    const secretKeyHash = await bcrypt.hash(secretKey, 12);

    const credential = await organizationCredentialsModel.create({
        organizationId,
        publicKey,
        secretKeyHash,
        environment,
        status: "active",
    });

    return {
        credential,
        secretKey,
    };
};