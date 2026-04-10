import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import sliitBackground from '../../assets/sliit-image2.jpg';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password.length < 8) {
            toast.error('Password must be at least 8 characters long.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match. Please try again.');
            return;
        }

        if (!formData.agreeTerms) {
            toast.error('Please accept Terms and Privacy Policy to continue.');
            return;
        }

        setIsLoading(true);

        const result = await register(formData.fullName, formData.email, formData.password);
        
        if (result.success) {
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } else {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-100">
            <div className="absolute inset-0">
                <img
                    src={sliitBackground}
                    alt="SLIIT campus"
                    className="h-full w-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-linear-to-b from-white/80 via-white/65 to-orange-50/75"></div>
                <div className="absolute inset-x-0 bottom-0 h-52 bg-linear-to-t from-orange-100/75 to-transparent"></div>
                <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl"></div>
                <div className="absolute -bottom-20 -right-16 h-80 w-80 rounded-full bg-sky-200/30 blur-3xl"></div>
                <div className="absolute inset-0 opacity-[0.10] bg-[radial-gradient(#f47c20_1px,transparent_1px)] bg-size-[20px_20px]"></div>
            </div>

            <div className="relative z-10">
                <div className="h-16"></div>

                <div className="container-custom py-8">
                    <div className="max-w-md mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl shadow-primary/10 overflow-hidden border border-white/70"
                        >
                            <div className="bg-primary px-6 py-6 text-center">
                                <div className="mb-3 flex items-center justify-center">
                                    <div className="inline-flex items-center justify-center rounded-xl bg-slate-900/88 px-3 py-1.5 ring-1 ring-white/35 backdrop-blur-sm">
                                        <img
                                            src="/weblogo2.png"
                                            alt="CampusFlow logo"
                                            className="h-12 w-auto object-contain"
                                        />
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-white">Create Account</h2>
                                <p className="text-white/90 text-sm mt-1">Join CampusFlow and manage campus life smarter</p>
                            </div>

                            <form onSubmit={handleSubmit} className="px-6 py-6">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-orange-100 transition-all text-sm"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-orange-100 transition-all text-sm"
                                            placeholder="Enter your email address"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-orange-100 transition-all text-sm"
                                            placeholder="Create a password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                            aria-label="Toggle password visibility"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-orange-100 transition-all text-sm"
                                            placeholder="Re-enter your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                            aria-label="Toggle confirm password visibility"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <label className="flex items-start cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="agreeTerms"
                                            checked={formData.agreeTerms}
                                            onChange={handleChange}
                                            className="w-3.5 h-3.5 mt-0.5 text-primary border-gray-300 rounded focus:ring-primary"
                                        />
                                        <span className="ml-2 text-xs text-gray-600 leading-5">
                                            I agree to the{' '}
                                            <Link to="/terms" className="text-primary hover:text-primary-dark transition-colors">
                                                Terms of Service
                                            </Link>{' '}
                                            and{' '}
                                            <Link to="/privacy" className="text-primary hover:text-primary-dark transition-colors">
                                                Privacy Policy
                                            </Link>
                                            .
                                        </span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating account...
                                        </>
                                    ) : (
                                        <>
                                            Sign Up
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="px-3 bg-white text-gray-500">Or sign up with</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    <button
                                        type="button"
                                        className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Google (Coming Soon)
                                    </button>
                                </div>

                                <div className="mt-5 text-center">
                                    <p className="text-xs text-gray-600">
                                        Already have an account?{' '}
                                        <Link to="/login" className="text-primary font-semibold hover:text-primary-dark transition-colors">
                                            Sign in
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </motion.div>

                        <p className="text-center text-gray-600 text-xs mt-5">
                            CampusFlow keeps your campus access secure and streamlined.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
