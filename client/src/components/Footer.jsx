import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Linkedin, Youtube, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 pt-20 pb-8 text-gray-300">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6 cursor-pointer">
              <div className="w-10 h-10 bg-primary-600 text-white rounded-lg flex items-center justify-center font-bold text-xl shadow-lg">
                ITM
              </div>
              <div className="font-bold text-2xl text-white tracking-tight">
                 GOI <span className="text-accent-500 text-sm align-top">&reg;</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Empowering minds and transforming futures through excellence in education, research, and innovation. Ranked among the best engineering institutes in Central India.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/ITMGOIGWALIOR/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:-translate-y-2 hover:scale-110 hover:shadow-[0_0_15px_rgba(37,99,235,0.6)] shadow-md"><Facebook className="w-5 h-5"/></a>
              <a href="https://www.instagram.com/itm_gwalior/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-300 transform hover:-translate-y-2 hover:scale-110 hover:shadow-[0_0_15px_rgba(219,39,119,0.6)] shadow-md"><Instagram className="w-5 h-5"/></a>
              <a href="https://www.linkedin.com/school/2284830/admin/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all duration-300 transform hover:-translate-y-2 hover:scale-110 hover:shadow-[0_0_15px_rgba(29,78,216,0.6)] shadow-md"><Linkedin className="w-5 h-5"/></a>
              <a href="https://twitter.com/itm_gwalior" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all duration-300 transform hover:-translate-y-2 hover:scale-110 hover:shadow-[0_0_15px_rgba(14,165,233,0.6)] shadow-md"><Twitter className="w-5 h-5"/></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:-translate-y-2 hover:scale-110 hover:shadow-[0_0_15px_rgba(220,38,38,0.6)] shadow-md"><Youtube className="w-5 h-5"/></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Explore</h4>
            <ul className="space-y-4">
              {['About Institute', 'Mission & Vision', 'Board of Governors', 'Programmes Offered', 'Infrastructure', 'Admissions'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-accent-500 transition-colors inline-block">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Important Links</h4>
            <ul className="space-y-4">
              {['Anti-Ragging', 'Online Grievance', 'NIRF', 'Online Payment', 'MIS Login', 'LMS Login'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-accent-500 transition-colors inline-block">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 text-gray-400">
                <MapPin className="w-6 h-6 text-accent-500 shrink-0 mt-1" />
                <span className="leading-relaxed">NH-44, Bypass Turari, Jhansi Road, Gwalior (M.P.) - 474001, India</span>
              </li>
              <li className="flex items-center gap-4 text-gray-400">
                <Phone className="w-5 h-5 text-accent-500 shrink-0" />
                <span>+91-6261230001 / +91-7773005063</span>
              </li>
              <li className="flex items-center gap-4 text-gray-400">
                <Mail className="w-5 h-5 text-accent-500 shrink-0" />
                <a href="mailto:info@itmgoi.in" className="hover:text-white transition-colors">info@itmgoi.in</a>
              </li>
            </ul>
          </div>
          
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ITM Group of Institutions, Gwalior. All Rights Reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
