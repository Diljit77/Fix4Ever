import mongoose from "mongoose";

const technicianSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  skills: [String],
  status: { type: String, enum: ["available", "busy", "offline"], default: "available" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
});

export const Technician = mongoose.model("Technician", technicianSchema);
