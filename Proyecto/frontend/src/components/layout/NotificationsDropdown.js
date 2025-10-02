import React from 'react';
import { Bell, CheckCircle, XCircle, Briefcase, MessageCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const NotificationsDropdown = ({ notifications, onMarkAsRead, onMarkAllAsRead, onClose }) => {
  const unreadNotifications = notifications.filter(n => !n.read);
  const displayNotifications = notifications.slice(0, 5); // Show most recent 5

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden animate-slide-down z-20">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
        {unreadNotifications.length > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Mark all as read
          </button>
        )}
      </div>
      <div className="max-h-80 overflow-y-auto">
        {displayNotifications.length > 0 ? (
          displayNotifications.map((notification) => (
            <Link
              to={notification.link}
              key={notification.id}
              onClick={() => { onMarkAsRead(notification.id); onClose(); }}
              className={`flex items-center p-4 hover:bg-gray-100 transition duration-200 ${!notification.read ? 'bg-blue-50' : ''}`}
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
          ))
        ) : (
          <p className="p-4 text-gray-600 text-sm text-center">No new notifications.</p>
        )}
      </div>
      <div className="p-4 border-t border-gray-200 text-center">
        <Link to="/notifications" onClick={onClose} className="text-blue-600 hover:text-blue-800 text-sm">
          View all notifications
        </Link>
      </div>
    </div>
  );
};

export default NotificationsDropdown;