import React, { useState } from 'react';
import Header from '../components/layout/Header';
import ProfileEditor from '../components/profile/ProfileEditor';
import { users } from '../lib/data';

const ProfilePage = () => {
  // For now, hardcode a user. In a real app, this would come from auth context.
  const [currentUser, setCurrentUser] = useState(users[0]); 

  const handleSaveProfile = (updatedProfile) => {
    console.log('Profile Saved:', updatedProfile);
    setCurrentUser(updatedProfile);
    // In a real app, this would send data to a backend API
    alert('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen text-white pt-20">
      <Header />
      <div className="max-w-4xl mx-auto bg-white/20 backdrop-blur-md p-8 rounded-lg border border-white/20 shadow-lg">
        <h1 className="text-4xl font-bold mb-6">Your Profile</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Current Information:</h2>
          <p className="text-lg"><strong>Name:</strong> {currentUser.name}</p>
          <p className="text-lg"><strong>Education:</strong> {currentUser.education}</p>
          <p className="text-lg"><strong>Age:</strong> {currentUser.age}</p>
          <p className="text-lg"><strong>Gender:</strong> {currentUser.gender}</p>
          <p className="text-lg"><strong>Experience:</strong> {currentUser.experience}</p>
          <p className="text-lg"><strong>Description:</strong> {currentUser.description}</p>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Edit Profile:</h2>
        <ProfileEditor user={currentUser} onSave={handleSaveProfile} />
      </div>
    </div>
  );
};

export default ProfilePage;