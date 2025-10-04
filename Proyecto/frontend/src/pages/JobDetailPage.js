import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobs } from '../lib/data';
import ApplicationModal from '../components/job/ApplicationModal';
import Header from '../components/layout/Header';
import { ArrowLeft, MapPin, DollarSign, Clock, Briefcase, Heart, Users, Mail, Phone, Share2, Flag } from 'lucide-react';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const job = jobs.find((j) => j.id === id);

  // Check if job is saved or applied on mount
  useEffect(() => {
    if (job) {
      const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
      setIsSaved(savedJobs.includes(job.id));
      setHasApplied(appliedJobs.includes(job.id));
    }
  }, [job]);

  // Toggle save job
  const toggleSaveJob = () => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    let updatedSavedJobs;

    if (isSaved) {
      updatedSavedJobs = savedJobs.filter(jobId => jobId !== job.id);
    } else {
      updatedSavedJobs = [...savedJobs, job.id];
    }

    localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
    setIsSaved(!isSaved);
  };

  // Share job
  const shareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!job) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center bg-gradient-to-br from-[#5AB9EA] via-[#4A9FD8] to-[#6B8CCC]">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Job not found</h1>
          <button
            onClick={() => navigate('/jobs')}
            className="bg-[#2EC4BC] hover:bg-[#24A09A] text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Back to Job Listings
          </button>
        </div>
      </div>
    );
  }

  // Get badge color based on job type
  const getTypeBadgeColor = (type) => {
    const colors = {
      'Part-time': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'Full-time': 'bg-green-500/20 text-green-300 border-green-500/30',
      'Contract': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'Temporary': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    };
    return colors[type] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5AB9EA] via-[#4A9FD8] to-[#6B8CCC] text-white pt-20 pb-12 px-4">
      <Header />
      
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-2 px-4 rounded-lg transition duration-300 mb-6 border border-white/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </button>

        {/* Main Job Card */}
        <div className="bg-white/20 backdrop-blur-md p-8 rounded-lg border border-white/20 shadow-lg">
          {/* Header Section with Actions */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              {/* Job Type & Status Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {job.type && (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeBadgeColor(job.type)}`}>
                    {job.type}
                  </span>
                )}
                {job.remote && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-teal-500/20 text-teal-300 border-teal-500/30">
                    Remote
                  </span>
                )}
                {hasApplied && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/80 text-white">
                    ✓ Applied
                  </span>
                )}
              </div>

              {/* Job Title */}
              <h1 className="text-4xl font-bold text-white mb-3">{job.title}</h1>
              
              {/* Company */}
              <p className="text-white/90 text-xl font-medium mb-3">{job.company}</p>
              
              {/* Job Meta Info */}
              <div className="flex flex-wrap gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  <span>{job.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{job.duration}</span>
                </div>
                {job.applicants !== undefined && (
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{job.applicants} applicant{job.applicants !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons (Save, Share, Report) */}
            <div className="flex gap-2 ml-4">
              <button
                onClick={toggleSaveJob}
                className={`p-3 rounded-lg transition-all ${
                  isSaved 
                    ? 'bg-red-500/80 hover:bg-red-500' 
                    : 'bg-white/20 hover:bg-white/30'
                } backdrop-blur-sm border border-white/20`}
                title={isSaved ? 'Remove from saved' : 'Save job'}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />
              </button>
              <button
                onClick={shareJob}
                className="p-3 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition border border-white/20"
                title="Share job"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => alert('Report functionality coming soon')}
                className="p-3 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition border border-white/20"
                title="Report job"
              >
                <Flag className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/20 my-6"></div>

          {/* Pay Rate Section */}
          <div className="mb-6 bg-white/10 p-5 rounded-lg border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-6 h-6 text-green-300" />
              <h2 className="text-2xl font-semibold text-white">Pay Rate</h2>
            </div>
            <p className="text-white text-2xl font-bold">{job.payRate}</p>
          </div>

          {/* Description Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-3 flex items-center gap-2">
              <Briefcase className="w-6 h-6" />
              Job Description
            </h2>
            <p className="text-white/90 text-base leading-relaxed">{job.description}</p>
          </div>

          {/* Additional Details if available */}
          {job.requirements && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white mb-3">Requirements</h2>
              <ul className="list-disc list-inside text-white/90 space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Shop Contact Section */}
          {(job.shopContactEmail || job.shopContactPhone) && (
            <div className="mb-6 bg-white/10 p-5 rounded-lg border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-3">Contact Information</h2>
              <div className="space-y-2">
                {job.shopContactEmail && (
                  <div className="flex items-center gap-2 text-white/90">
                    <Mail className="w-5 h-5 text-blue-300" />
                    <a 
                      href={`mailto:${job.shopContactEmail}`}
                      className="hover:text-[#2EC4BC] transition underline"
                    >
                      {job.shopContactEmail}
                    </a>
                  </div>
                )}
                {job.shopContactPhone && (
                  <div className="flex items-center gap-2 text-white/90">
                    <Phone className="w-5 h-5 text-green-300" />
                    <a 
                      href={`tel:${job.shopContactPhone}`}
                      className="hover:text-[#2EC4BC] transition underline"
                    >
                      {job.shopContactPhone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Date Posted */}
          {job.datePosted && (
            <p className="text-white/60 text-sm mb-6">
              Posted on {new Date(job.datePosted).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          )}

          {/* Divider */}
          <div className="border-t border-white/20 my-6"></div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={hasApplied}
              className={`flex-1 font-bold py-3 px-6 rounded-lg transition duration-300 text-lg ${
                hasApplied
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-[#2EC4BC] hover:bg-[#24A09A] text-white'
              }`}
            >
              {hasApplied ? 'Already Applied' : 'Apply Now'}
            </button>
            <button
              onClick={toggleSaveJob}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-lg border border-white/30"
            >
              {isSaved ? 'Saved ✓' : 'Save for Later'}
            </button>
          </div>
        </div>

        {/* Similar Jobs Section (Optional) */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Similar Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs
              .filter(j => j.id !== job.id && (j.category === job.category || j.location === job.location))
              .slice(0, 2)
              .map(similarJob => (
                <div
                  key={similarJob.id}
                  onClick={() => navigate(`/job/${similarJob.id}`)}
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 hover:bg-white/20 transition cursor-pointer"
                >
                  <h3 className="font-bold text-lg mb-1">{similarJob.title}</h3>
                  <p className="text-white/80 text-sm mb-2">{similarJob.company}</p>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <MapPin className="w-4 h-4" />
                    <span>{similarJob.location}</span>
                  </div>
                  <p className="text-[#2EC4BC] font-semibold mt-2">{similarJob.payRate}</p>
                </div>
              ))}
          </div>
        </div>
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