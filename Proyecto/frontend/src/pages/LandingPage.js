
import React from 'react';

const LandingPage = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white">
      <div className="text-center">
        <h1 className="text-8xl font-bold tracking-wider mb-4">Solvit</h1>
        <p className="text-xl text-gray-300 mb-12">Your Next Opportunity Awaits.</p>
        <div className="space-x-6">
          <button className="bg-white/10 backdrop-blur-md text-white font-bold py-3 px-8 rounded-lg border border-white/20 hover:bg-white/20 transition duration-300">
            For Workers
          </button>
          <button className="bg-white/10 backdrop-blur-md text-white font-bold py-3 px-8 rounded-lg border border-white/20 hover:bg-white/20 transition duration-300">
            For Companies
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
