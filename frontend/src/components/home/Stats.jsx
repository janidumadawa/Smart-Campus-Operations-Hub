// frontend/src/components/home/Stats.jsx
import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

const Stats = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [counts, setCounts] = useState({
    resources: 0,
    bookings: 0,
    tickets: 0,
    satisfaction: 0
  });

  const targets = {
    resources: 500,
    bookings: 10000,
    tickets: 2500,
    satisfaction: 98
  };

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const interval = 20;
      const steps = duration / interval;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setCounts({
            resources: Math.min(Math.floor((targets.resources * currentStep) / steps), targets.resources),
            bookings: Math.min(Math.floor((targets.bookings * currentStep) / steps), targets.bookings),
            tickets: Math.min(Math.floor((targets.tickets * currentStep) / steps), targets.tickets),
            satisfaction: Math.min(Math.floor((targets.satisfaction * currentStep) / steps), targets.satisfaction)
          });
        } else {
          clearInterval(timer);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isInView]);

  const stats = [
    { label: "Resources", value: counts.resources, suffix: "+", title: "Active" },
    { label: "Bookings", value: counts.bookings >= 1000 ? (counts.bookings / 1000).toFixed(0) : counts.bookings, suffix: "K+", title: "Processed" },
    { label: "Campuses", value: 3, suffix: "+", title: "Connected" },
    { label: "Satisfaction", value: counts.satisfaction, suffix: "%", title: "Rating" }
  ];

  return (
    <section ref={ref} className="relative py-24 bg-[#0A2342] overflow-hidden">

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <p className="text-gray-400 uppercase tracking-widest text-sm font-bold mb-4">Find your facilities across the campus</p>
          <h2 className="text-4xl md:text-5xl font-black text-white">
            Find the perfect <span className="text-[#F47C20]">resource</span><br />
            We manage operations, <span className="text-[#F47C20] underline decoration-4 underline-offset-8">you relax!</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-[#0F3057] rounded-3xl border border-gray-800 hover:border-[#F47C20] transition-colors duration-300"
            >
              <div className="text-5xl md:text-6xl font-black text-[#F47C20] mb-2 font-mono">
                {stat.value}{stat.suffix}
              </div>
              <div className="bg-white text-[#0A2342] rounded-full px-4 py-1.5 inline-block text-sm font-bold uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;