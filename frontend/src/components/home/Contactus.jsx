// frontend/src/components/home/Contactus.jsx
import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send
} from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Contactus = () => {

  const contactInfo = [
    { 
      icon: MapPin, 
      title: "Visit Us", 
      details: [
        "SLIIT Malabe Campus",
        "New Kandy Road, Malabe, Sri Lanka"
      ] 
    },
    { 
      icon: Phone, 
      title: "Call Us", 
      details: [
        "+94 11 754 4801",
        "+94 11 241 3901"
      ] 
    },
    { 
      icon: Mail, 
      title: "Email Us", 
      details: [
        "info@sliit.lk",
        "admissions@sliit.lk"
      ] 
    },
    { 
      icon: Clock, 
      title: "Working Hours", 
      details: [
        "Mon-Fri: 8:30 AM - 5:00 PM",
        "Sat: 9:00 AM - 1:00 PM"
      ] 
    }
  ];

  const socialIcons = [
    { icon: FaFacebook, href: "#", name: "Facebook" },
    { icon: FaTwitter, href: "#", name: "Twitter" },
    { icon: FaInstagram, href: "#", name: "Instagram" },
    { icon: FaLinkedin, href: "#", name: "LinkedIn" }
  ];

  return (
    <section className="py-24 bg-[#F47C20] relative">
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-black/10 text-[#0A2342] rounded-full text-sm font-bold tracking-wider uppercase mb-4">Get In Touch</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A2342] mb-6">
            Connect with<br />
            <span className="underline decoration-white decoration-4 underline-offset-8">SLIIT Campus</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-[40px] shadow-2xl overflow-hidden shadow-black/20">

          {/* Contact Information */}
          <div className="p-10 lg:p-16 bg-[#0A2342] text-white">
            <h3 className="text-3xl font-black text-[#F47C20] mb-10">Contact Information</h3>
            <div className="space-y-8">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="w-14 h-14 rounded-full bg-[#0F3057] flex items-center justify-center shrink-0 border border-[#163a69]">
                    <info.icon className="w-6 h-6 text-[#F47C20]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2 text-lg">{info.title}</h4>
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-gray-400 font-medium">{detail}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 pt-10 border-t border-[#163a69]">
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-sm">Follow Us</h4>
              <div className="flex gap-4">
                {socialIcons.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-12 h-12 rounded-full bg-[#0F3057] flex items-center justify-center hover:bg-[#F47C20] hover:text-[#0A2342] transition-all duration-300 border border-[#163a69]"
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-10 lg:p-16 bg-white flex flex-col justify-center">
            <h3 className="text-3xl font-black text-[#0A2342] mb-8">Send a Message</h3>

            <form className="space-y-6">
              <div>
                <input
                  placeholder="Your Name"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F47C20] focus:ring-4 focus:ring-[#F47C20]/20 transition-all font-medium text-gray-900"
                />
              </div>

              <div>
                <input
                  placeholder="Your Email"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F47C20] focus:ring-4 focus:ring-[#F47C20]/20 transition-all font-medium text-gray-900"
                />
              </div>

              <div>
                <input
                  placeholder="Subject"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F47C20] focus:ring-4 focus:ring-[#F47C20]/20 transition-all font-medium text-gray-900"
                />
              </div>

              <div>
                <textarea
                  placeholder="Your Message..."
                  rows="4"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F47C20] focus:ring-4 focus:ring-[#F47C20]/20 transition-all font-medium text-gray-900 resize-none"
                />
              </div>

              <button
                type="button"
                className="w-full bg-[#0A2342] text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-black transition-all duration-300 flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-xl"
              >
                Send Message <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contactus;