import organizationModel from "../../models/organization.model.js";
import { normalizeOrigin } from "../../utils/originURL.utils.js";

export const addAllowedOriginService = async ({
    organizationId,
    origin,
}) => {

    const normalizedOrigin =
        normalizeOrigin(origin);

    const organization =
        await organizationModel.findById(organizationId);

    if (!organization) {
        throw new Error("Organization not found");
    }

    if (
        organization.allowedOrigins.includes(
            normalizedOrigin
        )
    ) {
        throw new Error(
            "Origin is already allowed"
        );
    }

    organization.allowedOrigins.push(
        normalizedOrigin
    );

    await organization.save();

    return organization.allowedOrigins;
};


export const removeAllowedOriginService = async ({
    organizationId,
    origin,
}) => {

    const normalizedOrigin =
        normalizeOrigin(origin);

    const organization =
        await organizationModel.findById(organizationId);

    if (!organization) {
        throw new Error("Organization not found");
    }

    organization.allowedOrigins =
        organization.allowedOrigins.filter(
            (allowedOrigin) =>
                allowedOrigin !== normalizedOrigin
        );

    await organization.save();

    return organization.allowedOrigins;
};


export const getAllowedOriginsService = async ({
    organizationId,
}) => {

    const organization =
        await organizationModel.findById(
            organizationId
        );

    if (!organization) {
        throw new Error("Organization not found");
    }

    return organization.allowedOrigins || [];
};