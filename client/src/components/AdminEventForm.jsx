import React, { useState } from "react";
import axios from "axios";

export default function AdminEventForm() {
  const [formData, setFormData] = useState({
    title: "", description: "", icon: "📅", event_date: ""
  });
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("icon", formData.icon);
    data.append("event_date", formData.event_date);
    data.append("file", file);

    try {
      await axios.post("http://localhost:8000/api/events/add", data);
      alert("Event Uploaded!");
    } catch (err) {
      alert("Error uploading event");
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 rounded-sm shadow-md max-w-lg mx-auto mt-10">
      <h2 className="text-xl font-bold mb-6 text-[#800000]">Add New TAP Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Event Title" className="w-full p-2 border" 
          onChange={(e) => setFormData({...formData, title: e.target.value})} required />
        
        <textarea placeholder="Description" className="w-full p-2 border" 
          onChange={(e) => setFormData({...formData, description: e.target.value})} required />
        
        <div className="grid grid-cols-2 gap-4">
          <input type="date" className="p-2 border" 
            onChange={(e) => setFormData({...formData, event_date: e.target.value})} required />
          <input type="text" placeholder="Icon (e.g. 📋)" className="p-2 border" 
            onChange={(e) => setFormData({...formData, icon: e.target.value})} />
        </div>

        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full" required />
        
        <button type="submit" className="w-full bg-[#800000] text-white py-2 font-bold hover:bg-red-800 transition-colors">
          UPLOAD EVENT
        </button>
      </form>
    </div>
  );
}