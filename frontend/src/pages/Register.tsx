import React, { useState } from "react";
import { FiUserPlus, FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "technician">("user");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { name, email, password, role });
      toast.success("Registered successfully! Please login.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Register failed");
    }
  };

  return (
   <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-300">
  <form onSubmit={submit} className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 max-w-md w-full space-y-6 transition-colors duration-300">
    <h2 className="text-3xl font-bold text-center text-primary dark:text-blue-400 flex justify-center items-center gap-2">
      <FiUserPlus /> Register
    </h2>

     
        <div className="flex items-center gap-2 mb-3 border-b border-base-300 pb-2">
          <FiUser className="text-gray-400" />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="input input-ghost w-full focus:outline-none"
            required
          />
        </div>

  
        <div className="flex items-center gap-2 mb-3 border-b border-base-300 pb-2">
          <FiMail className="text-gray-400" />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="input input-ghost w-full focus:outline-none"
            required
          />
        </div>


        <div className="flex items-center gap-2 mb-3 border-b border-base-300 pb-2 relative">
          <FiLock className="text-gray-400" />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            className="input input-ghost w-full focus:outline-none pr-10"
            required
          />
          <button
            type="button"
            className="absolute right-2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>


        <div className="flex items-center justify-between mb-4 mt-2">
          <span className="font-medium text-gray-600">Register as:</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`px-4 py-1 rounded-full font-medium transition ${
                role === "user"
                  ? "bg-primary text-white"
                  : "bg-base-300 text-gray-600"
              }`}
            >
              User
            </button>
            <button
              type="button"
              onClick={() => setRole("technician")}
              className={`px-4 py-1 rounded-full font-medium transition ${
                role === "technician"
                  ? "bg-primary text-white"
                  : "bg-base-300 text-gray-600"
              }`}
            >
              Technician
            </button>
          </div>
        </div>

        <button className="btn btn-primary w-full mt-2">Register</button>

        <p className="text-center mt-4 text-sm">
          Already registered?{" "}
          <a href="/login" className="link text-primary">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
