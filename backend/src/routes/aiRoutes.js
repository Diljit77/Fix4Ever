import express from "express";
import { getCategorySuggestion } from "../controller/aiController.js";
const router = express.Router();

router.post("/category", getCategorySuggestion);

export default router;
