import React, { useState } from "react";
import { FiLogIn, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import api from "../api/axios";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      setAuth(res.data.token, res.data.user);
      if (res.data.user.role === "technician") navigate("/technician");
      else navigate("/requests");
      toast.success("Logged in successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-base-200 px-4">
      <form
        onSubmit={submit}
        className="card w-full max-w-md bg-base-100 p-8 shadow-2xl rounded-lg"
      >
        <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2 text-primary">
          <FiLogIn /> Login
        </h2>

        {/* Email */}
        <div className="flex items-center gap-2 mb-3 border-b border-base-300 pb-2">
          <FiMail className="text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input input-ghost w-full focus:outline-none"
            required
          />
        </div>

        {/* Password */}
        <div className="flex items-center gap-2 mb-3 border-b border-base-300 pb-2 relative">
          <FiLock className="text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
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

        <button
          className={`btn btn-primary w-full mt-2 ${loading ? "loading" : ""}`}
        >
          Login
        </button>

        <p className="text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <a href="/register" className="link text-primary">
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
