import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useRequestStore } from '../stores/requestStore';
import { motion } from 'framer-motion';
import {
  FiCheckCircle,
  FiTruck,
  FiHome,
  FiCheck,
  FiArrowRight,
  FiRefreshCcw
} from 'react-icons/fi';
import { toast } from 'react-toastify';

interface Technician {
  _id: string | null;
  name: string | null;
  email: string | null;
  skills: string[] | null;
}

const RequestDetail: React.FC = () => {
  const { id } = useParams();
  const [request, setRequest] = useState<any>(null);
  const { updateRequest } = useRequestStore();
  const [technician, setTechnician] = useState<Technician>({
    _id: null,
    name: null,
    email: null,
    skills: null,
  });

  const user = JSON.parse(localStorage.getItem('fix4ever_user') || '{}');

useEffect(() => {
  const load = async () => {
    try {
      const res = await api.get(`/requests/${id}`);
      setRequest(res.data);
      updateRequest(id!, res.data);
      const response = await api.get('/technicians/dashboard');
      setTechnician(response.data.tech);
    } catch (err) {
      console.error(err);
    }
  };

  load(); 

  const interval = setInterval(load, 5000); 
  return () => clearInterval(interval);
}, [id, updateRequest]);


  const refresh = async () => {
    try {
      const res = await api.get(`/requests/${id}`);
      setRequest(res.data);
      updateRequest(id!, res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      const res = await api.patch(`/requests/${id}/status`, { status });
      setRequest(res.data.request);
      updateRequest(id!, res.data.request);
      toast.success(`Status updated to "${status}"`);
    } catch (err) {
      console.error(err);
      toast.error('Unable to update status');
    }
  };

  const approveStep = async (step: string) => {
    try {
      const res = await api.patch(`/requests/approve/${id}`, { step });
      setRequest(res.data);
      updateRequest(id!, res.data);
      toast.success(`Step "${step}" approved successfully`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Approval failed');
    }
  };

  const steps = [
    { key: 'accepted', label: 'Accepted', icon: <FiCheckCircle /> },
    { key: 'traveling', label: 'Traveling', icon: <FiTruck /> },
    { key: 'on-site', label: 'On-Site', icon: <FiHome /> },
    { key: 'completed', label: 'Completed', icon: <FiCheck /> },
  ];

  const canUpdateStatus = (nextStatus: string) => {
    const order = steps.map((s) => s.key);
    const currentIndex = order.indexOf(request.status);
    const nextIndex = order.indexOf(nextStatus);

  
    if (nextIndex <= currentIndex) return false;

    const approvalMap: any = {
      traveling: 'accepted',
      'on-site': 'traveling',
      completed: 'on-site',
    };
    const requiredApproval = approvalMap[nextStatus];
    if (!requiredApproval) return true;
    return request.approval?.[requiredApproval];
  };

  if (!request)
    return <div className="flex justify-center mt-20 text-lg animate-pulse">Loading request...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card shadow-xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
      >
        <h2 className="text-3xl font-bold text-primary dark:text-blue-400 mb-4">{request.title}</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-2">{request.description}</p>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Category:</strong> {request.category}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Status:</strong>{' '}
          <span className="badge bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-lg">
            {request.status}
          </span>
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Technician:</strong> {request.assignedTech?.name || 'Not assigned'}
        </p>


<div className="mt-8 flex items-center justify-between relative">
  {steps.map((step, index) => {
    const isCurrent = request.status === step.key;
    const isCompleted = steps.findIndex(s => s.key === request.status) > index;
    const isDisabled = !canUpdateStatus(step.key);

    return (
      <React.Fragment key={step.key}>
        <div className="flex flex-col items-center w-20">
          <div
            className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 shadow-md
              ${isCompleted
                ? 'bg-green-500 text-white'
                : isCurrent
                ? 'bg-blue-600 text-white scale-105'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}
            `}
          >
            {step.icon}
          </div>
          <p className="text-sm mt-2 text-center font-medium
            text-gray-800 dark:text-gray-300">
            {step.label}
          </p>
        </div>

        {index < steps.length - 1 && (
          <div className="flex-1 flex justify-center">
            <FiArrowRight
              className={`text-2xl transition-all duration-300 ${
                isCompleted
                  ? 'text-green-500'
                  : isDisabled
                  ? 'text-gray-400 dark:text-gray-600'
                  : 'text-blue-600 dark:text-blue-400'
              }`}
            />
          </div>
        )}
      </React.Fragment>
    );
  })}
</div>


        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <button
            className="btn btn-outline btn-sm flex items-center gap-2 dark:border-gray-500 dark:text-gray-300"
            onClick={refresh}
          >
            <FiRefreshCcw /> Refresh
          </button>

          {user.role === 'technician' && request.assignedTech?._id === technician._id && (
            <>
              {steps.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => updateStatus(key)}
                  disabled={!canUpdateStatus(key)}
                  className={`btn btn-sm flex items-center gap-2 rounded-full transition-all ${
                    canUpdateStatus(key)
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {label}
                </button>
              ))}
            </>
          )}

          {user.role === 'user' &&
            ['accepted', 'traveling', 'on-site'].includes(request.status) &&
            !request.approval?.[request.status] && (
              <button
                className="btn btn-primary btn-sm rounded-full"
                onClick={() => approveStep(request.status)}
              >
                Approve "{request.status}" Step
              </button>
            )}
        </div>
      </motion.div>
    </div>
  );
};

export default RequestDetail;
