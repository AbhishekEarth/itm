import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Upload, X, ChevronLeft, Trash2, Calendar, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

const ICONS = ["📅", "📋", "🏭", "💼", "🎯", "🎓", "🤝", "🏆", "💻", "🔬"];

export default function AdminEventForm() {
  const { token } = useAuth();
  const authHeaders = { Authorization: `Bearer ${token}` };
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "📋",
    event_date: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState({ upcoming: [], past: [] });

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const fetchEvents = async () => {
    try {
      const r = await axios.get("/api/events/all");
      setEvents(r.data);
    } catch (e) {
      console.error("Fetch failed:", e);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload an event poster image.");
      return;
    }
    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("icon", formData.icon);
    data.append("event_date", formData.event_date);
    data.append("file", file);

    try {
      const res = await axios.post("/api/events/add", data, {
        headers: { ...authHeaders, "Content-Type": "multipart/form-data" },
      });
      if (res.data.status === "success") {
        alert("TAP event uploaded successfully!");
        setFormData({ title: "", description: "", icon: "📋", event_date: "" });
        setFile(null);
        setPreview(null);
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading event: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this TAP event?")) return;
    try {
      await axios.delete(`/api/events/delete/${id}`, { headers: authHeaders });
      fetchEvents();
    } catch (e) {
      alert("Delete failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/30 via-white to-white py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Link to="/tap" className="flex items-center gap-2 text-[#800000] font-black text-xs uppercase tracking-widest mb-6 hover:translate-x-[-4px] transition-transform">
          <ChevronLeft size={16} /> Back to TAP Page
        </Link>

        <div className="grid lg:grid-cols-5 gap-6">

          {/* ── FORM ─────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <Card className="p-7 shadow-xl border-t-4 border-t-[#800000] sticky top-32">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-100 rounded-2xl text-[#800000] text-2xl">🎯</div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-black text-[#800000]">Admin Panel</div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">Add TAP Event</h2>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Event Title</label>
                  <input
                    type="text"
                    placeholder="e.g. TCS Campus Drive"
                    className="w-full p-3 bg-gray-50 border-0 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#800000]"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Event Date</label>
                  <input
                    type="date"
                    className="w-full p-3 bg-gray-50 border-0 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#800000]"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Icon</label>
                  <div className="grid grid-cols-5 gap-2">
                    {ICONS.map((ic) => (
                      <button
                        key={ic}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: ic })}
                        className={`aspect-square text-2xl rounded-xl border-2 transition-all ${
                          formData.icon === ic ? "border-[#800000] bg-rose-50" : "border-gray-100 hover:border-gray-300"
                        }`}
                      >
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Description</label>
                  <textarea
                    placeholder="Short description of the event…"
                    className="w-full p-3 bg-gray-50 border-0 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#800000] min-h-[100px] resize-y"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Event Poster</label>
                  {preview ? (
                    <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-gray-100">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={removeFile}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-[#800000] transition-all">
                      <Upload size={28} className="text-gray-400 mb-2" />
                      <span className="text-[10px] font-black uppercase text-gray-400">Click to upload poster</span>
                      <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" required />
                    </label>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#800000] text-white py-4 rounded-2xl font-black text-xs tracking-[0.2em] uppercase hover:bg-red-900 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? "Uploading…" : "Publish TAP Event"}
                </button>
              </form>
            </Card>
          </div>

          {/* ── LIST ─────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} className="text-[#800000]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#800000]">Current Events</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-[#1a0606]">
                  {events.upcoming.length + events.past.length} total · {events.upcoming.length} upcoming
                </h3>
              </div>
            </div>

            {events.upcoming.length === 0 && events.past.length === 0 ? (
              <div className="bg-rose-50/60 border border-rose-100 rounded-3xl p-10 text-center">
                <div className="text-5xl mb-3">📭</div>
                <h4 className="font-black text-base text-[#1a0606] mb-1">No events yet</h4>
                <p className="text-sm text-gray-600 font-medium">Add your first TAP event using the form on the left.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...events.upcoming, ...events.past].map((e) => {
                  const isUpcoming = events.upcoming.find((u) => u.id === e.id);
                  return (
                    <div key={e.id} className="bg-white border border-rose-50 rounded-2xl overflow-hidden flex shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-32 shrink-0 bg-gray-100">
                        <img src={e.image_url} alt={e.title} className={`w-full h-full object-cover ${!isUpcoming ? "grayscale" : ""}`} />
                      </div>
                      <div className="flex-1 p-4 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xl">{e.icon || "📅"}</span>
                          <span className={`text-[9px] uppercase tracking-widest font-black px-2 py-0.5 rounded ${isUpcoming ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                            {isUpcoming ? "Upcoming" : "Past"}
                          </span>
                          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                            {new Date(e.event_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        <h4 className="font-black text-sm text-[#1a0606] tracking-tight leading-snug truncate">{e.title}</h4>
                        <p className="text-xs text-gray-600 font-medium leading-relaxed line-clamp-2 mt-1">{e.description}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="px-4 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center"
                        title="Delete event"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 inline-flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-full text-[10px] uppercase tracking-widest font-black text-amber-800">
              <Sparkles size={11} /> Changes appear live on the TAP page immediately
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
