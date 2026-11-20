import express from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import {
  GetAllAgentMessages,
  GetAllClientMessages,
  SendContactMessage,
} from "../controllers/contact.controller.js";

const ContactMessageRouter = express.Router();

ContactMessageRouter.post("/send", AuthMiddleware, SendContactMessage);
ContactMessageRouter.get("/client", AuthMiddleware, GetAllClientMessages);
ContactMessageRouter.get("/agent", AuthMiddleware, GetAllAgentMessages);

export default ContactMessageRouter;
