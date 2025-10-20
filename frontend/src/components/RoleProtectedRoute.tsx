import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import type { ReactNode } from "react";

interface RoleProtectedProps {
  children: ReactNode;
  role: "technician" | "user";
}

export const RoleProtectedRoute: React.FC<RoleProtectedProps> = ({ children, role }) => {
  const { token, user } = useAuthStore();

  if (!token) return <Navigate to="/login" />;
  if (user?.role !== role) return <Navigate to="/" />; // Redirect if role mismatch

  return <>{children}</>;
};
