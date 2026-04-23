import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, Zap, Eye, Target, ArrowRight } from 'lucide-react';
import sliitImage4 from '../../assets/sliit-image4.jpg';

const Aboutus = () => {
  const values = [
    { icon: Lightbulb, title: "Innovation", description: "Leveraging cutting-edge technology to solve real campus challenges" },
    { icon: Zap, title: "Efficiency", description: "Streamlining operations to save time and resources" },
    { icon: Eye, title: "Transparency", description: "Clear workflows and audit trails for accountability" },
    { icon: Target, title: "User-Centric", description: "Designed with feedback from students and staff" }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Image with Wave Effect */}
      <div className="absolute inset-0 z-0">
        <img
          src={sliitImage4}
          alt="Campus Background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A2342]/90 via-[#0A2342]/80 to-[#0A2342]/15 z-10"></div>
        
