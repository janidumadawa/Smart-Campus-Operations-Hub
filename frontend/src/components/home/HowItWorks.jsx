// frontend/src/components/home/HowItWorks.jsx
import React from 'react';
import { LogIn, Search, CalendarCheck, CheckCircle, Building, AlertTriangle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Sign In",
      description: "Login with your university credentials using secure auth.",
      icon: LogIn,
    },
    {
      number: "02",
      title: "Browse Resources",
      description: "Search available facilities, labs, and equipment.",
      icon: Search,
    },
    {
      number: "03",
      title: "Make Booking",
      description: "Select date, time, and purpose. Verify conflicts.",
      icon: CalendarCheck,
    },
    {
      number: "04",
      title: "Admin Approval",
      description: "Admin reviews and approves. You get notified.",
      icon: CheckCircle,
    },
    {
      number: "05",
      title: "Use Facility",
      description: "Check-in using QR code for approved bookings.",
      icon: Building,
    },
    {
      number: "06",
      title: "Report Issues",
      description: "Create incident tickets with photos.",
      icon: AlertTriangle,
    }
  ];

  return (
    <section className="relative bg-[#F47C20] py-24 overflow-hidden">
      {/* Wave Overlay Top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10">
        <svg
          className="w-full h-12 md:h-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-[#0A2342]"
          ></path>
        </svg>
      </div>

      <div className="container-custom mt-12 relative z-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-[#0A2342] mb-4">
            How <span className="underline decoration-white decoration-4 underline-offset-8 text-black">CampusFlow</span> Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group bg-white rounded-[40px] p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div
                className="absolute -top-6 left-8 w-14 h-14 rounded-full flex items-center justify-center bg-[#0A2342] text-[#F47C20] font-black text-xl border-4 border-[#F47C20]"
              >
                {step.number}
              </div>
              <div className="mt-6 mb-6">
                <step.icon className="w-12 h-12 text-[#0A2342]" />
              </div>
              <h3 className="text-2xl font-black text-[#0A2342] mb-3">{step.title}</h3>
              <p className="text-gray-600 font-medium">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;