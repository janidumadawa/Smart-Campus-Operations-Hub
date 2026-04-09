// frontend/src/components/admin/NotificationPanel.jsx
import React, { useState } from 'react';
import { Bell, Calendar, Ticket, CheckCheck, Mail, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const NotificationPanel = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'booking', title: 'Booking Approved', message: 'Your booking for Lecture Hall A on Apr 1 has been approved', date: '2024-04-01 10:30 AM', read: false },
    { id: 2, type: 'ticket', title: 'Ticket Update', message: 'Ticket #2 status changed to In Progress', date: '2024-04-01 09:15 AM', read: false },
    { id: 3, type: 'booking', title: 'New Booking Request', message: 'New booking request for Computer Lab B from John Doe', date: '2024-03-31 03:45 PM', read: true },
    { id: 4, type: 'ticket', title: 'Ticket Resolved', message: 'Ticket #1 has been marked as Resolved', date: '2024-03-31 11:20 AM', read: true },
    { id: 5, type: 'booking', title: 'Booking Cancelled', message: 'Booking for Meeting Room 1 has been cancelled', date: '2024-03-30 02:10 PM', read: true },
  ]);

  const [filter, setFilter] = useState('all');

  const markAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
    toast.success('Marked as read');
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeIcon = (type) => {
    if (type === 'booking') {
      return <Calendar className="w-4 h-4 text-blue-500" />;
    }
    return <Ticket className="w-4 h-4 text-purple-500" />;
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />
        )}
      </AnimatePresence>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 right-6 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#F47C20]/5 to-white">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#F47C20]" />
                <h3 className="font-semibold text-[#0A2342]">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-[#F47C20] text-white rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-gray-500 hover:text-[#F47C20] transition-colors flex items-center gap-1"
                >
                  <CheckCheck className="w-3 h-3" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="px-4 py-2 border-b border-gray-100 flex gap-2 bg-gray-50">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  filter === 'all'
                    ? 'bg-[#F47C20] text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('booking')}
                className={`px-3 py-1 text-xs rounded-full transition-colors flex items-center gap-1 ${
                  filter === 'booking'
                    ? 'bg-[#F47C20] text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <Calendar className="w-3 h-3" />
                Bookings
              </button>
              <button
                onClick={() => setFilter('ticket')}
                className={`px-3 py-1 text-xs rounded-full transition-colors flex items-center gap-1 ${
                  filter === 'ticket'
                    ? 'bg-[#F47C20] text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <Ticket className="w-3 h-3" />
                Tickets
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No notifications</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-orange-50/30' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className={`p-2 rounded-lg ${
                          notification.type === 'booking' ? 'bg-blue-100' : 'bg-purple-100'
                        }`}>
                          {getTypeIcon(notification.type)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`text-sm font-medium ${
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">{notification.date}</p>
                          </div>
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="flex-shrink-0 p-1 hover:bg-gray-200 rounded"
                              title="Mark as read"
                            >
                              <Check className="w-3 h-3 text-gray-400" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => {
                  onClose();
                  window.location.href = '/admin/notifications';
                }}
                className="w-full text-center text-sm text-[#F47C20] hover:text-[#E06A10] transition-colors"
              >
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationPanel;