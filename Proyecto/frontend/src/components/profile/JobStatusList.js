
import React from 'react';
import { Link } from 'react-router-dom';

const JobStatusList = ({ title, jobs }) => {
  if (jobs.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-300">No jobs in this category yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/10">
            <div>
              <h3 className="text-xl font-bold text-white">{job.title}</h3>
              <p className="text-gray-200 text-sm">{job.company} &bull; {job.location}</p>
            </div>
            <Link
              to={`/job/${job.id}`}
              className="bg-[#4A7BC8] hover:bg-[#3A6BB8] text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-300"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobStatusList;
