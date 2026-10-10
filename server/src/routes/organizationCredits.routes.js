import express from "express";
import { generateOrganizationCredentails, getOrganizationCredentials, revokeOrganizationCredentials } from "../controllers/organizationCredits.controller.js";
import { tokenMiddleware } from "../middlewares/auth.middleware.js";

const organizationCredentialRouter = express.Router();

organizationCredentialRouter.post("/", tokenMiddleware, generateOrganizationCredentails);
organizationCredentialRouter.get("/", tokenMiddleware, getOrganizationCredentials);
organizationCredentialRouter.delete("/:credentialId", tokenMiddleware, revokeOrganizationCredentials);

export default organizationCredentialRouter;