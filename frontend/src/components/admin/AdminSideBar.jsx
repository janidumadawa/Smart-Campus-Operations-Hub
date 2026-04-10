// frontend/src/components/admin/AdminSideBar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Package, 
  Ticket, 
  Bell, 
  Users, 
  BarChart3,
  LogOut,
  ChevronRight,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const AdminSideBar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, isTechnician, logout } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { name: 'Bookings', path: '/admin/bookings', icon: Calendar },
      { name: 'Tickets', path: '/admin/tickets', icon: Ticket },
      { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    ];

    if (isAdmin()) {
      return [
        ...baseItems,
        { name: 'Resources', path: '/admin/resources', icon: Package, canEdit: true },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Advanced', path: '/admin/advanced', icon: BarChart3 },
      ];
    } else if (isTechnician()) {
      return [
        ...baseItems,
        { name: 'Resources', path: '/admin/resources', icon: Package, canEdit: false },
      ];
    }

    return baseItems;
  };

  const navItems = getMenuItems();

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 h-full bg-secondary border-r border-[#0F3057] z-50 w-72 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Close Button */}
          <div className="p-6 border-b border-[#0F3057] flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2" onClick={onClose}>
              <img src="/weblogo2.png" alt="CampusFlow" className="h-14 w-auto" />
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-[#0F3057] transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 overflow-y-auto">
            <div className="px-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== '/admin' && location.pathname.startsWith(item.path));
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-[#F47C20] text-white'
                        : 'text-gray-300 hover:bg-[#0F3057]'
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${
                        isActive
                          ? 'text-white'
                          : 'text-gray-400 group-hover:text-[#F47C20]'
                      }`}
                    />
                    <span className="font-medium flex-1">{item.name}</span>
                    
                    {/* Role-based badge for Resources */}
                    {item.canEdit !== undefined && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-[#0F3057] text-gray-300 group-hover:bg-[#1a3a5c]'
                      }`}>
                        {item.canEdit ? 'Edit' : 'View Only'}
                      </span>
                    )}
                    
                    {isActive && <ChevronRight className="w-4 h-4" />}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-[#0F3057]">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-[#0F3057] transition-all duration-200"
            >
              <LogOut className="w-5 h-5 text-gray-400" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default AdminSideBar;