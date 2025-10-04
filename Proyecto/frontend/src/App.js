import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import JobDetailPage from './pages/JobDetailPage';
import ProfilePage from './pages/ProfilePage';
import WorkerDashboardPage from './pages/WorkerDashboardPage';
import NotificationsPage from './pages/NotificationsPage';
import ShopDashboardPage from './pages/ShopDashboardPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/jobs" element={<HomePage />} />
        <Route path="/job/:id" element={<JobDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<WorkerDashboardPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/shop-dashboard" element={<ShopDashboardPage />} />
        {/* Add other routes here as we build them out */}
      </Routes>
    </Router>
  );
}

export default App;