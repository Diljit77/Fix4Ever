import express from "express";
import { getNotifications, markAsRead } from "../controller/notificationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getNotifications);
router.patch("/:id/read", markAsRead);

export default router;
