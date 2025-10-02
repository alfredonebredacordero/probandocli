import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import NotificationBadge from './NotificationBadge';
import NotificationsDropdown from './NotificationsDropdown';
import { users } from '../../lib/data'; // Import mock user data

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // For now, hardcode a user. In a real app, this would come from auth context.
  const [currentUser, setCurrentUser] = useState(users[0]); 
  const dropdownRef = useRef(null);

  const unreadCount = currentUser.notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id) => {
    setCurrentUser(prevUser => ({
      ...prevUser,
      notifications: prevUser.notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    }));
  };

  const handleMarkAllAsRead = () => {
    setCurrentUser(prevUser => ({
      ...prevUser,
      notifications: prevUser.notifications.map(n => ({ ...n, read: true }))
    }));
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white/10 backdrop-blur-md p-4 border-b border-white/20 text-white fixed top-0 left-0 w-full z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/jobs" className="text-2xl font-bold">Solvit</Link>
        <nav className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-lg hover:text-gray-300 transition duration-300">
            Dashboard
          </Link>
          <Link to="/jobs" className="text-lg hover:text-gray-300 transition duration-300">
            Job Listings
          </Link>
          <Link to="/profile" className="text-lg hover:text-gray-300 transition duration-300">
            Profile
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="relative p-2 rounded-full hover:bg-white/20 transition duration-300">
              <Bell size={24} />
              <NotificationBadge count={unreadCount} />
            </button>
            {isDropdownOpen && (
              <NotificationsDropdown 
                notifications={currentUser.notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onClose={() => setIsDropdownOpen(false)}
              />
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;