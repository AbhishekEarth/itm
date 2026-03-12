import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from our Node.js mock API
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setLoading(false);
        // Fallback data in case server isn't running
        setEvents([
          {
            id: 1,
            title: "International Conference on Advanced Computing",
            date: "15 Oct 2026",
            description: "Join us for the 3rd International Conference focusing on AI and Cloud Computing."
          },
          {
            id: 2,
            title: "Alumni Meet 2026",
            date: "20 Nov 2026",
            description: "An evening to reconnect, reminisce, and celebrate the success of our alumni."
          }
        ]);
      }
    };
    fetchEvents();
  }, []);

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-xl">
            <h2 className="text-accent-600 font-semibold tracking-wide uppercase text-sm mb-2">Campus Life</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">Recent & Upcoming Events</h3>
          </div>
          <button className="mt-6 md:mt-0 text-primary-700 font-medium hover:text-primary-900 flex items-center gap-2 transition-colors">
            View All Events <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-primary-900/10 transition-all duration-300 group border border-gray-100"
              >
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-${index % 2 === 0 ? '1540575467063-178a50c2df87' : '1505373877841-8d25f7d46678'}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-center shadow-lg">
                    <span className="block text-accent-600 font-bold text-xl leading-none">{event.date.split(' ')[0]}</span>
                    <span className="block text-gray-600 font-medium text-xs mt-1 uppercase">{event.date.split(' ')[1]}</span>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 font-medium">
                    <MapPin className="w-4 h-4 text-primary-500" />
                    <span>ITM GOI Campus, Gwalior</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors line-clamp-2">
                    {event.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed line-clamp-3 mb-6">
                    {event.description}
                  </p>
                  
                  <button className="text-accent-500 font-semibold hover:text-accent-600 group-hover:underline underline-offset-4 flex items-center gap-1 transition-all">
                    Learn More <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Events;
