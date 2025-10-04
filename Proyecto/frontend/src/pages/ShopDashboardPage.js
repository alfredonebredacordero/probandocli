import React from 'react';
import Header from '../components/layout/Header';

const ShopDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5AB9EA] via-[#4A9FD8] to-[#6B8CCC] text-white pt-20 pb-12">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Company Dashboard</h1>
          <p className="text-white/80 text-lg">
            Welcome to your dashboard! Here you can manage your job postings and applications.
          </p>
        </div>
        {/* Add more company-specific dashboard content here */}
      </div>
    </div>
  );
};

export default ShopDashboardPage;
