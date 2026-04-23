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
