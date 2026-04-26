import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance.js';
import { Trash2, Check, CircleX } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotificationHistoryPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Get userId from localStorage or context
  const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');

  // Fetch notifications
  const fetchNotifications = async (page = 0) => {
    if (!userId) {
      toast.error('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      let url = `/api/notifications/${userId}?page=${page}&size=15`;
      
      if (selectedCategory !== 'ALL') {
        url = `/api/notifications/${userId}/category/${selectedCategory}`;
      }

      const response = await axiosInstance.get(url);
      if (response.data.success) {
        setNotifications(response.data.data);
        setTotalPages(response.data.totalPages || 1);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  // Mark as read
  const handleMarkAsRead = async (notificationId, isRead) => {
    try {
      const endpoint = isRead 
        ? `/api/notifications/${notificationId}/mark-as-unread`
        : `/api/notifications/${notificationId}/mark-as-read`;
      
      const response = await axiosInstance.put(endpoint);
      if (response.data.success) {
        fetchNotifications(currentPage);
        toast.success(isRead ? 'Marked as unread' : 'Marked as read');
      }
    } catch (error) {
      console.error('Error updating notification:', error);
      toast.error('Failed to update notification');
    }
  };

  // Delete notification
  const handleDelete = async (notificationId) => {
    try {
      const response = await axiosInstance.delete(`/api/notifications/${notificationId}`);
      if (response.data.success) {
        fetchNotifications(currentPage);
        toast.success('Notification deleted');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [selectedCategory]);

  const getNotificationIcon = (category) => {
    switch (category) {
      case 'BOOKING':
        return '📅';
      case 'TICKET':
        return '🔧';
      case 'SYSTEM':
        return '⚙️';
      default:
        return '📬';
    }
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'BOOKING':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Booking</span>;
      case 'TICKET':
        return <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">Ticket</span>;
      case 'SYSTEM':
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">System</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{category}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notification History</h1>
          <p className="text-gray-600 mt-2">View and manage all your notifications</p>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setCurrentPage(0);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedCategory === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              setSelectedCategory('BOOKING');
              setCurrentPage(0);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedCategory === 'BOOKING'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            📅 Bookings
          </button>
          <button
            onClick={() => {
              setSelectedCategory('TICKET');
              setCurrentPage(0);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedCategory === 'TICKET'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            🔧 Tickets
          </button>
          <button
            onClick={() => {
              setSelectedCategory('SYSTEM');
              setCurrentPage(0);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedCategory === 'SYSTEM'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            ⚙️ System
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No notifications found</div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 rounded-lg border-l-4 transition ${
                    notification.isRead
                      ? 'bg-white border-gray-300'
                      : 'bg-blue-50 border-blue-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <span className="text-3xl">
                        {getNotificationIcon(notification.category)}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {notification.title}
                          </h3>
                          {getCategoryBadge(notification.category)}
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-gray-700 mb-3">{notification.message}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>
                            {new Date(notification.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <span>
                            {new Date(notification.createdAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleMarkAsRead(notification.id, notification.isRead)}
                        className={`p-2 rounded-lg transition ${
                          notification.isRead
                            ? 'text-gray-400 hover:bg-gray-100'
                            : 'text-blue-600 hover:bg-blue-100'
                        }`}
                        title={notification.isRead ? 'Mark as unread' : 'Mark as read'}
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
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
        {totalPages > 1 && (
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={() => fetchNotifications(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
            >
              ← Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => fetchNotifications(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}













