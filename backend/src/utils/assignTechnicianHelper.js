import { Technician } from "../model/Technician.js";
import { ServiceRequest } from "../model/ServiceRequest.js";

export const assignTechnicianAutomatically = async (requestId, category) => {
  const request = await ServiceRequest.findById(requestId);
  if (!request) throw new Error("Request not found");

  const tech = await Technician.findOne({ status: "available" });
  if (!tech) return null; 


  request.assignedTech = tech._id;
  request.status = "assigned";
  await request.save();


  tech.status = "busy";
  await tech.save();

  return { request, tech };
};
