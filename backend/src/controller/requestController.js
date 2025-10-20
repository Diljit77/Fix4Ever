import { ServiceRequest } from "../model/ServiceRequest.js";
import { Technician } from "../model/Technician.js";
import { assignTechnicianAutomatically } from "../utils/assignTechnicianHelper.js";

import { suggestCategory } from "../utils/suggestCategory.js";
import { createNotification } from "./notificationController.js";





export const createRequest = async (req, res) => {
  try {
    const { title, description, address, preferredDate, technicianId } = req.body;

    const category = suggestCategory(description || title);

    const newRequestData = {
      userId: req.user.id,
      title,
      description,
      address,
      preferredDate,
      category,
      status: "pending"
    };

    let assignedTech = null;

    if (technicianId) {
      const tech = await Technician.findById(technicianId);
      if (!tech) return res.status(404).json({ message: "Technician not found" });

      newRequestData.assignedTech = tech._id;
      newRequestData.status = "assigned";
      assignedTech = tech;

      tech.status = "busy";
      await tech.save();
    }

    const newRequest = await ServiceRequest.create(newRequestData);


    if (!technicianId) {
      const assigned = await assignTechnicianAutomatically(newRequest._id, category);
      if (assigned) assignedTech = assigned.tech;
    }

   
   if (assignedTech) {
  
  await createNotification(
    req.user.id,
    `Your request "${newRequest.title}" has been assigned to technician "${assignedTech.name}"`,
    newRequest._id
  );


  await createNotification(
    assignedTech.userId,
    `You have been assigned a new service request "${newRequest.title}"`,
    newRequest._id
  );
}


    res.status(201).json(newRequest);
  } catch (err) {
    console.error("Request creation error:", err.message);
    res.status(500).json({ message: err.message });
  }
};



export const getRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ userId: req.user.id });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["accepted", "traveling", "on-site", "completed"];
  if (!validStatuses.includes(status)) return res.status(400).json({ message: "Invalid status" });

  const request = await ServiceRequest.findById(id);
  if (!request) return res.status(404).json({ message: "Request not found" });

  
  const tech = await Technician.findOne({ userId: req.user.id });
  if (!tech || request.assignedTech.toString() !== tech._id.toString()) {
    return res.status(403).json({ message: "Not your assigned request" });
  }

 
  const steps = ["accepted", "traveling", "on-site", "completed"];
  const currentIndex = steps.indexOf(request.status);
  const nextIndex = steps.indexOf(status);

  if (nextIndex > currentIndex + 1) {
    return res.status(400).json({ message: "You must complete or get approval for intermediate steps first" });
  }


  if (["traveling", "on-site"].includes(status)) {
    if (!request.approval.get(request.status)) {
      return res.status(400).json({ message: `Cannot move to "${status}" until user approves previous step "${request.status}"` });
    }
  }
  if( status === "completed") {
    request.completionDate = new Date();
    const tech = await Technician.findById(request.assignedTech._id);
    tech.status = "available";
    await tech.save();
  }


  request.status = status;
  await request.save();


  if (["traveling", "on-site"].includes(status)) {
    await createNotification(
      request.userId,
      `Technician updated status to "${status}". Please approve to proceed.`,
      request._id
    );
  }

  res.json({ message: "Status updated, awaiting approval if required", request });
};


export const getAllRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate("userId", "name email")
      .populate("assignedTech", "name email skills");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getRequestById = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate("userId", "name email")
      .populate("assignedTech", "name email skills");

    if (!request) return res.status(404).json({ message: "Request not found" });

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const approveStep = async (req, res) => {
  try {
    const { id } = req.params; 
    const { step } = req.body; 

    const request = await ServiceRequest.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (!["traveling", "on-site"].includes(step)) {
      return res.status(400).json({ message: "Invalid step for approval" });
    }
console.log(request.userId)
console.log(req.user.id)
    if (request.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to approve this request" });
    }

    
    request.approval.set(step, true);
    await request.save();


    if (request.assignedTech) {
      await createNotification(
        request.assignedTech,
        `User approved "${step}" status for request "${request.title}". You can proceed.`,
        request._id
      );
    }

    res.json({ message: `"${step}" approved successfully`, request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
