import React, { useState } from "react";
import axios from "axios";
import { Upload, X, Plus, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export default function AdminPACEventForm() {
  const [formData, setFormData] = useState({
    title: "", 
    director: "", 
    event_date: ""
  });
  const [descriptions, setDescriptions] = useState([""]); // Array of paragraphs
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addDescriptionField = () => setDescriptions([...descriptions, ""]);
  const removeDescriptionField = (index) => {
    if (descriptions.length > 1) {
      setDescriptions(descriptions.filter((_, i) => i !== index));
    }
  };

  const handleDescriptionChange = (index, value) => {
    const newDescs = [...descriptions];
    newDescs[index] = value;
    setDescriptions(newDescs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert("Please upload at least one photo!");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("director", formData.director);
    data.append("event_date_str", formData.event_date);
    
    // Join descriptions into a single string to ensure no comma separation during transmission
    const fullDesc = descriptions.filter(d => d.trim()).join("\n\n");
    data.append("description", fullDesc);
    
    selectedFiles.forEach((file) => {
      data.append("files", file);
    });

    try {
      const response = await axios.post("http://localhost:8000/api/pac/add", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (response.data.status === "success") {
        alert("PAC Event Uploaded Successfully!");
        setFormData({ title: "", director: "", event_date: "" });
        setDescriptions([""]);
        setSelectedFiles([]);
        setPreviews([]);
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading event: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto min-h-screen pt-24">
      <Link to="/pac" className="flex items-center gap-2 text-[#800000] font-black text-xs uppercase tracking-widest mb-6 hover:translate-x-[-4px] transition-transform">
        <ChevronLeft size={16} />
        Back to PAC Page
      </Link>
      <Card className="p-8 shadow-xl border-t-4 border-t-[#800000]">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-red-100 rounded-2xl text-[#800000]">
            <Plus size={24} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Add New PAC Event</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Event Title</label>
            <input 
              type="text" 
              placeholder="e.g. MAHARATHI 2.0" 
              className="w-full p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#800000] font-bold outline-none" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})} 
              required 
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500">Event Date</label>
              <input 
                type="date" 
                className="w-full p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#800000] font-bold outline-none" 
                value={formData.event_date}
                onChange={(e) => setFormData({...formData, event_date: e.target.value})} 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500">Director / Choreographer</label>
              <input 
                type="text" 
                placeholder="Name" 
                className="w-full p-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#800000] font-bold outline-none" 
                value={formData.director}
                onChange={(e) => setFormData({...formData, director: e.target.value})} 
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500">Description Paragraphs</label>
              <button 
                type="button" 
                onClick={addDescriptionField}
                className="text-[10px] font-black uppercase tracking-widest text-[#800000] hover:underline flex items-center gap-1"
              >
                <Plus size={12} /> Add Paragraph
              </button>
            </div>
            
            {descriptions.map((desc, idx) => (
              <div key={idx} className="relative group space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#800000]/60">Paragraph {idx + 1}</span>
                  {descriptions.length > 1 && (
                    <button 
                      type="button"
                      onClick={() => removeDescriptionField(idx)}
                      className="text-[10px] font-black uppercase text-gray-400 hover:text-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <textarea 
                  placeholder={`Write details for paragraph ${idx + 1}...`} 
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#800000] font-bold outline-none min-h-[120px] shadow-sm transition-all" 
                  value={desc}
                  onChange={(e) => handleDescriptionChange(idx, e.target.value)} 
                  required 
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 block">Photos (Upload Multiple)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {previews.map((src, index) => (
                <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm">
                  <img src={src} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-[#800000] transition-all group">
                <Upload size={24} className="text-gray-400 group-hover:text-[#800000] mb-2" />
                <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-[#800000]">Add Photo</span>
                <input type="file" multiple onChange={handleFileChange} className="hidden" accept="image/*" />
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#800000] text-white py-5 rounded-2xl font-black text-xs tracking-[0.2em] uppercase hover:shadow-2xl hover:bg-red-900 transition-all transform active:scale-[0.98] disabled:bg-gray-400"
          >
            {loading ? "UPLOADING..." : "PUBLISH PAC EVENT"}
          </button>
        </form>
      </Card>
    </div>
  );
}
