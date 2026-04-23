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
      <div className="absolute inset-0 z-0">
        <img
          src={sliitImage4}
          alt="Campus Background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A2342]/90 via-[#0A2342]/80 to-[#0A2342]/15 z-10"></div>
        
        <svg className="w-full h-12 md:h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path fill="#0A2342" fillOpacity="1" d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      <div className="container-custom relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="backdrop-blur-sm bg-[#0A2342]/40 rounded-2xl p-8 border border-[#F47C20]/20">
            <span className="inline-block px-4 py-1.5 bg-[#F47C20]/20 text-[#F47C20] rounded-full text-sm font-bold tracking-wider uppercase mb-6 backdrop-blur-sm">
              About Us
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Transforming Campus<br />
              Operations <span className="text-[#F47C20]">Since 2024</span>
            </h2>
            <p className="text-gray-200 mb-8 leading-relaxed text-lg font-light">
              CampusFlow is a comprehensive platform designed specifically for modern universities
              to manage facility bookings and maintenance operations efficiently. Our mission is to
              eliminate manual processes, reduce conflicts, and provide real-time visibility into
              campus resource utilization.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {values.map((value, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-2xl bg-[#0A2342]/50 backdrop-blur-sm hover:bg-[#F47C20]/10 transition-all duration-300 border border-[#F47C20]/10 hover:border-[#F47C20]/30 group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-[#F47C20]/20 flex items-center justify-center group-hover:bg-[#F47C20] transition-all duration-300">
                      <value.icon className="w-6 h-6 text-[#F47C20] group-hover:text-[#0A2342] transition-colors" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1 group-hover:text-[#F47C20] transition-colors">{value.title}</h4>
                    <p className="text-sm text-gray-300 font-medium">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/about" className="inline-flex items-center gap-2 bg-[#F47C20] text-[#0A2342] px-8 py-3 rounded-full font-bold hover:bg-[#E06A10] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
                Learn More
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Aboutus;