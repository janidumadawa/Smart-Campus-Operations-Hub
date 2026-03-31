// frontend/src/components/shared/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#06152B] text-white pt-20">
      <div className="container-custom pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src="/weblogo2.png" alt="SLIIT Campus" className="h-12 w-auto" />
            </div>
            <p className="text-gray-400 mb-8 leading-relaxed font-medium">
              A modern platform designed to streamline SLIIT campus operations, including facility booking, maintenance management, and workflow automation.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[#0F3057] flex items-center justify-center hover:bg-[#F47C20] hover:text-[#0A2342] transition-all duration-300">
                <FaFacebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#0F3057] flex items-center justify-center hover:bg-[#F47C20] hover:text-[#0A2342] transition-all duration-300">
                <FaTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#0F3057] flex items-center justify-center hover:bg-[#F47C20] hover:text-[#0A2342] transition-all duration-300">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#0F3057] flex items-center justify-center hover:bg-[#F47C20] hover:text-[#0A2342] transition-all duration-300">
                <FaLinkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-xl mb-6 text-white">Quick Links</h4>
            <ul className="space-y-4 font-medium">
              <li><Link to="/" className="text-gray-400 hover:text-[#F47C20] flex items-center gap-2"><span className="text-[#F47C20]">›</span> Home</Link></li>
              <li><Link to="/facilities" className="text-gray-400 hover:text-[#F47C20] flex items-center gap-2"><span className="text-[#F47C20]">›</span> Facilities</Link></li>
              <li><Link to="/maintenance" className="text-gray-400 hover:text-[#F47C20] flex items-center gap-2"><span className="text-[#F47C20]">›</span> Maintenance</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-[#F47C20] flex items-center gap-2"><span className="text-[#F47C20]">›</span> About SLIIT</Link></li>
            </ul>
          </div>

          {/* Campuses */}
          <div>
            <h4 className="font-bold text-xl mb-6 text-white">Our Centers</h4>
            <ul className="space-y-4 font-medium">
              <li className="text-gray-400">Malabe Campus</li>
              <li className="text-gray-400">Metro Campus (Colombo)</li>
              <li className="text-gray-400">SLIIT Kandy UNI</li>
              <li className="text-gray-400">Kurunegala Center</li>
              <li className="text-gray-400">Jaffna Center</li>
              <li className="text-gray-400">Matara Center</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-xl mb-6 text-white">Contact Info</h4>
            <ul className="space-y-5">
              <li className="flex gap-4 text-gray-400 items-start">
                <MapPin className="w-6 h-6 text-[#F47C20] flex-shrink-0" />
                <span className="font-medium">
                  SLIIT Malabe Campus, New Kandy Road, Malabe, Sri Lanka
                </span>
              </li>
              <li className="flex gap-4 text-gray-400 items-center">
                <Phone className="w-6 h-6 text-[#F47C20] flex-shrink-0" />
                <span className="font-medium">+94 11 754 4801</span>
              </li>
              <li className="flex gap-4 text-gray-400 items-center">
                <Mail className="w-6 h-6 text-[#F47C20] flex-shrink-0" />
                <span className="font-medium">info@sliit.lk</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-white/10 bg-[#0a0a0a] py-6 text-center">
        <p className="text-gray-500 font-medium text-sm">
          &copy; {currentYear} SLIIT Campus Operations Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;