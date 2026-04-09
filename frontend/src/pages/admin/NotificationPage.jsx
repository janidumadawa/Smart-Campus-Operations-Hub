// frontend/src/pages/admin/NotificationPage.jsx
import React, { useState } from 'react';
import { Bell, Calendar, Ticket, CheckCheck, Mail, Filter, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const NotificationPage = () => {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'booking', title: 'Booking Approved', message: 'Your booking for Lecture Hall A on Apr 1 has been approved', date: '2024-04-01 10:30 AM', read: false },
    { id: 2, type: 'ticket', title: 'Ticket Update', message: 'Ticket #2 status changed to In Progress', date: '2024-04-01 09:15 AM', read: false },
    { id: 3, type: 'booking', title: 'New Booking Request', message: 'New booking request for Computer Lab B from John Doe', date: '2024-03-31 03:45 PM', read: true },
    { id: 4, type: 'ticket', title: 'Ticket Resolved', message: 'Ticket #1 has been marked as Resolved', date: '2024-03-31 11:20 AM', read: true },
    { id: 5, type: 'booking', title: 'Booking Cancelled', message: 'Booking for Meeting Room 1 has been cancelled', date: '2024-03-30 02:10 PM', read: true },
  ]);

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

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2342]">Notifications</h1>
          <p className="text-gray-600 mt-1">Stay updated with your campus activities</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#F47C20]/10 rounded-lg">
              <Bell className="w-5 h-5 text-[#F47C20]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0A2342]">{notifications.length}</p>
              <p className="text-sm text-gray-600">Total Notifications</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0A2342]">{unreadCount}</p>
              <p className="text-sm text-gray-600">Unread</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0A2342]">{notifications.filter(n => n.read).length}</p>
              <p className="text-sm text-gray-600">Read</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-[#F47C20] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('booking')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              filter === 'booking'
                ? 'bg-[#F47C20] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Bookings
          </button>
          <button
            onClick={() => setFilter('ticket')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              filter === 'ticket'
                ? 'bg-[#F47C20] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Ticket className="w-4 h-4" />
            Tickets
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No notifications found</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl shadow-sm border p-4 transition-all ${
                !notification.read ? 'border-l-4 border-l-[#F47C20] bg-orange-50/30' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${
                    notification.type === 'booking' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    {notification.type === 'booking' ? (
                      <Calendar className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Ticket className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      {!notification.read && (
                        <span className="px-2 py-0.5 text-xs bg-[#F47C20] text-white rounded-full">New</span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-400">{notification.date}</p>
                  </div>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="px-3 py-1 text-xs text-gray-500 hover:text-[#F47C20] transition-colors"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPage;