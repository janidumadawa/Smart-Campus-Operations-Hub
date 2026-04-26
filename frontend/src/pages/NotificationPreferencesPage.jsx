import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance.js';
import { Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotificationPreferencesPage() {
  const [preferences, setPreferences] = useState({
    bookingAlerts: true,
    ticketUpdates: true,
    emailNotifications: true,
    commentNotifications: true
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');

  // Fetch preferences
  const fetchPreferences = async () => {
    if (!userId) {
      toast.error('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/notifications/preferences/${userId}`);
      if (response.data.success) {
        setPreferences(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast.error('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  // Update preferences
  const handleSave = async () => {
    if (!userId) {
      toast.error('User not authenticated');
      return;
    }

    setSaving(true);
    try {
      const response = await axiosInstance.post(`/api/notifications/preferences/${userId}`, preferences);
      if (response.data.success) {
        setPreferences(response.data.data);
        toast.success('Preferences updated successfully');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  // Toggle preference
  const handleToggle = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  useEffect(() => {
    fetchPreferences();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-gray-500">Loading preferences...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notification Preferences</h1>
          <p className="text-gray-600 mt-2">Customize how you receive notifications</p>
        </div>

        {/* Info Banner */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            You can enable or disable notifications by category. System notifications cannot be disabled.
          </p>
        </div>

        {/* Preferences Card */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 space-y-6">
            {/* Booking Alerts */}
            <div className="flex items-center justify-between pb-6 border-b">
              <div>
                <h3 className="font-semibold text-gray-900">📅 Booking Notifications</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Get notified when your bookings are approved, rejected, or cancelled
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={preferences.bookingAlerts}
                    onChange={() => handleToggle('bookingAlerts')}
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-6 rounded-full transition ${
                      preferences.bookingAlerts ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                      preferences.bookingAlerts ? 'translate-x-4' : ''
                    }`}
                  ></div>
                </div>
              </label>
            </div>

            {/* Ticket Updates */}
            <div className="flex items-center justify-between pb-6 border-b">
              <div>
                <h3 className="font-semibold text-gray-900">🔧 Ticket Updates</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Get notified when ticket status changes or is assigned to you
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={preferences.ticketUpdates}
                    onChange={() => handleToggle('ticketUpdates')}
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-6 rounded-full transition ${
                      preferences.ticketUpdates ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                      preferences.ticketUpdates ? 'translate-x-4' : ''
                    }`}
                  ></div>
                </div>
              </label>
            </div>

            {/* Comment Notifications */}
            <div className="flex items-center justify-between pb-6 border-b">
              <div>
                <h3 className="font-semibold text-gray-900">💬 Comment Notifications</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Get notified when someone comments on your tickets or bookings
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={preferences.commentNotifications}
                    onChange={() => handleToggle('commentNotifications')}
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-6 rounded-full transition ${
                      preferences.commentNotifications ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                      preferences.commentNotifications ? 'translate-x-4' : ''
                    }`}
                  ></div>
                </div>
              </label>
            </div>

            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">📧 Email Notifications</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Receive email notifications in addition to in-app notifications
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={() => handleToggle('emailNotifications')}
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-6 rounded-full transition ${
                      preferences.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                      preferences.emailNotifications ? 'translate-x-4' : ''
                    }`}
                  ></div>
                </div>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="px-6 py-4 bg-gray-50 border-t rounded-b-lg flex justify-end gap-3">
            <button
              onClick={fetchPreferences}
              disabled={saving}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h4 className="font-semibold text-amber-900">💡 Tip</h4>
          <p className="text-sm text-amber-800 mt-2">
            Even if you disable in-app notifications, you can still view your notification history at any time from your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
