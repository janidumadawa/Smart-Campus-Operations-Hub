// frontend/src/pages/Profile/Profilepage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit2, Save, X, Camera, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Profilepage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Admin User',
    email: 'admin@campusflow.com',
    phone: '+1 (555) 123-4567',
    location: 'Campus Flow Headquarters',
    role: 'ADMIN',
    joined: 'January 15, 2024',
    avatar: 'A'
  });

  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    location: userData.location
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setUserData({
      ...userData,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      location: formData.location
    });
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleCancel = () => {
    setFormData({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      location: userData.location
    });
    setIsEditing(false);
  };

  const getRoleBadge = (role) => {
    const colors = {
      ADMIN: 'bg-purple-100 text-purple-800',
      USER: 'bg-blue-100 text-blue-800',
      TECHNICIAN: 'bg-green-100 text-green-800'
    };
    return <span className={`px-3 py-1 text-sm rounded-full ${colors[role]}`}>{role}</span>;
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Back Button */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleGoBack}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-[#F47C20] transition-colors" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#0A2342]">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account information</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-[#F47C20]/20 to-[#0A2342]/20"></div>
        
        {/* Profile Content */}
        <div className="px-6 md:px-8 pb-8">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-12 mb-8 gap-4">
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-[#F47C20] flex items-center justify-center text-white font-bold text-3xl border-4 border-white shadow-lg">
                  {userData.avatar}
                </div>
                <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="mb-2">
                <h2 className="text-xl font-bold text-[#0A2342]">{userData.name}</h2>
                <div className="mt-1">{getRoleBadge(userData.role)}</div>
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-[#F47C20] text-white rounded-lg hover:bg-[#E06A10] transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</label>
              {isEditing ? (
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-[#F47C20] transition-colors bg-white">
                  <User className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="flex-1 outline-none text-sm"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-700 p-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{userData.name}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</label>
              {isEditing ? (
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-[#F47C20] transition-colors bg-white">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="flex-1 outline-none text-sm"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-700 p-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{userData.email}</span>
                </div>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</label>
              {isEditing ? (
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-[#F47C20] transition-colors bg-white">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="flex-1 outline-none text-sm"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-700 p-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{userData.phone}</span>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Location</label>
              {isEditing ? (
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-[#F47C20] transition-colors bg-white">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="flex-1 outline-none text-sm"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-700 p-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{userData.location}</span>
                </div>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Role</label>
              <div className="flex items-center gap-2 p-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{userData.role}</span>
              </div>
            </div>

            {/* Member Since */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Member Since</label>
              <div className="flex items-center gap-2 p-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{userData.joined}</span>
              </div>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="mt-10 pt-8 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-[#0A2342] mb-6">Change Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <input
                  type="password"
                  placeholder="Current Password"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20] focus:ring-1 focus:ring-[#F47C20]/20 text-sm transition-colors"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20] focus:ring-1 focus:ring-[#F47C20]/20 text-sm transition-colors"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F47C20] focus:ring-1 focus:ring-[#F47C20]/20 text-sm transition-colors"
                />
              </div>
              <div>
                <button className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profilepage;