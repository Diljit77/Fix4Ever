import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRequestStore } from '../stores/requestStore';
import api from '../api/axios';
import { FiEye } from 'react-icons/fi';

const Requests: React.FC = () => {
  const { requests, setRequests } = useRequestStore();
  const user = JSON.parse(localStorage.getItem('fix4ever_user') || '{}');

  useEffect(() => {
    const load = async () => {
      try {
        let res;
        if (user.role === 'technician') {
          res = await api.get('/technicians/requests');
        } else {
          res = await api.get('/requests');
        }
        setRequests(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [user.role]);

  const statusColors: any = {
    pending: 'badge-warning',
    accepted: 'badge-info',
    traveling: 'badge-primary',
    'on-site': 'badge-secondary',
    completed: 'badge-success'
  };

  return (
<div className="max-w-4xl mx-auto py-10 px-6 space-y-8 transition-colors duration-300">
  <h2 className="text-3xl font-bold text-primary dark:text-blue-400">My Requests</h2>

  <div className="grid gap-6">
    {requests.map((r: any) => (
      <div
        key={r._id}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl p-6 flex justify-between items-start hover:scale-[1.02] transition-transform"
      >
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{r.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {r.category} • {new Date(r.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${statusColors[r.status]}`}>
            {r.status.toUpperCase()}
          </span>
          <Link
            to={`/requests/${r._id}`}
            className="btn btn-primary btn-sm flex items-center gap-2 rounded-lg"
          >
            <FiEye /> View
          </Link>
        </div>
      </div>
    ))}
  </div>
</div>

  );
};

export default Requests;
