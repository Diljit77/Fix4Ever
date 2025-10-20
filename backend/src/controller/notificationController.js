import { Notification } from "../model/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createNotification = async (userId, message, requestId = null) => {
  try {
    const notification = await Notification.create({ userId, message, requestId });
    return notification;
  } catch (err) {
    console.error("Notification creation error:", err.message);
  }
};
