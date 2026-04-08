// frontend/src/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Menu, User, Settings, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminSideBar from '../components/admin/AdminSideBar';
import NotificationPanel from '../components/admin/NotificationPanel';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  const handleProfile = () => {
    navigate('/profile');
    setShowUserMenu(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Component */}
      <AdminSideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-4 relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* User Menu Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#F47C20] flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">Admin User</span>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-medium text-gray-900">Admin User</p>
                      <p className="text-xs text-gray-500">admin@campusflow.com</p>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={handleProfile}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-gray-500" />
                        My Profile
                      </button>
                      <button
                        onClick={() => {
                          toast.info('Settings coming soon');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-gray-500" />
                        Settings
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Notification Panel */}
              <NotificationPanel 
                isOpen={showNotifications} 
                onClose={() => setShowNotifications(false)} 
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;