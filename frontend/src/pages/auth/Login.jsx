import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import sliitBackground from '../../assets/sliit-image2.jpg';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { login, googleLogin } = useAuth();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            setTimeout(() => {
                navigate(result.redirect);
            }, 1000);
        } else {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const result = await googleLogin(credentialResponse.credential);

        if (result.success) {
            setTimeout(() => {
                navigate(result.redirect);
            }, 1000);
        }
    };

    const handleGoogleError = () => {
        console.error('Google Sign-In failed');
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
                                <h2 className="text-xl font-bold text-white">Welcome Back</h2>
                                <p className="text-white/90 text-sm mt-1">Sign in to your CampusFlow account</p>
                            </div>

                            <form onSubmit={handleSubmit} className="px-6 py-6">
                                <div className="mb-5">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Email Address
                                    </label>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-orange-100 transition-all text-sm"
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-6">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="rememberMe"
                                            checked={formData.rememberMe}
                                            onChange={handleChange}
                                            className="w-3.5 h-3.5 text-primary border-gray-300 rounded focus:ring-primary"
                                        />
                                        <span className="ml-2 text-xs text-gray-600">Remember me</span>
                                    </label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-xs text-primary hover:text-primary-dark transition-colors"
                                    >
                                        Forgot Password?
                                    </Link>
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
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            Sign In
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="px-3 bg-white text-gray-500">Or continue with</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex justify-center">
                                        <GoogleLogin
                                            onSuccess={handleGoogleSuccess}
                                            onError={handleGoogleError}
                                            useOneTap={false}
                                        />
                                    </div>
                                </div>

                                <div className="mt-5 text-center">
                                    <p className="text-xs text-gray-600">
                                        Don't have an account?{' '}
                                        <Link to="/register" className="text-primary font-semibold hover:text-primary-dark transition-colors">
                                            Sign up
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </motion.div>

                        <p className="text-center text-gray-600 text-xs mt-5">
                            By signing in, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;