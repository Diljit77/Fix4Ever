import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { FiEdit, FiSave, FiXCircle, FiPlus, FiX } from "react-icons/fi";
import { useAuthStore } from "../stores/authStore";
import { toast } from "react-toastify";

const ProfilePage: React.FC = () => {
  const { setUser } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        setProfile(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
        setSkills(res.data.skills || []);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const res = await api.patch("/auth/me", { name, email, skills });
      setProfile(res.data);
      setUser(res.data);
      setEditing(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Failed to save profile", err);
      toast.error("Failed to save profile");
    }
  };

  const addSkill = () => {
    const skill = prompt("Enter a new skill");
    if (skill && !skills.includes(skill)) setSkills([...skills, skill]);
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  if (!profile) return <div className="flex justify-center mt-20 text-gray-700 dark:text-gray-300">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700 space-y-6 transition-colors duration-300">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Profile</h2>
          {!editing ? (
            <button
              className="btn btn-outline btn-sm flex items-center gap-2"
              onClick={() => setEditing(true)}
            >
              <FiEdit /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button className="btn btn-primary btn-sm flex items-center gap-2" onClick={handleSave}>
                <FiSave /> Save
              </button>
              <button className="btn btn-error btn-sm flex items-center gap-2" onClick={() => setEditing(false)}>
                <FiXCircle /> Cancel
              </button>
            </div>
          )}
        </div>

    
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">Name:</label>
            {editing ? (
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input input-bordered w-full" />
            ) : (
              <p className="text-gray-900 dark:text-gray-100">{profile.name}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">Email:</label>
            {editing ? (
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input input-bordered w-full" />
            ) : (
              <p className="text-gray-900 dark:text-gray-100">{profile.email}</p>
            )}
          </div>

          {profile.role === "technician" && (
            <div>
              <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">Skills:</label>
              <div className="flex flex-wrap gap-2">
                {skills.length === 0 && <span className="text-gray-400 dark:text-gray-500">No skills added yet</span>}
                {skills.map((s, i) => (
                  <span key={i} className="badge badge-outline flex items-center gap-1">
                    {s}
                    {editing && <button className="text-red-500" onClick={() => removeSkill(i)}><FiX /></button>}
                  </span>
                ))}
                {editing && (
                  <button className="btn btn-sm btn-outline flex items-center gap-1" onClick={addSkill}>
                    <FiPlus /> Add Skill
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
