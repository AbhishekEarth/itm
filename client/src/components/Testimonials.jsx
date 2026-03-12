import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Mr. Abhinav Prakash",
    role: "Executive Talent Search",
    company: "Birla Soft Ltd.",
    text: "Absolutely wonderful hospitality, heart warming. We are pleased to say that ITM Universe has done a fantastic job starting from arranging to hospitality. Special thanks to ITM. It has such a bright prospective and has a great vision to succeed."
  },
  {
    name: "Priya Sharma",
    role: "Alumna, Computer Science",
    company: "Google",
    text: "My journey at ITM was transformative. The faculty guided me not just academically but also helped in overall personality development. The rigorous curriculum combined with practical exposure made me industry-ready from day one."
  },
  {
    name: "Rahul Verma",
    role: "Current Student, B.Tech",
    company: "ITM GOI",
    text: "The infrastructure is top-notch, and the campus environment encourages innovation. The TAP cell here provides ample opportunities to discover your passions outside the curriculum."
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-primary-900 relative overflow-hidden">
      {/* Abstract Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-accent-400 font-semibold tracking-wide uppercase text-sm mb-2">Voices That Matter</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">Our Students Say!</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-2xl relative"
            >
              <Quote className="w-12 h-12 text-primary-100 absolute top-8 right-8 z-0" />
              <div className="relative z-10">
                <p className="text-gray-700 leading-relaxed mb-8 italic">"{test.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent-400 to-primary-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{test.name}</h4>
                    <p className="text-sm font-medium text-primary-600">{test.role}, <span className="text-gray-500">{test.company}</span></p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
