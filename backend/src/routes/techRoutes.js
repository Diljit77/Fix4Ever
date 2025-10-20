import express from "express";
import {
  registerTechnician,
  getAllTechnicians,
  assignTechnician,
  techUpdateStatus,
  getAvailableTechnicians,
  getTechDashboard,
  getTechnicianRequests,
} from "../controller/techController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router();


router.post("/", registerTechnician); 
router.get("/", getAllTechnicians);


router.post("/assign", assignTechnician);
router.get("/requests", authMiddleware, getTechnicianRequests);
router.patch("/update-status/:id", techUpdateStatus);
router.get("/available", getAvailableTechnicians);
router.get("/dashboard",authMiddleware, getTechDashboard);
export default router;
