import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const usps = [
  "ITM Gwalior is ranked among the top institutions in Central India for its academic excellence.",
  "Focus on Project-Based Learning and Practical Exposure.",
  "State-of-the-art Infrastructure with modern labs, libraries, and smart classrooms.",
  "Dedicated Training, Augmentation, and Placement (TAP) Cell ensuring high placement rates.",
  "Strong industry connections with regular workshops, seminars, and guest lectures.",
  "Vibrant campus life with numerous clubs, societies, and cultural activities."
];

const ITMUSP = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-accent-600 font-semibold tracking-wide uppercase text-sm mb-2">Why Choose Us</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-8">ITM Gwalior USP</h3>
            
            <ul className="space-y-6">
              {usps.map((usp, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="bg-primary-50 p-2 rounded-lg shrink-0 mt-1">
                    <CheckCircle2 className="w-6 h-6 text-primary-600" />
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">{usp}</p>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Image/Visual Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl group"
          >
            <div className="absolute inset-0 bg-primary-900/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
            <img 
              src="/images/Tap_Cell.jpg" 
              alt="ITM Campus" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-accent-500 rounded-full mix-blend-multiply opacity-50 blur-2xl z-0"></div>
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-primary-500 rounded-full mix-blend-multiply opacity-50 blur-2xl z-0"></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ITMUSP;
