import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { users, jobs } from '../lib/data';
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  FileText,
  MapPin,
  DollarSign,
  Calendar,
  Heart,
  ChevronRight,
  Award,
  Star,
  AlertCircle
} from 'lucide-react';

const WorkerDashboardPage = () => {
  const navigate = useNavigate();
  // For now, hardcode a user. In a real app, this would come from auth context.
  const [currentUser, setCurrentUser] = useState(users[0]); 

  // Filter jobs based on user's applications and hiredJobs
  const appliedJobs = jobs.filter(job => currentUser.applications.includes(job.id));
  const hiredJobs = jobs.filter(job => currentUser.hiredJobs.includes(job.id));
  const savedJobs = jobs.filter(job => 
    JSON.parse(localStorage.getItem('savedJobs') || '[]').includes(job.id)
  );

  // Get stats
  const stats = [
    {
      icon: FileText,
      label: 'Applied',
      value: appliedJobs.length,
      color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      iconColor: 'text-blue-300'
    },
    {
      icon: CheckCircle,
      label: 'Hired',
      value: hiredJobs.length,
      color: 'bg-green-500/20 text-green-300 border-green-500/30',
      iconColor: 'text-green-300'
    },
    {
      icon: Heart,
      label: 'Saved',
      value: savedJobs.length,
      color: 'bg-red-500/20 text-red-300 border-red-500/30',
      iconColor: 'text-red-300'
    },
    {
      icon: TrendingUp,
      label: 'Success Rate',
      value: appliedJobs.length > 0 ? `${Math.round((hiredJobs.length / appliedJobs.length) * 100)}%` : '0%',
      color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      iconColor: 'text-purple-300'
    }
  ];

  // Job Card Component
  const JobCard = ({ job, status }) => (
    <div
      onClick={() => navigate(`/job/${job.id}`)}
      className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20 hover:bg-white/15 hover:shadow-lg transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white group-hover:text-[#2EC4BC] transition-colors mb-1">
            {job.title}
          </h3>
          <p className="text-white/80 font-medium">{job.company}</p>
        </div>
        {status === 'hired' && (
          <span className="px-3 py-1 bg-green-500/80 rounded-full text-xs font-semibold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Hired
          </span>
        )}
        {status === 'applied' && (
          <span className="px-3 py-1 bg-blue-500/80 rounded-full text-xs font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-white/70 mb-3">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Briefcase className="w-4 h-4" />
          <span>{job.category}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg border border-white/20">
          <DollarSign className="w-4 h-4 text-green-300" />
          <span className="font-semibold text-white">{job.payRate}</span>
        </div>
        <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5AB9EA] via-[#4A9FD8] to-[#6B8CCC] text-white pt-20 pb-12">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Your Dashboard</h1>
          <p className="text-white/80 text-lg">
            Welcome back, {currentUser.name}! Here's an overview of your job activity.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.color} backdrop-blur-md rounded-lg p-6 border`}
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
              </div>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm opacity-90">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => navigate('/jobs')}
            className="bg-[#2EC4BC] hover:bg-[#24A09A] text-white font-semibold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2 shadow-lg"
          >
            <Briefcase className="w-5 h-5" />
            Browse Jobs
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2 border border-white/30"
          >
            <Award className="w-5 h-5" />
            Edit Profile
          </button>
          <button
            onClick={() => navigate('/notifications')}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2 border border-white/30"
          >
            <Calendar className="w-5 h-5" />
            View Notifications
          </button>
        </div>

        {/* Applied Jobs Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Clock className="w-7 h-7" />
              Applied Jobs
            </h2>
            <span className="text-white/70 text-sm">
              {appliedJobs.length} {appliedJobs.length === 1 ? 'application' : 'applications'}
            </span>
          </div>
          
          {appliedJobs.length > 0 ? (
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 shadow-lg">
              <div className="space-y-4">
                {appliedJobs.map(job => (
                  <JobCard key={job.id} job={job} status="applied" />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-white/60" />
              <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
              <p className="text-white/70 mb-4">
                Start applying to jobs to see them here
              </p>
              <button
                onClick={() => navigate('/jobs')}
                className="bg-[#2EC4BC] hover:bg-[#24A09A] text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                Browse Jobs
              </button>
            </div>
          )}
        </div>

        {/* Hired Jobs Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <CheckCircle className="w-7 h-7" />
              Hired Jobs
            </h2>
            <span className="text-white/70 text-sm">
              {hiredJobs.length} {hiredJobs.length === 1 ? 'job' : 'jobs'}
            </span>
          </div>
          
          {hiredJobs.length > 0 ? (
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 shadow-lg">
              <div className="space-y-4">
                {hiredJobs.map(job => (
                  <JobCard key={job.id} job={job} status="hired" />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 text-center">
              <Star className="w-16 h-16 mx-auto mb-4 text-white/60" />
              <h3 className="text-xl font-semibold mb-2">No hired jobs yet</h3>
              <p className="text-white/70 mb-4">
                Keep applying! Your next opportunity is just around the corner.
              </p>
            </div>
          )}
        </div>

        {/* Saved Jobs Section */}
        {savedJobs.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <Heart className="w-7 h-7" />
                Saved Jobs
              </h2>
              <span className="text-white/70 text-sm">
                {savedJobs.length} saved {savedJobs.length === 1 ? 'job' : 'jobs'}
              </span>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 shadow-lg">
              <div className="space-y-4">
                {savedJobs.slice(0, 3).map(job => (
                  <JobCard key={job.id} job={job} status="saved" />
                ))}
              </div>
              {savedJobs.length > 3 && (
                <button
                  onClick={() => navigate('/jobs')}
                  className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  View All Saved Jobs
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerDashboardPage;