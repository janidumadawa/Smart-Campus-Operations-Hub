import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { Save, AlertCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function NotificationPreferencesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    bookingAlerts: true,
    ticketUpdates: true,
    emailNotifications: true,
    commentNotifications: true
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const userId = user?.id || user?.email || localStorage.getItem('userId');

  // Fetch preferences
  const fetchPreferences = async () => {
    // Only fetch if we have a valid identifier
    if (!userId || userId === 'null' || userId === 'undefined') {
      return;
    }

    setLoading(true);
    try {
      // Correct endpoint: /api/notifications/preferences/{userId}
      const response = await axiosInstance.get(`/notifications/preferences/${userId}`);
      if (response.data.success) {
        setPreferences(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      const status = error.response?.status;
      const msg = error.response?.data?.error || error.message;
      toast.error(`Load failed (${status}): ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  // Update preferences
  const handleSave = async () => {
    if (!userId) {
      toast.error('User session expired. Please login again.');
      return;
    }

    setSaving(true);
    try {
      const response = await axiosInstance.post(`/notifications/preferences/${userId}`, preferences);
      if (response.data.success) {
        setPreferences(response.data.data);
        toast.success('Preferences saved successfully');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      const detail = error.response?.data?.error || error.response?.data?.message || error.message;
      toast.error(`Update failed: ${detail}`);
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
    if (userId) {
      fetchPreferences();
    }
  }, [userId]);

  if (loading && !preferences) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Notification Preferences</h1>
          <p className="text-gray-600 mt-2">Customize how you receive notifications</p>
        </div>

        {/* Info Banner */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            Customize which alerts you want to receive. <strong>System maintenance</strong> and <strong>Security alerts</strong> will always be sent for your safety.
          </p>
        </div>

        {/* Preferences Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 space-y-8">
            {/* Booking Alerts */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">📅 Booking Notifications</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Alerts about your resource booking status (Approve/Reject)
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.bookingAlerts}
                  onChange={() => handleToggle('bookingAlerts')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Ticket Updates */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">🔧 Ticket Updates</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Updates on maintenance tickets and technical issues
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.ticketUpdates}
                  onChange={() => handleToggle('ticketUpdates')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Email Notifications */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">📧 Email Notifications</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Receive a summary of important alerts via email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="bg-gray-50 px-8 py-5 flex justify-end gap-3">
             <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition shadow-lg shadow-blue-200 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
