// frontend/src/components/home/Hero.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import sliitImage1 from '../../assets/sliit-image1.jpg';
import sliitImage2 from '../../assets/sliit-image2.jpg';
import sliitImage3 from '../../assets/sliit-image3.png';

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: "Smart Campus",
            subtitle: "Operations",
            description: "Streamline your university's daily operations with our all-in-one platform for facility bookings and maintenance management.",
            image: sliitImage1,
            cta: "Get Started"
        },
        {
            title: "Book Resources",
            subtitle: "Instantly",
            description: "Reserve halls, equipment, and facilities with just a few clicks. Real-time availability and instant confirmations.",
            image: sliitImage2,
            cta: "Explore Facilities"
        },
        {
            title: "Report Issues",
            subtitle: "Easily",
            description: "Submit maintenance tickets, track progress, and get real-time updates on your reported issues.",
            image: sliitImage3,
            cta: "Report Now"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-screen overflow-hidden">
            {/* Background Images */}
            <AnimatePresence>
                {slides.map((slide, index) => (
                    index === currentSlide && (
                        <div
                            key={index}
                            className="absolute inset-0 transition-opacity duration-1000"
                        >
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0A2342]/90 to-[#0A2342]/50" />
                        </div>
                    )
                ))}
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
                <div className="container-custom">
                    <div className="max-w-3xl">
                        <AnimatePresence>
                            <div key={currentSlide}>
                                <span className="inline-block px-4 py-1.5 bg-[#F47C20]/20 text-[#F47C20] rounded-full text-sm font-bold tracking-wider uppercase mb-6 backdrop-blur-sm">
                                    {slides[currentSlide].subtitle}
                                </span>
                                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                                    {slides[currentSlide].title}
                                </h1>
                                <p className="text-gray-200 text-xl mb-8 leading-relaxed font-light">
                                    {slides[currentSlide].description}
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Link
                                        to={currentSlide === 0 ? "/register" : currentSlide === 1 ? "/facilities" : "/tickets"}
                                        className="inline-flex items-center gap-2 bg-[#F47C20] text-[#0A2342] px-8 py-3 rounded-full font-bold hover:bg-[#E06A10] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
                                    >
                                        {slides[currentSlide].cta}
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-0 right-0 z-10">
                <div className="flex justify-center gap-3">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === currentSlide
                                    ? 'bg-[#F47C20] w-8'
                                    : 'bg-white/50 hover:bg-white/80'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Hero;