import express from "express";
import { body } from "express-validator";
import {
  createGrievance,
  getGrievances,
  getGrievanceById,
  updateStatus,
  escalateGrievance
} from "../controllers/grievanceController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public submission allowed (anonymous) – token optional.
// If user is logged in and wants non-anonymous submission, controller will attach studentId.
router.post(
  "/",
  [
    body("title").isLength({ min: 4 }).withMessage("Title required"),
    body("description").isLength({ min: 10 }).withMessage("Description required"),
    body("institutionId").notEmpty().withMessage("institutionId required")
  ],
  createGrievance
);

// Authenticated views
router.get("/", protect, getGrievances);
router.get("/:id", protect, getGrievanceById);

// Authority actions
router.put(
  "/:id/status",
  protect,
  authorize("HOD", "DEAN", "CHANCELLOR", "ADMIN"),
  updateStatus
);

router.put(
  "/:id/escalate",
  protect,
  authorize("HOD", "DEAN", "CHANCELLOR", "ADMIN"),
  escalateGrievance
);

export default router;
