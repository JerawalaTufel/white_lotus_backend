import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../http.js";
import {
  createProperty,
  deleteProperty,
  listAdminProperties,
  updateProperty,
} from "../controllers/propertyController.js";
import { listInquiries } from "../controllers/inquiryController.js";

export const adminRouter = Router();

adminRouter.use(requireAdmin);

adminRouter.get("/properties", asyncHandler(listAdminProperties));
adminRouter.post("/properties", asyncHandler(createProperty));
adminRouter.put("/properties/:id", asyncHandler(updateProperty));
adminRouter.delete("/properties/:id", asyncHandler(deleteProperty));
adminRouter.get("/inquiries", asyncHandler(listInquiries));
