
import { addAllowedOrigin, getAllowedOrigins, removeAllowedOrigin } from "../controllers/originAllowed.controller.js";
import { tokenMiddleware } from "../middlewares/auth.middleware.js";
import express from "express";

const allowedOriginRouter = express.Router();
// Allowed Origins
allowedOriginRouter.get("/allowed-origins", tokenMiddleware, getAllowedOrigins);
allowedOriginRouter.post("/allowed-origins", tokenMiddleware, addAllowedOrigin);
allowedOriginRouter.delete("/allowed-origins", tokenMiddleware, removeAllowedOrigin);

export default allowedOriginRouter;