import React from 'react';
import { Link } from 'react-router-dom';

const ShopHeader = () => {
  return (
    <header className="bg-white/10 backdrop-blur-md p-4 border-b border-white/20 text-white fixed top-0 left-0 w-full z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/shop-dashboard" className="text-2xl font-bold">Solvit for Shops</Link>
      </div>
    </header>
  );
};

export default ShopHeader;
