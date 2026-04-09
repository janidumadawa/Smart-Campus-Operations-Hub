import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance.js';
import { Bell, X, Check, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotificationPanel({ userId, isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch notifications
  const fetchNotifications = async (page = 0) => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/notifications/${userId}?page=${page}&size=10`);
      if (response.data.success) {
        setNotifications(response.data.data);
        setTotalPages(response.data.totalPages);
        setCurrentPage(page);
        fetchUnreadCount();
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    if (!userId) return;
    
    try {
      const response = await axiosInstance.get(`/api/notifications/${userId}/count`);
      if (response.data.success) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  // Mark as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await axiosInstance.put(`/api/notifications/${notificationId}/mark-as-read`);
      if (response.data.success) {
        fetchNotifications(currentPage);
        toast.success('Marked as read');
      }
    } catch (error) {
      console.error('Error marking as read:', error);
      toast.error('Failed to mark as read');
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

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      const response = await axiosInstance.put(`/api/notifications/${userId}/mark-all-as-read`);
      if (response.data.success) {
        fetchNotifications(currentPage);
        toast.success('All marked as read');
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchNotifications();
      // Auto-refresh every 30 seconds
      const interval = setInterval(() => fetchNotifications(currentPage), 30000);
      return () => clearInterval(interval);
    }
  }, [isOpen, userId]);

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

  const getCategoryColor = (category) => {
    switch (category) {
      case 'BOOKING':
        return 'bg-blue-50 border-l-4 border-blue-400';
      case 'TICKET':
        return 'bg-orange-50 border-l-4 border-orange-400';
      case 'SYSTEM':
        return 'bg-gray-50 border-l-4 border-gray-400';
      default:
        return 'bg-gray-50 border-l-4 border-gray-400';
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
        <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-lg flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Bell className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold">Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mark all as read button */}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 border-b"
            >
              Mark all as read
            </button>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition ${
                      notification.isRead ? 'bg-white' : 'bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-1">
                        {getNotificationIcon(notification.category)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-1">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notification.createdAt).toLocaleDateString()}{' '}
                          {new Date(notification.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 justify-end">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t flex justify-between items-center">
              <button
                onClick={() => fetchNotifications(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => fetchNotifications(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    )
  );
}
