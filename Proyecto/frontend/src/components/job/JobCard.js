import React from 'react';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/job/${job.id}`);
  };

  const handleApply = () => {
    console.log('Application submitted for:', job.title, ' (Job ID:', job.id, ')');
    // In a real application, this would trigger an application process
    // and update the user's applied jobs list in a global state or backend.
    alert(`You have applied for ${job.title}!`);
  };

  return (
    <div className="bg-white/20 backdrop-blur-md p-6 rounded-lg border border-white/20 shadow-lg flex flex-col h-full">
      <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
      <p className="text-gray-100 text-sm mb-1">{job.company}</p>
      <p className="text-gray-200 text-xs mb-4">{job.location} &bull; {job.category}</p>
      
      <div className="flex-grow">
        <p className="text-white text-lg font-semibold mb-2">{job.payRate}</p>
        <p className="text-gray-100 text-sm mb-4 line-clamp-3">{job.description}</p>
      </div>

      <div className="mt-auto flex justify-between items-center">
        <span className="text-gray-200 text-xs">{job.duration}</span>
        <div className="flex flex-nowrap">
          <button
            onClick={handleViewDetails}
            className="bg-[#4A7BC8] hover:bg-[#3A6BB8] text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-300 mr-2 flex-shrink-0 flex-grow-0"
          >
            View Details
          </button>
          <button
            onClick={handleApply}
            className="bg-[#2EC4BC] hover:bg-[#24A09A] text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-300 flex-shrink-0 flex-grow-0"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;