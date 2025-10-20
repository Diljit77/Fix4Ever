import React from "react";
import { Link } from "react-router-dom";
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone } from "react-icons/fi";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-base-content dark:text-gray-200 mt-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">

        <div>
          <h2 className="text-2xl font-bold text-primary dark:text-blue-400 mb-3 flex items-center gap-2">
            🛠️ Fix4Ever
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Your go-to platform for booking and tracking trusted repair technicians for home and electronic services.
          </p>
        </div>

        
        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li><Link to="/" className="hover:text-primary dark:hover:text-blue-400 transition-colors">Home</Link></li>
            <li><Link to="/requests" className="hover:text-primary dark:hover:text-blue-400 transition-colors">My Requests</Link></li>
            <li><Link to="/requests/new" className="hover:text-primary dark:hover:text-blue-400 transition-colors">New Request</Link></li>
            <li><Link to="/technician" className="hover:text-primary dark:hover:text-blue-400 transition-colors">Technician Dashboard</Link></li>
          </ul>
        </div>


        <div>
          <h3 className="font-semibold mb-2">Contact Us</h3>
          <p className="flex items-center gap-2 text-sm mb-2"><FiPhone /> +91 90563 07291</p>
          <p className="flex items-center gap-2 text-sm mb-3"><FiMail /> support@fix4ever.com</p>
          <div className="flex gap-3 mt-2">
            <a href="#" className="hover:text-primary dark:hover:text-blue-400 transition-colors"><FiFacebook size={20} /></a>
            <a href="#" className="hover:text-primary dark:hover:text-blue-400 transition-colors"><FiInstagram size={20} /></a>
            <a href="#" className="hover:text-primary dark:hover:text-blue-400 transition-colors"><FiTwitter size={20} /></a>
          </div>
        </div>
      </div>

      <div className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-center py-4 mt-6 transition-colors duration-300">
        &copy; {new Date().getFullYear()} Fix4Ever Internet Pvt. Ltd. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
