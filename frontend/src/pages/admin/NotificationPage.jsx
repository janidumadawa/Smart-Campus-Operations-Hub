// frontend/src/pages/admin/NotificationPage.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import { Bell, Calendar, Ticket, CheckCheck, Mail, Check, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const NotificationPage = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const userId = user?.id || user?.email || localStorage.getItem('userId');

  const fetchNotifications = async () => {
    if (!userId || userId === 'null' || userId === 'undefined') {
      console.warn('Waiting for valid userId...');
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/notifications/${userId}?page=0&size=50`);
      if (response.data.success) {
        setNotifications(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Fail silently for admin stats to prevent annoying duplicates
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await axiosInstance.put(`/notifications/${id}/mark-as-read`);
      if (response.data.success) {
        fetchNotifications();
        toast.success('Marked as read');
      }
    } catch (error) {
      console.error('Error marking as read:', error);
      toast.error('Failed to update status');
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await axiosInstance.put(`/notifications/${userId}/mark-all-as-read`);
      if (response.data.success) {
        fetchNotifications();
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to update notifications');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/notifications/${id}`);
      if (response.data.success) {
        fetchNotifications();
        toast.success('Notification deleted');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete');
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [userId]);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    return n.category?.toLowerCase() === filter.toLowerCase();
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-1">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2342]">Notifications</h1>
          <p className="text-gray-600 mt-1">Stay updated with your campus activities</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors shadow-sm"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Bell className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#0A2342]">{notifications.length}</p>
            <p className="text-sm font-medium text-gray-500">Total Notifications</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-orange-100 rounded-lg">
            <Mail className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
            <p className="text-sm font-medium text-gray-500">Unread Alerts</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-green-100 rounded-lg">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{notifications.length - unreadCount}</p>
            <p className="text-sm font-medium text-gray-500">Read & Processed</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-8 inline-flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
            filter === 'all'
              ? 'bg-[#F47C20] text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('BOOKING')}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
            filter === 'BOOKING'
              ? 'bg-[#F47C20] text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Bookings
        </button>
        <button
          onClick={() => setFilter('TICKET')}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
            filter === 'TICKET'
              ? 'bg-[#F47C20] text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Ticket className="w-4 h-4" />
          Tickets
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {loading && notifications.length === 0 ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F47C20]"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <Bell className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium italic text-lg whitespace-nowrap overflow-hidden">No notifications found in this category.</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`group bg-white rounded-xl shadow-sm border p-5 transition-all duration-200 hover:shadow-md ${
                !notification.read ? 'border-l-4 border-l-[#F47C20] bg-orange-50/20' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1 min-w-0">
                  <div className={`p-3 rounded-lg flex-shrink-0 ${
                    notification.category === 'BOOKING' ? 'bg-blue-50' : 'bg-orange-50'
                  }`}>
                    {notification.category === 'BOOKING' ? (
                      <Calendar className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Ticket className="w-6 h-6 text-[#F47C20]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-gray-900 truncate">{notification.title}</h3>
                      {!notification.read && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-[#F47C20] text-white rounded-full">New</span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2 md:line-clamp-none">{notification.message}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{new Date(notification.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Mark as read"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPage;