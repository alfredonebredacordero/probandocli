import React from 'react';
import { Link } from 'react-router-dom';

const AuthPage = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-8">Authentication</h1>
        <p className="text-lg text-gray-300 mb-4">Google Authentication (Coming Soon!)</p>
        <Link to="/jobs" className="text-blue-400 hover:underline">
          Skip for now
        </Link>
      </div>
    </div>
  );
};

export default AuthPage;