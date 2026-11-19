import express from "express";
import {
  CreateProperty,
  DeleteProperty,
  DetailProperty,
  GetAllOwnerProperty,
  ReadAllProperty,
  UpdatePropertyByParams,
} from "../controllers/property.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import uploadFileMulter from "../config/multer.js";

const PropertyRouter = express.Router();

PropertyRouter.post(
  "/",
  AuthMiddleware,
  uploadFileMulter.array("images", 5),
  CreateProperty,
);
PropertyRouter.get("/", ReadAllProperty);
PropertyRouter.get("/user", AuthMiddleware, GetAllOwnerProperty);
PropertyRouter.get("/:id", DetailProperty);

PropertyRouter.put(
  "/:id",
  AuthMiddleware,
  uploadFileMulter.array("images", 5),
  UpdatePropertyByParams,
);

PropertyRouter.delete("/:id", AuthMiddleware, DeleteProperty);

export default PropertyRouter;
