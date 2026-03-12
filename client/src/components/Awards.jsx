import React from 'react';
import { motion } from 'framer-motion';

const awards = [
  {
    title: "Ranked 5th",
    subtitle: "Among Top 10 Engineering Institutes of Central India",
    issuer: "Silicon India Survey",
    year: "2014"
  },
  {
    title: "Best Placement",
    subtitle: "In Engineering & Management in MP",
    issuer: "National Technical Excellence Education Summit & Awards",
    year: "2014"
  },
  {
    title: "Best Institute",
    subtitle: "In Industry Interface",
    issuer: "CMAI, AICTE and RGPV Bhopal",
    year: "2013"
  }
];

const Awards = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-accent-600 font-semibold tracking-wide uppercase text-sm mb-2">Excellence Recognized</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">Highly Awarded</h3>
          <p className="text-gray-600 text-lg">
            Our commitment to quality education, research, and placement has been consistently recognized by leading national organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {awards.map((award, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-primary-50 rounded-3xl p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-primary-900/10 transition-all duration-300 border border-primary-100"
            >
              {/* Decorative circle */}
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 ease-in-out" />
              
              <div className="relative z-10">
                <span className="inline-block bg-primary-900 text-white text-xs font-bold px-3 py-1 rounded-full mb-6">
                  {award.year}
                </span>
                <h4 className="text-3xl font-extrabold text-gray-900 mb-2">{award.title}</h4>
                <p className="text-lg font-medium text-primary-700 mb-4">{award.subtitle}</p>
                <div className="h-px w-12 bg-accent-500 mb-4 transition-all group-hover:w-full duration-300"></div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">By {award.issuer}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Awards;
