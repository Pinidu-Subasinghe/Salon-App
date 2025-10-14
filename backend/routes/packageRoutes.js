import express from "express";
import {
  getPackages,
  addPackage,
  deletePackage
} from "../controllers/packageController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getPackages);
router.post("/", protect, adminOnly, addPackage);
router.delete("/:id", protect, adminOnly, deletePackage);

export default router;
