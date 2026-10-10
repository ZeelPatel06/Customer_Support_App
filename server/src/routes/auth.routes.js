import express from "express";
import { registerUser, loginUser, getMe, logoutUser, updateUser } from "../controllers/auth.controller.js";
import { tokenMiddleware } from "../middlewares/auth.middleware.js";
import { getDashboardStats } from "../controllers/dashboard.controller.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/me", tokenMiddleware, getMe);
authRouter.post("/logout", tokenMiddleware, logoutUser);
authRouter.put("/change-profile", tokenMiddleware, updateUser);
authRouter.get("/dashboard", tokenMiddleware, getDashboardStats);

export default authRouter;