import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import techRoutes from "./routes/techRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


connectDB();
app.use("/api/notifications", notificationRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/technicians", techRoutes);
app.use("/api/ai", aiRoutes);


app.get("/", (req, res) => res.send("Fix4Ever Backend Running "));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
