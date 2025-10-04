import React, { useState } from 'react';
import Header from '../components/layout/Header';
import ProfileEditor from '../components/profile/ProfileEditor';
import { users } from '../lib/data';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  Edit3, 
  Check, 
  X,
  Award,
  Star,
  Clock,
  FileText
} from 'lucide-react';

const ProfilePage = () => {
  // For now, hardcode a user. In a real app, this would come from auth context.
  const [currentUser, setCurrentUser] = useState(users[0]); 
  const [isEditing, setIsEditing] = useState(false);

  // Mock stats - in real app, fetch from backend
  const stats = {
    jobsApplied: JSON.parse(localStorage.getItem('appliedJobs') || '[]').length,
    jobsSaved: JSON.parse(localStorage.getItem('savedJobs') || '[]').length,
    jobsCompleted: 12, // Mock data
    rating: 4.8 // Mock data
  };

  const handleSaveProfile = (updatedProfile) => {
    console.log('Profile Saved:', updatedProfile);
    setCurrentUser(updatedProfile);
    setIsEditing(false);
    // In a real app, this would send data to a backend API
    alert('Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5AB9EA] via-[#4A9FD8] to-[#6B8CCC] text-white pt-20 pb-12">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Profile</h1>
          <p className="text-white/80">Manage your personal information and preferences</p>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 shadow-lg mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Profile Picture/Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#2EC4BC] to-[#1E8E87] flex items-center justify-center text-4xl font-bold border-4 border-white/30 shadow-xl">
                {getInitials(currentUser.name)}
              </div>
              <button className="absolute bottom-0 right-0 bg-[#2EC4BC] hover:bg-[#24A09A] p-2 rounded-full border-4 border-white/20 transition shadow-lg">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{currentUser.name}</h2>
              <div className="flex flex-wrap gap-4 text-white/80 mb-4">
                {currentUser.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{currentUser.email}</span>
                  </div>
                )}
                {currentUser.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{currentUser.phone}</span>
                  </div>
                )}
                {currentUser.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{currentUser.location}</span>
                  </div>
                )}
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{stats.rating} Rating</span>
                  </div>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Award className="w-4 h-4" />
                    <span>{stats.jobsCompleted} Jobs Completed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Profile Button */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#2EC4BC] hover:bg-[#24A09A] text-white font-semibold py-3 px-6 rounded-lg transition flex items-center gap-2 shadow-lg"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Form or Profile Details */}
            {isEditing ? (
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Edit3 className="w-6 h-6" />
                    Edit Profile
                  </h2>
                  <button
                    onClick={handleCancelEdit}
                    className="text-white/70 hover:text-white transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <ProfileEditor user={currentUser} onSave={handleSaveProfile} />
              </div>
            ) : (
              <>
                {/* About Section */}
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 shadow-lg">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <User className="w-6 h-6" />
                    About
                  </h2>
                  <p className="text-white/90 leading-relaxed">
                    {currentUser.description || 'No description provided yet.'}
                  </p>
                </div>

                {/* Personal Information */}
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 shadow-lg">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-6 h-6" />
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                      <div className="flex items-center gap-2 mb-2 text-white/70">
                        <GraduationCap className="w-4 h-4" />
                        <span className="text-sm font-medium">Education</span>
                      </div>
                      <p className="text-lg font-semibold">{currentUser.education || 'Not specified'}</p>
                    </div>
                    
                    <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                      <div className="flex items-center gap-2 mb-2 text-white/70">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">Age</span>
                      </div>
                      <p className="text-lg font-semibold">{currentUser.age || 'Not specified'}</p>
                    </div>
                    
                    <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                      <div className="flex items-center gap-2 mb-2 text-white/70">
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">Gender</span>
                      </div>
                      <p className="text-lg font-semibold">{currentUser.gender || 'Not specified'}</p>
                    </div>
                    
                    <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                      <div className="flex items-center gap-2 mb-2 text-white/70">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-sm font-medium">Experience</span>
                      </div>
                      <p className="text-lg font-semibold">{currentUser.experience || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Skills Section (if available) */}
                {currentUser.skills && currentUser.skills.length > 0 && (
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                      <Award className="w-6 h-6" />
                      Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {currentUser.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-[#2EC4BC]/20 border border-[#2EC4BC]/30 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar - Right Column (1/3) */}
          <div className="space-y-6">
            {/* Activity Stats */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Activity Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-300" />
                    </div>
                    <span className="text-sm">Jobs Applied</span>
                  </div>
                  <span className="text-2xl font-bold">{stats.jobsApplied}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-500/20 p-2 rounded-lg">
                      <Star className="w-5 h-5 text-red-300" />
                    </div>
                    <span className="text-sm">Jobs Saved</span>
                  </div>
                  <span className="text-2xl font-bold">{stats.jobsSaved}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500/20 p-2 rounded-lg">
                      <Check className="w-5 h-5 text-green-300" />
                    </div>
                    <span className="text-sm">Jobs Completed</span>
                  </div>
                  <span className="text-2xl font-bold">{stats.jobsCompleted}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-500/20 p-2 rounded-lg">
                      <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                    </div>
                    <span className="text-sm">Average Rating</span>
                  </div>
                  <span className="text-2xl font-bold">{stats.rating}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-white/20 hover:bg-white/30 py-3 px-4 rounded-lg transition flex items-center gap-3 border border-white/20">
                  <Clock className="w-5 h-5" />
                  <span>View Application History</span>
                </button>
                <button className="w-full bg-white/20 hover:bg-white/30 py-3 px-4 rounded-lg transition flex items-center gap-3 border border-white/20">
                  <Star className="w-5 h-5" />
                  <span>View Saved Jobs</span>
                </button>
                <button className="w-full bg-white/20 hover:bg-white/30 py-3 px-4 rounded-lg transition flex items-center gap-3 border border-white/20">
                  <Award className="w-5 h-5" />
                  <span>View Certificates</span>
                </button>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Profile Completion</h2>
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span className="font-bold">75%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 border border-white/30">
                  <div className="bg-gradient-to-r from-[#2EC4BC] to-[#1E8E87] h-3 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <p className="text-sm text-white/70">
                Complete your profile to increase your chances of getting hired!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;