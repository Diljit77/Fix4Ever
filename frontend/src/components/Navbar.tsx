import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiUser, FiLogOut, FiHome, FiClipboard, FiTool } from "react-icons/fi";
import { useAuthStore } from "../stores/authStore";
import NotificationsDropdown from "./NotificationsDropdown";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const getAvatarClasses = () => "bg-base-300 text-primary";

  return (
    <div className="navbar bg-white dark:bg-gray-900 shadow-lg px-4 sm:px-8 sticky top-0 z-50 transition-colors duration-300">
      <div className="flex-1">
        <Link to="/" className="text-2xl font-bold text-primary dark:text-blue-400 flex items-center gap-2">
          🛠️ Fix4Ever
        </Link>
      </div>

      <div className="flex-none hidden md:flex justify-center items-center gap-8">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-2 font-medium transition-colors ${
              isActive ? "text-primary dark:text-blue-400 border-b-2 border-primary dark:border-blue-400" : "text-base-content dark:text-gray-200"
            } hover:text-primary dark:hover:text-blue-400`
          }
        >
          <FiHome /> Home
        </NavLink>

        <NavLink
          to="/requests"
          className={({ isActive }) =>
            `flex items-center gap-2 font-medium transition-colors ${
              isActive ? "text-primary dark:text-blue-400 border-b-2 border-primary dark:border-blue-400" : "text-base-content dark:text-gray-200"
            } hover:text-primary dark:hover:text-blue-400`
          }
        >
          <FiClipboard /> Requests
        </NavLink>

        {user?.role === "technician" && (
          <NavLink
            to="/tech"
            className={({ isActive }) =>
              `flex items-center gap-2 font-medium transition-colors ${
                isActive ? "text-primary dark:text-blue-400 border-b-2 border-primary dark:border-blue-400" : "text-base-content dark:text-gray-200"
              } hover:text-primary dark:hover:text-blue-400`
            }
          >
            <FiTool /> Technician
          </NavLink>
        )}
      </div>

      <NotificationsDropdown />

      <div className="flex-none flex items-center gap-3">
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
              <div className={`rounded-full w-10 flex items-center justify-center font-semibold ${getAvatarClasses()}`}>
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-white dark:bg-gray-800 rounded-xl w-52">
              <li>
                <Link to="/profile" className="flex items-center gap-2 hover:text-primary dark:hover:text-blue-400">
                  <FiUser /> Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="flex items-center gap-2 text-error hover:text-red-600"
                >
                  <FiLogOut /> Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm rounded-lg hover:shadow-lg transition">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
