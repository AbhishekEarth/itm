import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About Us', hasDropdown: true },
    { name: 'Admissions', hasDropdown: true },
    { name: 'Academics', hasDropdown: true },
    { name: 'Training and Placements', path: '/tap', isExternalTab: false, hasDropdown: false },
    { name: 'Research', hasDropdown: false },
    { name: 'Alumni', hasDropdown: false },
  ];

  return (
    <header
      className="sticky top-0 w-full z-50 bg-white shadow-md py-2 transition-all duration-300"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 sm:gap-3 lg:gap-5 z-50 cursor-pointer py-1 transition-all duration-300">
            <img src="/images/ITMGOILogo.png" alt="ITM GOI" className="h-[30px] sm:h-[40px] md:h-[65px] object-contain" />
            <img src="/images/29years.png" alt="29 Years" className="h-[26px] sm:h-[35px] md:h-[55px] block object-contain" />
            <img src="/images/NAACLogo.png" alt="NAAC" className="h-[26px] sm:h-[35px] md:h-[55px] block object-contain" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, idx) => {
              const LinkContent = (
                <div className="relative group cursor-pointer flex items-center gap-1">
                  <span className="font-medium text-gray-700 transition-colors hover:text-accent-500">
                    {link.name}
                  </span>
                  {link.hasDropdown && (
                    <ChevronDown className="w-4 h-4 text-gray-500 transition-transform group-hover:rotate-180" />
                  )}

                  {/* Simple underline indicator */}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-500 group-hover:w-full transition-all duration-300"></span>
                </div>
              );

              return link.path ? (
                <Link
                  key={idx}
                  to={link.path}
                  target={link.isExternalTab ? "_blank" : "_self"}
                  rel={link.isExternalTab ? "noopener noreferrer" : ""}
                >
                  {LinkContent}
                </Link>
              ) : (
                <div key={idx}>{LinkContent}</div>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="bg-accent-500 hover:bg-accent-600 text-white px-5 py-2.5 rounded-full font-medium transition-all transform hover:scale-105 shadow-md shadow-accent-500/30">
              Apply Now
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 z-50 relative rounded-md hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen
              ? <X className="w-6 h-6 text-gray-800" />
              : <Menu className="w-6 h-6 text-gray-800" />
            }
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 w-full h-screen bg-white pt-24 px-6 shadow-2xl lg:hidden flex flex-col"
          >
            <div className="flex flex-col gap-6 text-xl font-medium text-gray-800">
              {navLinks.map((link, idx) => {
                const MobileItem = (
                  <div className="border-b border-gray-100 pb-4 flex justify-between items-center text-primary-900 w-full">
                    {link.name}
                    {link.hasDropdown && <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                );

                return link.path ? (
                  <Link
                    key={idx}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    target={link.isExternalTab ? "_blank" : "_self"}
                    rel={link.isExternalTab ? "noopener noreferrer" : ""}
                  >
                    {MobileItem}
                  </Link>
                ) : (
                  <div key={idx}>{MobileItem}</div>
                );
              })}
              <div className="mt-8 flex flex-col gap-4">
                <button className="w-full bg-accent-500 text-white px-5 py-3 rounded-xl font-medium shadow-md shadow-accent-500/30">
                  Apply Now
                </button>
                <button className="w-full bg-primary-50 text-primary-700 px-5 py-3 rounded-xl font-medium border border-primary-100">
                  Student Login
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
