import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { FiSend, FiTag, FiUser } from 'react-icons/fi';
import { useRequestStore } from '../stores/requestStore';

const NewRequest: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [selectedTech, setSelectedTech] = useState('');
  const addRequest = useRequestStore((s) => s.addRequest);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const res = await api.get('/technicians/available');
        setTechnicians(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTechnicians();
  }, []);

  const askSuggestion = async () => {
    try {
      const res = await api.post('/ai/category', { text: `${title} ${description}` });
      setSuggestion(res.data.category);
    } catch {
      setSuggestion('General Repair');
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/requests', {
        title,
        description,
        address,
        preferredDate,
        technicianId: selectedTech || null,
      });
      addRequest(res.data);
      navigate('/requests');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Create failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700 space-y-6 transition-colors duration-300">
        <h2 className="text-3xl font-bold text-primary dark:text-blue-400 flex items-center gap-3">
          <FiSend /> Create Service Request
        </h2>

        <form onSubmit={submit} className="space-y-5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="input input-bordered w-full rounded-lg focus:ring focus:ring-primary/20"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="textarea textarea-bordered w-full rounded-lg focus:ring focus:ring-primary/20"
          />

          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            className="input input-bordered w-full rounded-lg focus:ring focus:ring-primary/20"
          />

          <input
            type="date"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            className="input input-bordered w-full rounded-lg focus:ring focus:ring-primary/20"
          />

          <div className="flex flex-col gap-2">
            <label className="font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <FiUser /> Assign Technician (optional)
            </label>
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="select select-bordered w-full hover:border-primary rounded-lg"
            >
              <option value="">Auto-assign if not selected</option>
              {technicians.map((tech) => (
                <option key={tech._id} value={tech._id}>
                  {tech.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="btn btn-outline btn-sm flex items-center gap-2 hover:bg-primary hover:text-white rounded-lg"
              onClick={askSuggestion}
            >
              <FiTag /> Suggest Category
            </button>
            <span className="badge badge-lg badge-primary font-semibold">
              {suggestion || 'No suggestion yet'}
            </span>
          </div>

          <button className="btn btn-primary w-full text-lg font-semibold hover:shadow-lg transition rounded-lg">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewRequest;
