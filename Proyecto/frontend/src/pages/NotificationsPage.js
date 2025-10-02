import React, { useState } from 'react';
import Header from '../components/layout/Header';
import { users } from '../lib/data';
import { Link } from 'react-router-dom';
import { Bell, CheckCircle, XCircle, Briefcase, MessageCircle, Clock } from 'lucide-react';

const NotificationIcon = ({ type }) => {
  switch (type) {
    case 'new_job_match':
      return <Briefcase size={20} className="text-blue-600" />;
    case 'application_accepted':
      return <CheckCircle size={20} className="text-green-600" />;
    case 'application_rejected':
      return <XCircle size={20} className="text-red-600" />;
    case 'job_filled':
      return <Briefcase size={20} className="text-gray-500" />;
    case 'new_message':
      return <MessageCircle size={20} className="text-yellow-600" />;
    case 'job_starts_soon':
      return <Clock size={20} className="text-purple-600" />;
    default:
      return <Bell size={20} className="text-gray-500" />;
  }
};

const timeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

const NotificationsPage = () => {
  // For now, hardcode a user. In a real app, this would come from auth context.
  const [currentUser, setCurrentUser] = useState(users[0]); 

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

  return (
    <div className="min-h-screen text-gray-800 pt-20">
      <Header />
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg border border-gray-200 shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">All Notifications</h1>

        {currentUser.notifications.length > 0 ? (
          <div className="space-y-4">
            {currentUser.notifications.map((notification) => (
              <Link
                to={notification.link}
                key={notification.id}
                onClick={() => handleMarkAsRead(notification.id)}
                className={`flex items-center p-4 hover:bg-gray-100 transition duration-200 rounded-lg ${!notification.read ? 'bg-blue-50' : ''}`}
              >
                <NotificationIcon type={notification.type} />
                <div className="ml-3 flex-grow">
                  <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{timeAgo(notification.timestamp)}</p>
                </div>
                {!notification.read && (
                  <span className="w-2 h-2 bg-blue-400 rounded-full ml-2 flex-shrink-0"></span>
                )}
              </Link>
            ))}
            <div className="text-center mt-6">
              <button
                onClick={handleMarkAllAsRead}
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Mark All As Read
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg">You have no notifications.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;