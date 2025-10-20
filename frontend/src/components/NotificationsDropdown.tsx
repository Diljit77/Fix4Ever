import React, { useEffect } from "react";
import { FiBell } from "react-icons/fi";
import { useNotificationStore } from "../stores/notificationStore";
import api from "../api/axios";

const NotificationsDropdown: React.FC = () => {
  const { notifications, setNotifications, markRead } = useNotificationStore();

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      markRead(id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle relative">
        <FiBell size={20} />
        {notifications.some((n) => !n.read) && (
          <span className="badge badge-xs badge-error absolute top-0 right-0 indicator-item"></span>
        )}
      </label>
      <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-xl w-80">
        {notifications.length === 0 && <li className="text-gray-500 p-2">No notifications</li>}
        {notifications.map((n) => (
          <li
            key={n._id}
            className={`flex justify-between items-center p-2 rounded-lg ${n.read ? "opacity-60" : "font-semibold bg-base-200 hover:bg-base-300 transition"}`}
          >
            <span>{n.message}</span>
            {!n.read && (
              <button onClick={() => handleMarkRead(n._id)} className="btn btn-xs btn-primary rounded-lg">
                Mark Read
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsDropdown;
