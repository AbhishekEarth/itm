import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import slider1 from "../assets/slider1.jpg"; 
import slider2 from "../assets/slider2.jpg";

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [slider1, slider2];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    // Changed pt-20 to pt-32 to give the fixed header room to breathe
    // Removed h-screen and used min-h-[90vh] to prevent content being cut off
    <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-white dark:bg-[#020617] pt-32 pb-20">
      
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0 bg-black">
        <AnimatePresence initial={false}>
          <motion.img 
            key={currentIndex}
            src={images[currentIndex]} 
            alt="ITM Campus" 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.5, scale: 1 }} 
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full object-cover" 
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent dark:from-[#020617] dark:via-[#020617]/80 dark:to-transparent z-[1]"></div>
      </div>

      {/* --- CONTENT CONTAINER --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full"> 
        <div className="max-w-3xl">
          
          {/* Animated Badge - Removed absolute positioning to keep it in flow */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="h-[2px] w-8 bg-[#800000]"></span>
            <span className="text-[#800000] dark:text-red-400 text-[11px] font-black uppercase tracking-[0.3em]">
              NAAC A+ Accredited University
            </span>
          </motion.div>
          
          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-[85px] font-black text-[#3e0202] dark:text-white leading-[0.9] mb-8 tracking-tighter"
          >
            Build Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#800000] to-red-600 dark:from-red-500 dark:to-rose-400">
              Legacy.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-lg leading-relaxed font-medium"
          >
            Join a community of innovators at ITM Gwalior. India's premier destination 
            for industry-led education and global research.
          </motion.p>
          
          {/* INTERACTIVE BUTTONS */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-6"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#800000] text-white px-10 py-4 rounded-xl font-black text-[11px] tracking-widest uppercase shadow-xl transition-all cursor-pointer"
            >
              Apply Now 2026
            </motion.button>
            
            <motion.button 
              className="group flex items-center gap-4 px-8 py-4 rounded-xl font-black text-[11px] tracking-widest uppercase border-2 border-[#800000]/20 dark:border-white/10 text-[#3e0202] dark:text-white transition-all cursor-pointer"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-red-600 text-white rounded-full shadow-lg group-hover:rotate-[360deg] transition-transform duration-700">
                <span className="ml-0.5 text-[10px]">▶</span>
              </div>
              Watch Tour
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* --- SLIDER PROGRESS INDICATOR --- */}
      <div className="absolute bottom-10 left-10 flex gap-3 z-20">
        {images.map((_, index) => (
          <div key={index} className="h-1 w-12 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            {currentIndex === index && (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "linear" }}
                className="h-full bg-[#800000]"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}