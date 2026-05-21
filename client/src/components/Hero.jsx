import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
  }, []);

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-[#020617] pt-32 md:pt-40 pb-20">

      {/* --- BACKGROUND IMAGES (dark cinematic) --- */}
      <div className="absolute inset-0 z-0 bg-[#020617]">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
              i === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ filter: "brightness(0.85) saturate(1.05) contrast(1.02)", objectPosition: "50% 35%" }}
          />
        ))}

        {/* Strong left-side gradient so text always reads, image stays bright on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/0 z-[1]" />
        {/* Maroon brand tint for cohesion */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#3e0202]/55 via-transparent to-transparent z-[1]" />
        {/* Soft bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 to-transparent z-[1]" />
        {/* Maroon accent glow */}
        <div className="absolute -left-32 top-1/3 w-[520px] h-[520px] rounded-full bg-[#800000]/25 blur-3xl z-[1]" />
      </div>

      {/* --- CONTENT --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">

        {/* Headline */}
        <div className="max-w-3xl text-white">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="text-5xl md:text-[88px] font-black leading-[0.92] mb-6 tracking-tighter"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.6)" }}
          >
            Think Big. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-amber-300">
              Think Beyond.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-base md:text-lg text-gray-200 mb-9 max-w-xl leading-relaxed font-medium"
            style={{ textShadow: "0 2px 14px rgba(0,0,0,0.7)" }}
          >
            At ITM Gwalior, we don't just follow the future — we architect it.
            Empowering a new generation of leaders to transcend boundaries and redefine excellence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="flex flex-wrap items-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(220,38,38,0.6)" }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-r from-[#a30000] to-[#800000] text-white px-9 py-3.5 rounded-xl font-black text-[11px] tracking-widest uppercase shadow-xl shadow-[#800000]/40 cursor-pointer"
            >
              Apply Now 2026
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-3 px-7 py-3.5 rounded-xl font-black text-[11px] tracking-widest uppercase border-2 border-white/30 bg-white/5 backdrop-blur-sm text-white cursor-pointer hover:bg-white/10"
            >
              <span className="flex items-center justify-center w-7 h-7 bg-red-600 text-white rounded-full group-hover:rotate-[360deg] transition-transform duration-700">
                <span className="ml-0.5 text-[9px]">▶</span>
              </span>
              Watch Tour
            </motion.button>

            {/* NAAC A+ chip — moved here so it's never hidden by the navbar */}
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-amber-300/40 backdrop-blur-sm text-amber-200 text-[10px] font-black uppercase tracking-[0.25em]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
              NAAC A Accredited
            </span>
          </motion.div>

          {/* Mini live stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10 pt-6 border-t border-white/15 grid grid-cols-3 gap-6 max-w-md"
          >
            {[
              { num: "29+", label: "Years" },
              { num: "1500+", label: "Recruiters" },
              { num: "98%", label: "Placement" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-300 to-amber-200 leading-none">{s.num}</div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-gray-300 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* --- SLIDER PROGRESS (clickable) --- */}
      <div className="absolute bottom-8 left-8 flex gap-3 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className="h-1 w-10 bg-white/20 rounded-full overflow-hidden cursor-pointer hover:h-1.5 transition-all"
          >
            {currentIndex === index && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "linear" }}
                className="h-full bg-gradient-to-r from-red-400 to-amber-300"
              />
            )}
          </button>
        ))}
      </div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 right-8 hidden md:flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-red-300/90 z-20"
      >
        Scroll
        <span className="inline-block w-px h-6 bg-red-300/80" />
      </motion.div>
    </section>
  );
}
