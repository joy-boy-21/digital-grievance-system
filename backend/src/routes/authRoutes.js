import express from "express";
import { body } from "express-validator";
import { register, login, me } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").isLength({ min: 2 }).withMessage("Name required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
    body("institutionId").notEmpty().withMessage("institutionId required")
  ],
  // protect is optional here; if you want only ADMIN to create staff, keep protect and check role in controller
  // For demo, we allow public STUDENT registration; if token present, controller enforces staff-only by ADMIN.
  register
);

router.post("/login", login);
router.get("/me", protect, me);

export default router;
