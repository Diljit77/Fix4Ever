import express from "express";
import { register, login, getMe, updateMe } from "../controller/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);


router.patch("/me", authMiddleware, updateMe);
export default router;
