import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobs } from '../lib/data';
import Header from '../components/layout/Header';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Clock, 
  Briefcase, 
  Heart, 
  Filter, 
  X, 
  Users, 
  ChevronDown 
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState(
    new Set(JSON.parse(localStorage.getItem('savedJobs') || '[]'))
  );
  const [appliedJobs] = useState(
    new Set(JSON.parse(localStorage.getItem('appliedJobs') || '[]'))
  );

  // Extract unique categories and types
  const categories = ['All', ...new Set(jobs.map(job => job.category))];
  const jobTypes = ['All', ...new Set(jobs.map(job => job.type || 'Other'))];

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let filtered = jobs.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
      const matchesType = selectedType === 'All' || job.type === selectedType;
      
      return matchesSearch && matchesCategory && matchesType;
    });

    // Sort jobs
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'date':
          return new Date(b.datePosted || Date.now()) - new Date(a.datePosted || Date.now());
        case 'relevance':
          return 0;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedType, sortBy]);

  // Toggle save job
  const toggleSaveJob = (jobId, e) => {
    e.stopPropagation();
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      localStorage.setItem('savedJobs', JSON.stringify([...newSet]));
      return newSet;
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedType('All');
  };

  // Get type badge color
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
    <div className="min-h-screen bg-gradient-to-br from-[#5AB9EA] via-[#4A9FD8] to-[#6B8CCC] text-white pt-20 pb-12">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Available Jobs</h1>
          <p className="text-white/80 text-lg">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'opportunity' : 'opportunities'} available
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 md:p-6 mb-8 border border-white/20">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by job title, company, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#2EC4BC] focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 py-2 px-4 rounded-lg transition mb-4"
          >
            <Filter className="w-4 h-4" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>

          {/* Filters Row */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${showFilters ? 'block' : 'hidden lg:grid'}`}>
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2EC4BC]"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-gray-800 text-white">
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-white/60" />
              </div>
            </div>

            {/* Job Type Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Job Type</label>
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2EC4BC]"
                >
                  {jobTypes.map(type => (
                    <option key={type} value={type} className="bg-gray-800 text-white">
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-white/60" />
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2EC4BC]"
                >
                  <option value="date" className="bg-gray-800 text-white">Most Recent</option>
                  <option value="relevance" className="bg-gray-800 text-white">Relevance</option>
                  <option value="alphabetical" className="bg-gray-800 text-white">Alphabetical</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-white/60" />
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                disabled={searchTerm === '' && selectedCategory === 'All' && selectedType === 'All'}
                className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 rounded-lg transition flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || selectedCategory !== 'All' || selectedType !== 'All') && (
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-sm text-white/80">Active filters:</span>
            {searchTerm && (
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center gap-2 border border-white/30">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="hover:text-red-300">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center gap-2 border border-white/30">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('All')} className="hover:text-red-300">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedType !== 'All' && (
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center gap-2 border border-white/30">
                {selectedType}
                <button onClick={() => setSelectedType('All')} className="hover:text-red-300">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Job Cards Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/15 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group relative"
                onClick={() => navigate(`/job/${job.id}`)}
              >
                {/* Save Button */}
                <button
                  onClick={(e) => toggleSaveJob(job.id, e)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10"
                  title={savedJobs.has(job.id) ? 'Remove from saved' : 'Save job'}
                >
                  <Heart
                    className={`w-5 h-5 ${savedJobs.has(job.id) ? 'fill-red-500 text-red-500' : 'text-white/60'}`}
                  />
                </button>

                {/* Applied Badge */}
                {appliedJobs.has(job.id) && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-green-500/90 rounded-full text-xs font-semibold shadow-lg">
                    ✓ Applied
                  </div>
                )}

                {/* Job Type & Remote Badges */}
                <div className="flex flex-wrap gap-2 mb-3 mt-2">
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
                </div>

                {/* Job Title */}
                <h3 className="text-2xl font-bold mb-2 pr-8 group-hover:text-[#2EC4BC] transition-colors">
                  {job.title}
                </h3>

                {/* Company */}
                <p className="text-white/90 font-medium mb-1">{job.company}</p>

                {/* Location & Category */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-white/70 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{job.category}</span>
                  </div>
                </div>

                {/* Pay Rate */}
                <div className="flex items-center gap-2 mb-4 bg-white/10 p-3 rounded-lg border border-white/20">
                  <DollarSign className="w-5 h-5 text-green-300" />
                  <span className="text-lg font-semibold text-white">
                    {job.payRate}
                  </span>
                </div>

                {/* Description Preview */}
                <p className="text-white/80 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Duration & Applicants */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/60 mb-4 pb-4 border-b border-white/20">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{job.duration}</span>
                  </div>
                  {job.applicants !== undefined && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{job.applicants} applicant{job.applicants !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/job/${job.id}`);
                    }}
                    className="flex-1 bg-blue-600/60 hover:bg-blue-600/80 text-white font-semibold py-2 px-4 rounded-lg transition border border-blue-400/30"
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/job/${job.id}`);
                    }}
                    className="flex-1 bg-[#2EC4BC] hover:bg-[#24A09A] text-white font-semibold py-2 px-4 rounded-lg transition shadow-md"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* No Results */
          <div className="text-center py-16">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 max-w-md mx-auto border border-white/20">
              <Search className="w-16 h-16 mx-auto mb-4 text-white/60" />
              <h3 className="text-2xl font-bold mb-2">No jobs found</h3>
              <p className="text-white/80 mb-4">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button
                onClick={clearFilters}
                className="bg-[#2EC4BC] hover:bg-[#24A09A] text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {filteredJobs.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm">
              Showing {filteredJobs.length} of {jobs.length} total jobs
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;