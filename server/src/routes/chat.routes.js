import express from "express";
import { chat, clearChat, createWidgetSession } from "../controllers/chat.controller.js";
import { tokenMiddleware } from "../middlewares/auth.middleware.js";
import { widgetCors, widgetOriginMiddleware, widgetSessionMiddlware } from "../middlewares/widgetSession.middleware.js";
import { createNewWidgetConversationController, widgetChatController } from "../controllers/widgetChat.controller.js";

const chatRouter = express.Router();

chatRouter.post("/", tokenMiddleware, chat);
chatRouter.delete("/clear", tokenMiddleware, clearChat);

// Widget Routers
chatRouter.post("/session", widgetCors,createWidgetSession);
chatRouter.post("/widget", widgetCors,widgetSessionMiddlware, widgetOriginMiddleware, widgetChatController);
chatRouter.post("/new-conversation", widgetSessionMiddlware, createNewWidgetConversationController);

export default chatRouter;