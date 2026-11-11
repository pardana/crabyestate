import express from "express";
import { CreateProperty } from "../controllers/property.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import uploadFileMulter from "../config/multer.js";

const PropertyRouter = express.Router();

PropertyRouter.post(
  "/",
  AuthMiddleware,
  uploadFileMulter.array("images", 5),
  CreateProperty,
);

export default PropertyRouter;
