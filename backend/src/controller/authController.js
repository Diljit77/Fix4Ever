import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../model/User.js";
import { Technician } from "../model/Technician.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, passwordHash, role });

    let techDoc = null;
    if (role === "technician") {
      techDoc = await Technician.create({
        name,
        email,
        status: "available",
        userId: newUser._id,
      });
    }

    res.status(201).json({ message: "User registered successfully", user: newUser, technician: techDoc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;


    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    
    let techData = null;
    if (user.role === "technician") {
      techData = await Technician.findOne({ userId }).select("skills");
    }

    res.json({
      ...user.toObject(),
      skills: techData?.skills || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


export const updateMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, skills } = req.body;


    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (user.role === "technician" && skills) {
      await Technician.findOneAndUpdate(
        { userId },
        { skills },
        { new: true }
      );
    }

    res.json({
      ...user.toObject(),
      skills: skills || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};