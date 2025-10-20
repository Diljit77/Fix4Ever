import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: String,
  category: String,
  address: String,
  preferredDate: Date,
  assignedTech: { type: mongoose.Schema.Types.ObjectId, ref: "Technician" },
  status: {
    type: String,
    enum: ["created", "assigned", "accepted", "traveling", "on-site", "completed"],
    default: "created",
  },
  approval: {
  type: Map,
  of: Boolean,
  default: {}, 
},
  completionDate: Date,
  createdAt: { type: Date, default: Date.now },
});

export const ServiceRequest = mongoose.model("ServiceRequest", requestSchema);
