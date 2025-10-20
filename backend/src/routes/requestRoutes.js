import express from "express";
import { approveStep, createRequest, getAllRequests, getRequestById, getRequests, updateStatus } from "../controller/requestController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/", authMiddleware, createRequest);
router.get("/", authMiddleware, getRequests);
router.patch("/:id/status", authMiddleware, updateStatus);
router.get("/all", getAllRequests);
router.get("/:id", getRequestById);
router.patch("/approve/:id",authMiddleware,approveStep);
export default router;
