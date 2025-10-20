import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { RoleProtectedRoute } from "./components/RoleProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewRequest from "./pages/NewRequest";
import Requests from "./pages/Requests";
import RequestDetail from "./pages/RequestDetail";
import TechDashboard from "./pages/TechDashboard";

import { useAuthStore } from "./stores/authStore";
import type { ReactNode } from "react";
import ProfilePage from "./pages/Profile";
import { ToastContainer } from "react-toastify";


const ProtectedRoute = ({ children }: { children: ReactNode}) => {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  
  const location = useLocation();
     <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark" // or 
      />
  const hideNavFooter = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      {!hideNavFooter && <Navbar />}

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <Requests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests/new"
            element={
              <ProtectedRoute>
                <NewRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests/:id"
            element={
              <ProtectedRoute>
                <RequestDetail />
              </ProtectedRoute>
            }
          />
              <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

      <Route
  path="/tech"
  element={
    <RoleProtectedRoute role="technician">
      <TechDashboard />
    </RoleProtectedRoute>
  }
/>

    
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      {!hideNavFooter && <Footer />}
    </div>
  );
}

export default App;
