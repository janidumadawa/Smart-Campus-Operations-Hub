// frontend/src/components/home/Hero.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: "Smart Campus",
            subtitle: "Operations",
            description: "Streamline your university's daily operations with our all-in-one platform for facility bookings and maintenance management.",
            image: "/src/assets/sliit-image1.jpg",
            cta: "Get Started"
        },
        {
            title: "Book Resources",
            subtitle: "Instantly",
            description: "Request and manage bookings for lecture halls, labs, meeting rooms, and equipment with real-time availability.",
            image: "/src/assets/sliit-image2.jpg",
            cta: "Explore Facilities"
        },
        {
            title: "Efficient Incident",
            subtitle: "Management",
            description: "Submit maintenance requests, track technician updates, and resolve issues faster with our ticketing system.",
            image: "/src/assets/sliit-image3.png",
            cta: "Report Issue"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);


    return (
        <div className="relative h-screen overflow-hidden bg-[#0A2342]">
            <AnimatePresence mode="wait">
                {slides.map((slide, index) => (
                    index === currentSlide && (
                        <div
                            key={index}
                            className="absolute inset-0"
                            style={{
                                backgroundImage: `linear-gradient(135deg, rgba(17, 17, 17, 0.95), rgba(0, 0, 0, 0.55)), url(${slide.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }}
                        >
                            <div className="relative h-full flex items-center justify-center">
                                <div className="text-center text-white max-w-5xl px-4 z-10">
                                    <h1
                                        className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight"
                                    >
                                        {slide.title}
                                        <span className="block text-[#F47C20] mt-2">{slide.subtitle}</span>
                                    </h1>

                                    <p
                                        className="text-lg md:text-2xl mb-10 text-gray-300 max-w-3xl mx-auto font-light"
                                    >
                                        {slide.description}
                                    </p>

                                    <div
                                        className="flex flex-col sm:flex-row gap-5 justify-center"
                                    >
                                        <Link
                                            to="/auth"
                                            className="inline-flex items-center justify-center gap-3 bg-[#F47C20] text-[#0A2342] px-10 py-4 rounded-full font-bold text-lg hover:bg-[#E06A10] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,204,0,0.3)] group"
                                        >
                                            {slide.cta}
                                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>

                                    <div
                                        className="flex justify-center gap-12 mt-16"
                                    >
                                        {[
                                            { value: "500+", label: "Resources" },
                                            { value: "10K+", label: "Bookings" },
                                            { value: "98%", label: "Satisfaction" }
                                        ].map((stat, i) => (
                                            <div key={i} className="text-center group">
                                                <div className="text-4xl md:text-5xl font-black text-[#F47C20] mb-2">{stat.value}</div>
                                                <div className="text-sm md:text-base text-gray-400 uppercase tracking-widest font-semibold">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                ))}
            </AnimatePresence>

            {/* Slide Indicators */}
            <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`transition-all duration-300 ${index === currentSlide
                            ? 'w-10 h-2 bg-[#F47C20] rounded-full'
                            : 'w-2 h-2 bg-white/30 rounded-full hover:bg-white/60'
                            }`}
                    />
                ))}
            </div>

            {/* Fixed Wave Effect */}
            <div className="absolute bottom-0 left-0 w-full z-10">
                {/* Orange wave layer */}
                <svg
                    className="w-full h-16 md:h-20 rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28c70.36-5.37,136.33-33.31,206.8-37.5c70.44-4.19,140.89,0,211.27,6.44c70.27,6.44,140.54,16.31,210.81,22.39c70.27,6.08,140.54,9.44,210.81,7.27c70.27-2.17,140.54-10.86,210.81-24.44V0Z"
                        fill="#F47C20"
                    />
                </svg>
                {/* White wave layer on top */}
                <svg
                    className="w-full h-12 md:h-16 absolute bottom-0 left-0 rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28c70.36-5.37,136.33-33.31,206.8-37.5c70.44-4.19,140.89,0,211.27,6.44c70.27,6.44,140.54,16.31,210.81,22.39c70.27,6.08,140.54,9.44,210.81,7.27c70.27-2.17,140.54-10.86,210.81-24.44V0Z"
                        fill="white"
                    />
                </svg>
            </div>
        </div>
    );
};

export default Hero;