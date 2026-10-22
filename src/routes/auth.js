import { Router } from "express";
import { asyncHandler } from "../http.js";
import { requireAdmin } from "../middleware/auth.js";
import { currentAdmin, login, logout } from "../controllers/authController.js";

export const authRouter = Router();

authRouter.post("/login", asyncHandler(login));
authRouter.post("/logout", logout);
authRouter.get("/me", requireAdmin, currentAdmin);
