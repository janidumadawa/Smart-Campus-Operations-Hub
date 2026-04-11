import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { Trash2, Check, Bell, Inbox, AlertCircle, Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function NotificationHistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({ total: 0, unread: 0, read: 0 });
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const userId = user?.id || user?.email || localStorage.getItem('userId');

  const fetchStats = async () => {
    if (!userId || userId === 'null' || userId === 'undefined') return;
    try {
      const response = await axiosInstance.get(`/notifications/${userId}/count`);
      if (response.data.success) {
        setStats(prev => ({ ...prev, unread: response.data.unreadCount }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchNotifications = async (page = 0) => {
    if (!userId || userId === 'null' || userId === 'undefined') {
      console.warn('Waiting for valid userId...');
      return;
    }

    setLoading(true);
    try {
      let url = `/notifications/${userId}?page=${page}&size=15`;
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        let data = response.data.data;
        
        if (selectedCategory !== 'ALL') {
          const catResponse = await axiosInstance.get(`/notifications/${userId}/category/${selectedCategory}`);
          if (catResponse.data.success) {
            data = catResponse.data.notifications;
            setTotalPages(1);
          }
        } else {
          setTotalPages(response.data.totalPages || 1);
        }
        
        setNotifications(data);
        setCurrentPage(page);
        
        setStats({
          total: response.data.totalElements || data.length,
          unread: response.data.totalElements ? stats.unread : data.filter(n => !n.read).length,
          read: (response.data.totalElements || data.length) - (stats.unread || 0)
        });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Suppress alert for transient states
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId, currentReadStatus) => {
    try {
      const endpoint = currentReadStatus 
        ? `/notifications/${notificationId}/mark-as-unread`
        : `/notifications/${notificationId}/mark-as-read`;
      
      const response = await axiosInstance.put(endpoint);
      if (response.data.success) {
        fetchNotifications(currentPage);
        fetchStats();
        toast.success(currentReadStatus ? 'Marked as unread' : 'Marked as read');
      }
    } catch (error) {
      console.error('Error updating notification:', error);
      toast.error('Failed to update notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await axiosInstance.put(`/notifications/${userId}/mark-all-as-read`);
      if (response.data.success) {
        fetchNotifications(0);
        fetchStats();
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to update notifications');
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      const response = await axiosInstance.delete(`/notifications/${notificationId}`);
      if (response.data.success) {
        fetchNotifications(currentPage);
        fetchStats();
        toast.success('Notification deleted');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  useEffect(() => {
    if (userId && userId !== 'null') {
      fetchNotifications();
      fetchStats();
    }
  }, [selectedCategory, userId]);

  const getNotificationIcon = (category) => {
    switch (category) {
      case 'BOOKING': return <Inbox className="w-6 h-6 text-blue-500" />;
      case 'TICKET': return <AlertCircle className="w-6 h-6 text-orange-500" />;
      case 'SYSTEM': return <Bell className="w-6 h-6 text-gray-500" />;
      default: return <Bell className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-200 rounded-full transition">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
               </button>
               <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            </div>
            <p className="text-gray-600">Stay updated with your campus activities</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/notification-preferences')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
              title="Notification Settings"
            >
              <Save className="w-4 h-4" />
              Settings
            </button>
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
            >
              <Check className="w-4 h-4" />
              Mark all as read
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500">Total Notifications</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500">Unread</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">{stats.unread}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-gray-500">Read</div>
            <div className="text-2xl font-bold text-green-600 mt-1">{Math.max(0, stats.total - stats.unread)}</div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {['ALL', 'BOOKING', 'TICKET', 'SYSTEM'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(0);
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
              }`}
            >
              {cat.charAt(0) + cat.slice(1).toLowerCase()}s
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No notifications found</h3>
              <p className="text-gray-500 mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`group relative bg-white p-5 rounded-xl border transition-all duration-200 ${
                    notification.read 
                      ? 'border-gray-200 opacity-80' 
                      : 'border-blue-200 bg-blue-50/30'
                  } hover:shadow-md`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${notification.read ? 'bg-gray-100' : 'bg-blue-100'}`}>
                      {getNotificationIcon(notification.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold text-gray-900 truncate ${!notification.read ? 'pr-2' : ''}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded-full">New</span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>{new Date(notification.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleMarkAsRead(notification.id, notification.read)}
                        className={`p-2 rounded-lg transition ${
                          notification.read ? 'text-gray-400 hover:bg-gray-100' : 'text-blue-600 hover:bg-blue-100'
                        }`}
                        title={notification.read ? 'Mark as unread' : 'Mark as read'}
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 text-red-400 hover:text-red-100 hover:text-red-600 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && selectedCategory === 'ALL' && (
          <div className="mt-8 flex justify-center items-center gap-4">
            <button
              onClick={() => fetchNotifications(currentPage - 1)}
              disabled={currentPage === 0}
              className="p-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition shadow-sm"
            >
              ←
            </button>
            <span className="text-sm font-medium text-gray-600">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => fetchNotifications(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="p-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition shadow-sm"
            >
              →
            </button>
          </div>
        )}
        
        {/* Simplified Link at the bottom */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center">
            <button
              onClick={() => navigate('/notification-preferences')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2"
            >
              Customize Notification Settings →
            </button>
        </div>
      </div>
    </div>
  );
}
