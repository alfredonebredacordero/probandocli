
import React, { useState } from 'react';
import Header from '../components/layout/Header';
import JobStatusList from '../components/profile/JobStatusList';
import { users, jobs } from '../lib/data';

const WorkerDashboardPage = () => {
  // For now, hardcode a user. In a real app, this would come from auth context.
  const [currentUser, setCurrentUser] = useState(users[0]); 

  // Filter jobs based on user's applications and hiredJobs
  const appliedJobs = jobs.filter(job => currentUser.applications.includes(job.id));
  const hiredJobs = jobs.filter(job => currentUser.hiredJobs.includes(job.id));

  return (
    <div className="min-h-screen text-white pt-20">
      <Header />
      <div className="max-w-4xl mx-auto bg-white/20 backdrop-blur-md p-8 rounded-lg border border-white/20 shadow-lg">
        <h1 className="text-4xl font-bold mb-6">Your Dashboard</h1>
        
        <div className="space-y-8">
          <JobStatusList title="Applied Jobs" jobs={appliedJobs} />
          <JobStatusList title="Hired Jobs" jobs={hiredJobs} />
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboardPage;
