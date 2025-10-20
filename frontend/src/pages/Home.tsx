import React from 'react';
import { FiTool, FiMapPin, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-primary/10 to-secondary/10 text-center px-4 transition-colors duration-300">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-5xl font-bold text-primary mb-4 flex items-center justify-center gap-2">
          <FiTool /> Fix4Ever
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Get instant access to skilled technicians for your home and electronic repairs. Track them in real time, effortlessly.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/requests/new" className="btn btn-primary btn-lg rounded-xl hover:shadow-lg transition">
            Book a Service
          </Link>
          <Link to="/requests" className="btn btn-outline btn-lg rounded-xl hover:shadow-lg transition">
            View My Requests
          </Link>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="card bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 hover:scale-[1.03] transition-transform">
          <FiMapPin className="text-3xl text-primary mb-2" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Real-Time Tracking</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Know where your technician is, at every step.</p>
        </div>
        <div className="card bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 hover:scale-[1.03] transition-transform">
          <FiTrendingUp className="text-3xl text-primary mb-2" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">AI Powered</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Get smart category and time suggestions instantly.</p>
        </div>
        <div className="card bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 hover:scale-[1.03] transition-transform">
          <FiTool className="text-3xl text-primary mb-2" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Trusted Technicians</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Professionals verified and rated by thousands.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
