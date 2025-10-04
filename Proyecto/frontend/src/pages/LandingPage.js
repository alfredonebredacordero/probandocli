import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleWorkerClick = () => {
    navigate('/auth?type=worker');
  };

  const handleCompanyClick = () => {
    navigate('/auth?type=company');
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-[#5EC8E5] via-[#6B9BD1] to-[#8B7EC8]">
      
      {/* More visible animated background blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-300/25 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Content container - better spacing */}
      <div className="relative z-10 text-center px-6 py-12 max-w-5xl w-full">
        
        {/* Logo with better gradient */}
        <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tight mb-6 text-white" 
            style={{
              textShadow: '0 10px 40px rgba(0,0,0,0.3), 0 0 80px rgba(255,255,255,0.2)'
            }}>
          Solvit
        </h1>
        
        {/* Tagline with better contrast */}
        <p className="text-2xl md:text-3xl text-white font-medium mb-6 drop-shadow-lg">
          Your Next Opportunity Awaits.
        </p>
        
        {/* Subtitle with better readability */}
        <p className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light drop-shadow-md">
          The easiest way for local shops to find temporary workers and for workers to find flexible gig opportunities in their community.
        </p>

        {/* Improved buttons with better contrast and hover states */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16 items-center">
          <button
            onClick={handleWorkerClick}
            className="group relative px-10 py-4 text-lg font-bold bg-white text-[#5EC8E5] rounded-xl shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-105 active:scale-100 min-w-[200px]"
          >
            <span className="flex items-center justify-center gap-2">
              I'm a Worker
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </button>

          <button
            onClick={handleCompanyClick}
            className="group relative px-10 py-4 text-lg font-bold bg-transparent text-white rounded-xl border-3 border-white shadow-2xl hover:bg-white hover:text-[#8B7EC8] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-105 active:scale-100 min-w-[200px]"
            style={{borderWidth: '3px'}}
          >
            <span className="flex items-center justify-center gap-2">
              I'm a Shop
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </button>
        </div>

        {/* More compact, visible features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-xl hover:bg-white/20 hover:scale-105 transition-all duration-300">
            <div className="w-14 h-14 mx-auto mb-4 bg-white/30 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 stroke-white" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Smart Matching</h3>
            <p className="text-white/90 text-sm">
              AI finds your perfect fit
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-xl hover:bg-white/20 hover:scale-105 transition-all duration-300">
            <div className="w-14 h-14 mx-auto mb-4 bg-white/30 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 stroke-white" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Lightning Fast</h3>
            <p className="text-white/90 text-sm">
              Connect in minutes, not weeks
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-xl hover:bg-white/20 hover:scale-105 transition-all duration-300">
            <div className="w-14 h-14 mx-auto mb-4 bg-white/30 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 stroke-white" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Trusted & Safe</h3>
            <p className="text-white/90 text-sm">
              Verified users and secure platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;