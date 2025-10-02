import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobs } from '../lib/data';
import ApplicationModal from '../components/job/ApplicationModal';
import Header from '../components/layout/Header';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return <div className="min-h-screen text-white flex items-center justify-center">Job not found.</div>;
  }

  return (
    <div className="min-h-screen text-white pt-20 relative">
      <Header />
      <div className="max-w-4xl mx-auto bg-white/20 backdrop-blur-md p-8 rounded-lg border border-white/20 shadow-lg">
        <button
          onClick={() => navigate(-1)} // Go back to the previous page
          className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-300 mb-6"
        >
          &larr; Back to Listings
        </button>

        <h1 className="text-4xl font-bold text-white mb-4">{job.title}</h1>
        <p className="text-gray-100 text-lg mb-2">{job.company}</p>
        <p className="text-gray-200 text-md mb-4">{job.location} &bull; {job.category} &bull; {job.duration}</p>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white mb-2">Pay Rate:</h2>
          <p className="text-white text-xl">{job.payRate}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white mb-2">Description:</h2>
          <p className="text-gray-100 text-base leading-relaxed">{job.description}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white mb-2">Shop Contact:</h2>
          <p className="text-gray-100 text-base">Email: {job.shopContactEmail}</p>
          <p className="text-gray-100 text-base">Phone: {job.shopContactPhone}</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#2EC4BC] hover:bg-[#24A09A] text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-lg"
        >
          Apply Now
        </button>
      </div>

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobTitle={job.title}
      />
    </div>
  );
};

export default JobDetailPage;