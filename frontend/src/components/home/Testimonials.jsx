// frontend/src/components/home/Testimonials.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Dean of Faculty",
      department: "Engineering",
      rating: 5,
      text: "CampusFlow has revolutionized how we manage our facilities. The booking system is intuitive, and the maintenance tracking has reduced our response time by 60%."
    },
    {
      name: "Prof. Michael Chen",
      role: "Department Head",
      department: "Computer Science",
      rating: 5,
      text: "The platform's ability to prevent scheduling conflicts has saved us countless hours of manual coordination. Highly recommended for any university."
    },
    {
      name: "Emma Thompson",
      role: "Student Council President",
      department: "Business School",
      rating: 4,
      text: "As a student, I love how easy it is to book study rooms and report issues. The notification system keeps me updated on everything."
    }
  ];

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      <div className="absolute bottom-150 left-0 w-full overflow-hidden leading-none z-10">
        <svg
          className="w-full h-12 md:h-16 rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-[#000000]"
          ></path>
        </svg>
      </div>
      <div className="container-custom mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        <div className="text-left mb-12 lg:mb-0">
          <span className="section-badge">See what they say</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A2342] mb-6 leading-tight">
            See what said our<br />
            happy <span className="text-[#F47C20] underline decoration-[#0A2342] decoration-4 underline-offset-8">customers</span>
          </h2>
          <p className="text-gray-600 max-w-md text-lg font-medium">
            Join thousands of satisfied users who have transformed their campus operations.
          </p>
        </div>

        <div className="bg-[#0A2342] rounded-[40px] p-8 md:p-12 shadow-2xl relative">
          <Quote className="absolute top-8 right-8 w-16 h-16 text-[#F47C20] opacity-20" />
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div
                  className="h-full"
                >
                  <p className="text-white text-xl md:text-2xl font-light leading-relaxed mb-8 italic">"{testimonial.text}"</p>

                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#F47C20] flex items-center justify-center text-[#0A2342] font-black text-xl">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-[#F47C20] font-medium">{testimonial.role}, {testimonial.department}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #F47C20 !important;
          transform: scale(0.6);
          background: rgba(255,255,255,0.1);
          padding: 30px;
          border-radius: 50%;
        }
        .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.3;
        }
        .swiper-pagination-bullet-active {
          background: #F47C20 !important;
          opacity: 1;
        }
        @media (max-width: 768px) {
          .swiper-button-next,
          .swiper-button-prev {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;