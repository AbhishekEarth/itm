import React from 'react';
import { Link } from "react-router-dom";
// Import the specific icons from react-icons
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import logo from "../assets/logo.png"; 

export default function Footer() {
  const footerSections = [
    {
      title: "About University",
      links: ["About ITM", "Leadership", "Governance", "Awards & Ranking", "Infrastructure", "NIRF"]
    },
    {
      title: "Programmes",
      links: ["Graduate", "Postgraduate", "Department of Engineering", "Department of Management"]
    },
    {
      title: "Student Resources",
      links: ["Notices", "Academic Calendar", "MIS Login", "LMS Login", "Anti Ragging"]
    }
  ];

  // Social Media Data Object
  const socialLinks = [
    { icon: <FaFacebookF />, url: "https://www.facebook.com/itmgoigwl/", label: "Facebook" },
    { icon: <FaTwitter />, url: "https://x.com/itm_gwalior", label: "Twitter" },
    { icon: <FaLinkedinIn />, url: "https://in.linkedin.com/school/itm-gwalior-cp/", label: "LinkedIn" },
    { icon: <FaInstagram />, url: "https://www.instagram.com/itm_gwalior/", label: "Instagram" }
  ];

  return (
    <footer className="bg-[#0a0a0a] text-white pt-24 pb-10 px-8 border-t border-white/5 relative overflow-hidden">
      {/* Subtle Maroon Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#800000]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* 1. BRAND & DESCRIPTION */}
          <div className="space-y-8">
            <img src={logo} alt="ITM Logo" className="h-20 w-auto brightness-200" />
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm font-medium">
              ITM Gwalior is the premier destination for industry-led education 
              in Madhya Pradesh, committed to nurturing innovators and global leaders.
            </p>
            
            {/* SOCIAL MEDIA LOGOS */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.label} 
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#800000] hover:scale-110 transition-all duration-300 cursor-pointer border border-white/10 text-lg text-gray-300 hover:text-white"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* 2. DYNAMIC LINKS SECTIONS */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-red-500 font-black uppercase tracking-[0.25em] text-[10px] mb-8">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-all text-sm font-bold flex items-center group">
                      <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 text-red-500 font-black">→</span>
                      <span className="group-hover:translate-x-1 transition-transform">{link}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 3. BOTTOM CONTACT STRIP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-10 border-t border-white/5 text-sm">
          <div className="group cursor-default">
            <p className="text-red-500 font-black uppercase text-[10px] tracking-widest mb-2 opacity-70 group-hover:opacity-100 transition-opacity">General Helpline</p>
            <p className="font-black text-2xl tracking-tighter group-hover:text-red-400 transition-colors">+91-7987004308</p>
          </div>
          <div className="group cursor-default">
            <p className="text-red-500 font-black uppercase text-[10px] tracking-widest mb-2 opacity-70 group-hover:opacity-100 transition-opacity">Official Email</p>
            <p className="font-black text-lg tracking-tight group-hover:text-red-400 transition-colors">info@itmgoi.ac.in</p>
          </div>
          <div className="group cursor-default">
            <p className="text-red-500 font-black uppercase text-[10px] tracking-widest mb-2 opacity-70 group-hover:opacity-100 transition-opacity">Location</p>
            <p className="text-gray-400 font-medium group-hover:text-gray-200 transition-colors">Sitholi, Gwalior</p>
          </div>
        </div>

        {/* 4. FINAL DISCLAIMER */}
        <div className="mt-12 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-gray-500 text-[9px] max-w-2xl leading-relaxed uppercase tracking-widest font-bold">
            Disclaimer: ITM Gwalior is an independent institution with no affiliation to any other university of a similar name in India. All rights reserved © 2026.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            <a href="#" className="hover:text-red-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-red-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-red-500 transition-colors">Sitemap</a>
          </div>
        </div>
        
      </div>
    </footer>
  );
}