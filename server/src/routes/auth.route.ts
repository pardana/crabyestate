import express from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import {
  CurrentUser,
  LoginUser,
  RegisterUser,
} from "../controllers/auth.controller.js";

const AuthRouter = express.Router();

AuthRouter.post("/register", RegisterUser);
AuthRouter.post("/login", LoginUser);
AuthRouter.get("/me", AuthMiddleware, CurrentUser);

export default AuthRouter;
