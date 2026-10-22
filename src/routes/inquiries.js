import { Router } from "express";
import { asyncHandler } from "../http.js";
import { createInquiry } from "../controllers/inquiryController.js";

export const inquiriesRouter = Router();

inquiriesRouter.post("/", asyncHandler(createInquiry));
