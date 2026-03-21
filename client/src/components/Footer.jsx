import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
const logo = "/placeholder.svg";

export default function Footer() {
  const footerSections = [
    {
      title: "Institute",
      links: ["About ITM", "Leadership", "Infrastructure", "NIRF"]
    },
    {
      title: "Programmes",
      links: ["Engineering", "Management", "Graduate", "Postgraduate"]
    }
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, url: "https://www.facebook.com/itmgoigwl/", label: "Facebook" },
    { icon: <FaTwitter />, url: "https://x.com/itm_gwalior", label: "Twitter" },
    { icon: <FaLinkedinIn />, url: "https://in.linkedin.com/school/itm-gwalior-cp/", label: "LinkedIn" },
    { icon: <FaInstagram />, url: "https://www.instagram.com/itm_gwalior/", label: "Instagram" }
  ];

  return (
    <footer className="bg-[#0a0a0a] text-white pt-16 pb-10 px-8 border-t border-white/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#800000]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 items-start mb-16">
          
          {/* 1. BRAND & SOCIAL */}
          <div className="space-y-6">
            <img src={logo} alt="ITM Logo" className="h-14 w-auto brightness-200" />
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              Think Big. Think Beyond. <br />
              Premier industry-led education in Madhya Pradesh.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#800000] transition-all border border-white/10 text-gray-400 hover:text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* 2. QUICK LINKS */}
          {footerSections.map((section) => (
            <div key={section.title} className="hidden lg:block">
              <h4 className="text-red-500 font-black uppercase tracking-widest text-[10px] mb-8">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-all text-sm font-bold">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* 3. CONTACT & MAP (Integrated) */}
          <div className="space-y-8">
            {/* Admissions */}
            <div>
              <h4 className="text-red-500 font-black uppercase tracking-widest text-[10px] mb-4">Admissions</h4>
              <div className="text-white font-black tracking-tight space-y-1.5">
                <p className="text-lg">+91-7773005065</p>
                <p className="text-base text-gray-200">+91-7773001624</p>
                <p className="text-base text-gray-200">+91-7773001627</p>
              </div>
            </div>

            {/* General & Map */}
            <div className="space-y-4">
              <div>
                <h4 className="text-red-500 font-black uppercase tracking-widest text-[10px] mb-2">General Office</h4>
                <p className="text-sm font-black text-white">0751-2440056 / 2432977</p>
              </div>

              {/* RESTORED MAP FEATURE */}
              <div className="group">
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=ITM+Gwalior+Sithouli+Campus" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="relative block w-full h-20 rounded-xl overflow-hidden border border-white/10 shadow-lg"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=500&auto=format&fit=crop" 
                    alt="Location" 
                    className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 transition-all duration-500" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent">
                    <span className="text-[9px] font-black uppercase bg-[#800000] text-white px-3 py-1.5 rounded-lg shadow-xl tracking-tighter">Locate Campus</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* REFINED BOTTOM SECTION */}
        <div className="pt-10 border-t border-white/5 flex flex-col items-center text-center gap-6">
          <div className="space-y-3">
            <p className="text-gray-300 text-xs font-bold tracking-wide">
              ITM Campus, Opp. Sithouli Railway Station, NH-75 Jhansi Road, Gwalior - 475001 (M.P.)
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
              <a href="#" className="hover:text-red-500 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-red-500 transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-red-500 transition-colors">Sitemap</a>
              <a href="mailto:admission@itmgoi.in" className="hover:text-red-500 transition-colors font-black">admission@itmgoi.in</a>
            </div>
          </div>
          
          <p className="text-gray-600 text-[9px] uppercase tracking-[0.4em] font-black border-t border-white/5 pt-6 w-full max-w-2xl">
            © 2026 ITM Gwalior • Independent Excellence
          </p>
        </div>
      </div>
    </footer>
  );
}
