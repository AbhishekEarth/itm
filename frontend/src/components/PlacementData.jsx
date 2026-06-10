import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function PlacementData() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_URL || ""; 

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/placements/all`);
        setRecords(response.data);
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  if (loading) return <div className="text-center py-10 text-gray-400">Loading...</div>;
  if (records.length === 0) return null;

  return (
    /* Masonry layout without extra padding or footer strips */
    <div className="columns-2 md:columns-2 lg:columns-3 gap-2 sm:gap-6 space-y-2 sm:space-y-6">
      {records.map((item) => (
        <motion.div 
          key={item.id} 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="break-inside-avoid"
        >
          {/* Box shadow and border removed to eliminate 'Tape' look */}
          <div className="overflow-hidden bg-transparent">
            <img 
              src={`${API_BASE_URL}${item.image_url}`} 
              alt="Placement Record" 
              className="w-full h-auto block rounded-sm shadow-sm hover:shadow-md transition-shadow duration-300"
              loading="lazy"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}