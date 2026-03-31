// frontend/src/components/home/Features.jsx
import React from 'react';
import { Building2, Calendar, Wrench, Bell, Users, BarChart3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      icon: Building2,
      title: "Facility Management",
      description: "Manage lecture halls, labs, meeting rooms, and equipment with real-time availability tracking.",
      link: "/facilities"
    },
    {
      icon: Calendar,
      title: "Smart Booking System",
      description: "Request bookings with automatic conflict checking and approval workflow.",
      link: "/bookings"
    },
    {
      icon: Wrench,
      title: "Incident Ticketing",
      description: "Report maintenance issues with image attachments and track resolution progress.",
      link: "/tickets"
    },
    {
      icon: Bell,
      title: "Real-time Notifications",
      description: "Stay updated with instant notifications for approvals, status changes, and comments.",
      link: "/notifications"
    },
    {
      icon: Users,
      title: "Role-based Access",
      description: "Secure access control for students, staff, technicians, and administrators.",
      link: "/roles"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Gain insights with usage analytics, peak hours, and resource utilization reports.",
      link: "/analytics"
    }
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="section-badge">Why should you choose us?</span>
          <h2 className="section-title text-[#0A2342] mb-6">
            Powerful Features for
            <span className="title-gradient"> Modern Campus</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium">
            Everything you need to streamline university operations in one comprehensive single platform.
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#0A2342] rounded-3xl p-8 shadow-xl hover:shadow-[0_15px_30px_rgba(255,204,0,0.15)] transition-all duration-300 group cursor-pointer border border-[#0F3057] hover:border-[#F47C20]/50 relative overflow-hidden"
              onClick={() => handleLearnMore(feature)}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F47C20]/5 rounded-bl-[100px] transition-all duration-500 group-hover:bg-[#F47C20]/10" />

              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-[#0F3057] group-hover:bg-[#F47C20] transition-colors duration-300"
              >
                <feature.icon className="w-8 h-8 text-[#F47C20] group-hover:text-[#0A2342] transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 tracking-wide group-hover:text-[#F47C20] transition-colors">{feature.title}</h3>
              <p className="text-gray-400 mb-6 leading-relaxed font-light">{feature.description}</p>
              <Link
                to={feature.link}
                className="inline-flex items-center gap-2 text-[#F47C20] font-bold group-hover:gap-3 transition-all"
              >
                Learn More
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;