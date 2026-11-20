import express from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import { SendContactMessage } from "../controllers/contact.controller.js";

const ContactMessageRouter = express.Router();

ContactMessageRouter.post("/send", AuthMiddleware, SendContactMessage);

export default ContactMessageRouter;
