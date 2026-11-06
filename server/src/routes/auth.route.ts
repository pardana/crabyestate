import express from "express";
import { RegisterUser } from "../controllers/auth.controller.js";

const AuthRouter = express.Router();

AuthRouter.post("/register", RegisterUser);

export default AuthRouter;
