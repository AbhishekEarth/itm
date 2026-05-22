import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Real campus photos from the official ITM Gwalior website (itmgoi.in)
const images = [
  "/images/hero/slider1.jpg",
  "/images/hero/slider2.jpg",
  "/images/hero/slider3.jpg",
  "/images/hero/slider4.jpg",
  "/images/hero/slider5.jpg",
  "/images/hero/slider9.jpg",
  "/images/hero/slider10.png",
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative -mt-[120px] md:-mt-[160px] min-h-[calc(100vh+120px)] md:min-h-[calc(100vh+160px)] flex items-center overflow-hidden bg-white dark:bg-[#020617] pb-20">

      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0 bg-white dark:bg-[#020617]">
        {/* Preload all hero images once; cross-fade via opacity (cheap on GPU) */}
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              i === currentIndex ? "opacity-80" : "opacity-0"
            }`}
          />
        ))}

        {/* Subtle Gradient to protect text legibility without hiding the photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/10 to-transparent dark:from-[#020617]/90 dark:via-[#020617]/20 dark:to-transparent z-[1]"></div>
      </div>

      {/* --- CONTENT CONTAINER --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-[120px] md:pt-[160px]">
        <div className="max-w-3xl">

          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="h-[2px] w-8 bg-[#800000]"></span>
            <span className="text-[#800000] dark:text-red-400 text-[11px] font-black uppercase tracking-[0.3em] drop-shadow-sm">
              NAAC A+ Accredited University
            </span>
          </motion.div>

          {/* NEW MANTRA-BASED TITLE */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-[85px] font-black text-[#3e0202] dark:text-white leading-[0.9] mb-8 tracking-tighter drop-shadow-md"
          >
            Think Big. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#800000] to-red-600 dark:from-red-500 dark:to-rose-400">
              Think Beyond.
            </span>
          </motion.h1>

          {/* NEW MANTRA-BASED DESCRIPTION */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-800 dark:text-gray-100 mb-10 max-w-lg leading-relaxed font-bold drop-shadow-lg"
          >
            At ITM Gwalior, we don't just follow the future—we architect it.
            Empowering a new generation of leaders to transcend boundaries
            and redefine excellence.
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
              className="group flex items-center gap-4 px-8 py-4 rounded-xl font-black text-[11px] tracking-widest uppercase border-2 border-[#800000]/40 dark:border-white/20 bg-white/10 backdrop-blur-sm text-[#3e0202] dark:text-white transition-all cursor-pointer shadow-lg"
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
