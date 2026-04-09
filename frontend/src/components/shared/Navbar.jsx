import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ activeSection }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const { user, logout, isAdmin, isTechnician, getUserInitial } = useAuth();

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Facilities', path: '/facilities' },
        { name: 'My Bookings', path: '/bookings/my-bookings' },
        { name: 'Tickets', path: '/tickets' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsOpen(false);
    };

    const handleProfile = () => {
        navigate('/profile');
        setIsOpen(false);
    };

    return (
        <>
            <div className="h-24"></div>

            <nav className={`fixed top-6 left-0 right-0 z-50 transition-all duration-500 px-4 md:px-8`}>
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className={`
                            rounded-2xl backdrop-blur-md transition-all duration-300
                            ${scrolled
                                ? 'bg-gradient-to-r from-[#0A2342]/90 to-[#0A2342]/80 shadow-xl shadow-white/20 border border-[#F47C20]/30'
                                : 'bg-gradient-to-r from-[#0A2342]/80 to-[#0A2342]/70 shadow-lg shadow-white/10 border border-[#F47C20]/20'
                            }
                        `}
                        animate={{
                            opacity: scrolled ? 0 : 1,
                            visibility: scrolled ? "hidden" : "visible"
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="container-custom">
                            <div className="flex items-center justify-between h-16 md:h-20">
                                <div className="flex justify-start">
                                    <Link to="/" className="flex items-center gap-2 group">
                                        <img
                                            src="/weblogo2.png"
                                            alt="CampusFlow"
                                            className="h-12 w-auto object-contain transition-all duration-300 group-hover:scale-105"
                                        />
                                    </Link>
                                </div>

                                <div className="hidden md:flex justify-center gap-8 flex-1">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            className={`relative transition-all duration-300 font-medium text-white hover:text-[#F47C20]`}
                                        >
                                            {item.name}
                                            {activeSection === item.name.toLowerCase() && (
                                                <motion.div
                                                    layoutId="activeSection"
                                                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#F47C20] rounded-full"
                                                    transition={{ duration: 0.3 }}
                                                />
                                            )}
                                        </Link>
                                    ))}
                                </div>

                                <div className="flex justify-end items-center gap-3">
                                    <div className="hidden md:flex gap-3">
                                        {!user ? (
                                            <>
                                                <Link to="/login" className="px-5 py-2 rounded-full font-semibold transition-all duration-300 border-2 border-[#F47C20] text-[#F47C20] hover:bg-[#F47C20] hover:text-white">
                                                    Login
                                                </Link>
                                                <Link to="/register" className="px-5 py-2 rounded-full font-semibold transition-all duration-300 bg-[#F47C20] text-white hover:bg-[#E06A10] hover:shadow-lg">
                                                    Sign Up
                                                </Link>
                                            </>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                {(isAdmin() || isTechnician()) && (
                                                    <Link 
                                                        to="/admin" 
                                                        className="px-4 py-2 rounded-full font-semibold transition-all duration-300 bg-[#F47C20] text-white hover:bg-[#E06A10]"
                                                    >
                                                        Dashboard
                                                    </Link>
                                                )}
                                                <div className="relative group">
                                                    <button className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/10 transition-all">
                                                        <div className="w-8 h-8 rounded-full bg-[#F47C20] flex items-center justify-center text-white font-bold">
                                                            {getUserInitial()}
                                                        </div>
                                                        <span className="text-white text-sm font-medium">
                                                            {user?.name?.split(' ')[0]}
                                                        </span>
                                                    </button>
                                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                                        </div>
                                                        <div className="py-2">
                                                            <button
                                                                onClick={handleProfile}
                                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                            >
                                                                <User className="w-4 h-4" />
                                                                Profile
                                                            </button>
                                                            <button
                                                                onClick={handleLogout}
                                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                            >
                                                                <LogOut className="w-4 h-4" />
                                                                Logout
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setIsOpen(!isOpen)}
                                        className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                                    >
                                        {isOpen ?
                                            <X className="w-6 h-6 text-white" /> :
                                            <Menu className="w-6 h-6 text-white" />
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="md:hidden mt-3 rounded-2xl bg-white/95 backdrop-blur-lg shadow-xl border border-gray-100 overflow-hidden"
                            >
                                <div className="container-custom py-4">
                                    <div className="flex flex-col gap-2">
                                        {navItems.map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.path}
                                                onClick={() => setIsOpen(false)}
                                                className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300 font-medium"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                        <div className="border-t border-gray-100 my-2"></div>
                                        {!user ? (
                                            <>
                                                <Link
                                                    to="/login"
                                                    onClick={() => setIsOpen(false)}
                                                    className="px-4 py-3 text-center text-[#F47C20] border-2 border-[#F47C20] rounded-xl font-semibold hover:bg-[#F47C20] hover:text-white transition-all duration-300"
                                                >
                                                    Login
                                                </Link>
                                                <Link
                                                    to="/register"
                                                    onClick={() => setIsOpen(false)}
                                                    className="px-4 py-3 text-center bg-[#F47C20] text-white rounded-xl font-semibold hover:bg-[#E06A10] transition-all duration-300"
                                                >
                                                    Sign Up
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                {(isAdmin() || isTechnician()) && (
                                                    <Link
                                                        to="/admin"
                                                        onClick={() => setIsOpen(false)}
                                                        className="px-4 py-3 text-center bg-[#F47C20] text-white rounded-xl font-semibold hover:bg-[#E06A10]"
                                                    >
                                                        Dashboard
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={handleProfile}
                                                    className="px-4 py-3 text-center text-gray-700 hover:bg-gray-50 rounded-xl font-medium"
                                                >
                                                    Profile
                                                </button>
                                                <button
                                                    onClick={handleLogout}
                                                    className="px-4 py-3 text-center bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-all duration-300"
                                                >
                                                    Logout
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>
        </>
    );
};

export default Navbar;