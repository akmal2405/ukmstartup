import {
  getNotificationsByUserId,
  markNotificationRead,
  markAllNotificationsRead,
} from "../models/notificationModel.js";

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await getNotificationsByUserId(req.user.id);
    res.json(notifications);
  } catch (error) {
    console.error("getMyNotifications error:", error.message);
    res.status(500).json({ message: "Server error when fetching notifications" });
  }
};

export const readNotification = async (req, res) => {
  try {
    const { id: notification_id } = req.params;
    const updated = await markNotificationRead(notification_id, req.user.id);
    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("readNotification error:", error.message);
    res.status(500).json({ message: "Server error when marking notification read" });
  }
};

export const readAllNotifications = async (req, res) => {
  try {
    await markAllNotificationsRead(req.user.id);
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("readAllNotifications error:", error.message);
    res.status(500).json({ message: "Server error when marking all notifications read" });
  }
};
