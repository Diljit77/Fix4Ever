import { Technician } from "../model/Technician.js";
import { ServiceRequest } from "../model/ServiceRequest.js";

export const registerTechnician = async (req, res) => {
  try {
    const { name, email, skills } = req.body;
    const tech = await Technician.create({ name, email, skills });
    res.status(201).json({ message: "Technician registered", tech });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getAllTechnicians = async (req, res) => {
  try {
    const techs = await Technician.find();
    res.json(techs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const assignTechnician = async (req, res) => {
  try {
    const { requestId, technicianId } = req.body;
    const request = await ServiceRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const tech = await Technician.findById(technicianId);
    if (!tech) return res.status(404).json({ message: "Technician not found" });

    request.assignedTech = tech._id;
    request.status = "assigned";
    await request.save();

    res.json({ message: "Technician assigned", request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const techUpdateStatus = async (req, res) => {
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


export const getAvailableTechnicians = async (req, res) => {
  try {
    const availableTechs = await Technician.find().select('name');
    res.status(200).json(availableTechs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch technicians' });
  }
};
export const getTechDashboard = async (req, res) => {
  try {
 
    const tech = await Technician.findOne({ userId: req.user.id });
    if (!tech) return res.status(404).json({ message: "Technician not found" });


    const jobs = await ServiceRequest.find({ assignedTech: tech._id })
      .populate("userId", "name email")
      .populate("assignedTech", "name email skills");


    const totalRequests = jobs.length;
    const completed = jobs.filter((j) => j.status === "completed").length;
    const pending = totalRequests - completed;

    res.json({ tech, jobs, analytics: { totalRequests, completed, pending } });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error(err);
  }
};
export const getTechnicianRequests = async (req, res) => {
  try {
   
    const tech = await Technician.findOne({ userId: req.user.id });
    if (!tech) return res.status(404).json({ message: "Technician not found" });

   
    const requests = await ServiceRequest.find({ assignedTech: tech._id })
      .populate("userId", "name email")
      .populate("assignedTech", "name email skills");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

