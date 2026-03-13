import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Trophy, Users } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-800/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Campus life" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-20 pt-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-500/90 text-white text-sm font-medium tracking-wide mb-6 backdrop-blur-sm shadow-lg shadow-accent-500/20 border border-accent-400/50">
              Admissions Open 2026-27
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              <span className="inline-block pb-2 pt-1 lg:pb-1 lg:pt-0 text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-orange-300">
                Transforming Futures.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed">
              Institute of Technology & Management, Gwalior is ranked among the top institutions, providing world-class education, unmatched industry exposure, and a vibrant campus life.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl text-sm md:text-base font-semibold flex items-center gap-2 transition-all transform hover:translate-y-[-2px] shadow-xl shadow-accent-500/30">
                Explore Programs
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl text-sm md:text-base font-semibold transition-all transform hover:translate-y-[-2px]">
                Virtual Campus Tour
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20 relative z-30">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-6 flex items-start gap-4 hover:bg-white/20 transition-colors cursor-default"
          >
            <div className="bg-accent-500/20 p-3 rounded-lg text-accent-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">50+</h3>
              <p className="text-gray-300 text-sm font-medium">Undergraduate & Postgrad Programs</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-6 flex items-start gap-4 hover:bg-white/20 transition-colors cursor-default"
          >
            <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">Top 5</h3>
              <p className="text-gray-300 text-sm font-medium">Engg Institutes in Central India</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-6 flex items-start gap-4 hover:bg-white/20 transition-colors cursor-default"
          >
            <div className="bg-green-500/20 p-3 rounded-lg text-green-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">98%</h3>
              <p className="text-gray-300 text-sm font-medium">Placement Rate Across All Disciplines</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
