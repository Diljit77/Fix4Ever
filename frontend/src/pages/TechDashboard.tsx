import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiTruck,
  FiHome,
  FiCheck,
  FiTool,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#22c55e", "#facc15", "#3b82f6", "#a855f7", "#ef4444"];

const TechDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [tech, setTech] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>({
    totalRequests: 0,
    completed: 0,
    pending: 0,
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await api.get("/technicians/dashboard");
        setJobs(res.data.jobs);
        setTech(res.data.tech);
        setAnalytics(res.data.analytics);
      } catch (err) {
        console.error(err);
      }
    };
    loadDashboard();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await api.patch(`/requests/${id}/status`, { status });
      setJobs((prev) =>
        prev.map((j) => (j._id === id ? res.data.request : j))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const statusStyles: any = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    accepted: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    traveling:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    "on-site":
      "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    completed:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  };

  const chartData = [
    { name: "Total", value: analytics.totalRequests },
    { name: "Completed", value: analytics.completed },
    { name: "Pending", value: analytics.pending },
  ];

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 transition-colors duration-300 space-y-10">
   
      {tech && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white rounded-2xl shadow-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FiTool /> {tech.name}
            </h2>
            <p className="opacity-90">Email: {tech.email}</p>
            <p className="opacity-90">
              Skills:{" "}
              <span className="font-medium">
                {tech.skills?.length ? tech.skills.join(", ") : "No skills added"}
              </span>
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl text-sm shadow-inner">
            <p>
              <strong>Total Requests:</strong> {analytics.totalRequests}
            </p>
            <p>
              <strong>Completed:</strong> {analytics.completed}
            </p>
            <p>
              <strong>Pending:</strong> {analytics.pending}
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
     
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Requests Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

      
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Task Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

     
      <h2 className="text-3xl font-bold text-primary dark:text-blue-400 mt-10 mb-4">
        Assigned Jobs
      </h2>

      {jobs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center mt-10">
          No assigned jobs yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((j: any, index: number) => (
            <motion.div
              key={j._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 hover:scale-[1.01] transition-transform"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {j.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {j.address}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    User:{" "}
                    <span className="font-medium">
                      {j.userId?.name} ({j.userId?.email})
                    </span>
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${statusStyles[j.status]}`}
                >
                  {j.status.toUpperCase()}
                </span>
              </div>

              <div className="flex gap-2 mt-4 justify-end">
                <button
                  className="p-2 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 rounded-full hover:scale-105 transition-transform"
                  onClick={() => updateStatus(j._id, "accepted")}
                >
                  <FiCheckCircle />
                </button>
                <button
                  className="p-2 bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 rounded-full hover:scale-105 transition-transform"
                  onClick={() => updateStatus(j._id, "traveling")}
                >
                  <FiTruck />
                </button>
                <button
                  className="p-2 bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 rounded-full hover:scale-105 transition-transform"
                  onClick={() => updateStatus(j._id, "on-site")}
                >
                  <FiHome />
                </button>
                <button
                  className="p-2 bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 rounded-full hover:scale-105 transition-transform"
                  onClick={() => updateStatus(j._id, "completed")}
                >
                  <FiCheck />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechDashboard;
