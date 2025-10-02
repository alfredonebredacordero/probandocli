
import React, { useState, useEffect } from 'react';

const ProfileEditor = ({ user, onSave }) => {
  const [formData, setFormData] = useState(user);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-200">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          required
        />
      </div>
      <div>
        <label htmlFor="education" className="block text-sm font-medium text-gray-200">Education</label>
        <input
          type="text"
          id="education"
          name="education"
          value={formData.education}
          onChange={handleChange}
          className="w-full p-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
        />
      </div>
      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-200">Age</label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className="w-full p-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
        />
      </div>
      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-200">Gender</label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full p-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-800"
        >
          <option value="">Select...</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>
      <div>
        <label htmlFor="experience" className="block text-sm font-medium text-gray-200">Experience</label>
        <textarea
          id="experience"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          rows="3"
          className="w-full p-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
        ></textarea>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-200">About Me</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="5"
          className="w-full p-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
        ></textarea>
      </div>
      <button
        type="submit"
        className="bg-[#2EC4BC] hover:bg-[#24A09A] text-white font-bold py-2 px-4 rounded-lg transition duration-300"
      >
        Save Profile
      </button>
    </form>
  );
};

export default ProfileEditor;
