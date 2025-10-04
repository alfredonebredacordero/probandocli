import React, { useState } from 'react';
import Header from '../components/layout/Header';
import { users } from '../lib/data';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  Briefcase, 
  MessageCircle, 
  Clock,
  Check,
  Trash2,
  Filter,
  Mail,
  MailOpen,
  AlertCircle
} from 'lucide-react';

const NotificationIcon = ({ type }) => {
  const iconProps = { size: 24, strokeWidth: 2 };
  
  switch (type) {
    case 'new_job_match':
      return (
        <div className="bg-blue-500/20 p-3 rounded-full border border-blue-500/30">
          <Briefcase {...iconProps} className="text-blue-300" />
        </div>
      );
    case 'application_accepted':
      return (
        <div className="bg-green-500/20 p-3 rounded-full border border-green-500/30">
          <CheckCircle {...iconProps} className="text-green-300" />
        </div>
      );
    case 'application_rejected':
      return (
        <div className="bg-red-500/20 p-3 rounded-full border border-red-500/30">
          <XCircle {...iconProps} className="text-red-300" />
        </div>
      );
    case 'job_filled':
      return (
        <div className="bg-gray-500/20 p-3 rounded-full border border-gray-500/30">
          <Briefcase {...iconProps} className="text-gray-300" />
        </div>
      );
    case 'new_message':
      return (
        <div className="bg-yellow-500/20 p-3 rounded-full border border-yellow-500/30">
          <MessageCircle {...iconProps} className="text-yellow-300" />
        </div>
      );
    case 'job_starts_soon':
      return (
        <div className="bg-purple-500/20 p-3 rounded-full border border-purple-500/30">
          <Clock {...iconProps} className="text-purple-300" />
        </div>
      );
    default:
      return (
        <div className="bg-gray-500/20 p-3 rounded-full border border-gray-500/30">
          <Bell {...iconProps} className="text-gray-300" />
        </div>
      );
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
  const [filter, setFilter] = useState('all'); // all, unread, read

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

  const handleDelete = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentUser(prevUser => ({
      ...prevUser,
      notifications: prevUser.notifications.filter(n => n.id !== id)
    }));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all notifications?')) {
      setCurrentUser(prevUser => ({
        ...prevUser,
        notifications: []
      }));
    }
  };

  // Filter notifications
  const filteredNotifications = currentUser.notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const unreadCount = currentUser.notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5AB9EA] via-[#4A9FD8] to-[#6B8CCC] text-white pt-20 pb-12">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <Bell className="w-10 h-10" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">Notifications</h1>
          </div>
          <p className="text-white/80 text-lg">
            {unreadCount > 0 
              ? `You have ${unreadCount} unread ${unreadCount === 1 ? 'notification' : 'notifications'}`
              : 'You\'re all caught up!'
            }
          </p>
        </div>

        {/* Filter and Actions Bar */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 mb-6 border border-white/20 shadow-lg">
          <div className="flex flex-col gap-4">
            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${ 
                  filter === 'all' 
                    ? 'bg-[#2EC4BC] text-white shadow-md' 
                    : 'bg-white/20 hover:bg-white/30 text-white/80'
                }`}
              >
                <Mail className="w-4 h-4" />
                All
                <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {currentUser.notifications.length}
                </span>
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${ 
                  filter === 'unread' 
                    ? 'bg-[#2EC4BC] text-white shadow-md' 
                    : 'bg-white/20 hover:bg-white/30 text-white/80'
                }`}
              >
                <Mail className="w-4 h-4" />
                Unread
                {unreadCount > 0 && (
                  <span className="ml-1 bg-red-500 px-2 py-0.5 rounded-full text-xs font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${ 
                  filter === 'read' 
                    ? 'bg-[#2EC4BC] text-white shadow-md' 
                    : 'bg-white/20 hover:bg-white/30 text-white/80'
                }`}
              >
                <MailOpen className="w-4 h-4" />
                Read
                <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {currentUser.notifications.length - unreadCount}
                </span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center gap-2 border border-white/30"
                >
                  <Check className="w-4 h-4" />
                  Mark All as Read
                </button>
              )}
              {currentUser.notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-200 font-semibold py-2 px-4 rounded-lg transition flex items-center gap-2 border border-red-500/30"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-lg overflow-hidden">
            <div className="divide-y divide-white/10">
              {filteredNotifications.map((notification) => (
                <Link
                  to={notification.link}
                  key={notification.id}
                  onClick={() => handleMarkAsRead(notification.id)}
                  className={`flex items-start gap-4 p-5 hover:bg-white/10 transition-all duration-200 group relative ${ 
                    !notification.read ? 'bg-white/5 border-l-4 border-l-[#2EC4BC]' : ''
                  }`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <NotificationIcon type={notification.type} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-base leading-relaxed mb-1 ${ 
                      !notification.read ? 'font-semibold text-white' : 'text-white/80'
                    }`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="text-sm text-white/60 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {timeAgo(notification.timestamp)}
                      </p>
                      {!notification.read && (
                        <span className="px-2 py-0.5 bg-[#2EC4BC]/80 rounded-full text-xs font-semibold">
                          New
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Unread Indicator & Delete Button */}
                  <div className="flex items-center gap-3">
                    {!notification.read && (
                      <span className="w-3 h-3 bg-[#2EC4BC] rounded-full flex-shrink-0 shadow-lg"></span>
                    )}
                    <button
                      onClick={(e) => handleDelete(notification.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-lg transition-all"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4 text-red-300" />
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-12 border border-white/20 text-center shadow-lg">
            {filter === 'all' ? (
              <>
                <Bell className="w-20 h-20 mx-auto mb-4 text-white/40" />
                <h3 className="text-2xl font-bold mb-2">No notifications yet</h3>
                <p className="text-white/70">
                  When you receive notifications, they'll appear here.
                </p>
              </>
            ) : filter === 'unread' ? (
              <>
                <CheckCircle className="w-20 h-20 mx-auto mb-4 text-green-400/60" />
                <h3 className="text-2xl font-bold mb-2">All caught up!</h3>
                <p className="text-white/70 mb-4">
                  You have no unread notifications.
                </p>
                <button
                  onClick={() => setFilter('all')}
                  className="bg-[#2EC4BC] hover:bg-[#24A09A] text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  View All Notifications
                </button>
              </>
            ) : (
              <>
                <MailOpen className="w-20 h-20 mx-auto mb-4 text-white/40" />
                <h3 className="text-2xl font-bold mb-2">No read notifications</h3>
                <p className="text-white/70 mb-4">
                  Your read notifications will appear here.
                </p>
                <button
                  onClick={() => setFilter('all')}
                  className="bg-[#2EC4BC] hover:bg-[#24A09A] text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  View All Notifications
                </button>
              </>
            )}
          </div>
        )}

        {/* Summary Stats */}
        {currentUser.notifications.length > 0 && filteredNotifications.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Showing {filteredNotifications.length} of {currentUser.notifications.length} total notifications
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
