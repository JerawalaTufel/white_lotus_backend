import { Router } from "express";
import { asyncHandler } from "../http.js";
import { getProperty, getPropertyMeta, listProperties } from "../controllers/propertyController.js";

export const propertiesRouter = Router();

propertiesRouter.get("/meta", asyncHandler(getPropertyMeta));
propertiesRouter.get("/", asyncHandler(listProperties));
propertiesRouter.get("/:id", asyncHandler(getProperty));
