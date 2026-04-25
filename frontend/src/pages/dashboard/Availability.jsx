import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MoreHorizontal, Plus, Globe, Loader2 } from 'lucide-react';
import api from '../../utils/api';

export default function Availability() {
  const navigate = useNavigate();
  const [schedules, setSchedules]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [creating, setCreating]       = useState(false);
  const [activeTab, setActiveTab]     = useState('my');
  const [openMenu, setOpenMenu]       = useState(null);

  useEffect(() => { fetchSchedules(); }, []);

  const fetchSchedules = async () => {
    try {
      const res = await api.get('/availability');
      // Normalise: new API returns array, old API returned a single object
      const data = res.data;
      if (Array.isArray(data)) {
        setSchedules(data);
      } else if (data && data._id) {
        setSchedules([data]);
      } else {
        setSchedules([]);
      }
    } catch (err) {
      console.error('Failed to fetch schedules', err);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNew = async () => {
    setCreating(true);
    try {
      const res = await api.post('/availability', { name: 'New schedule' });
      navigate(`/dashboard/availability/${res.data._id}`);
    } catch (err) {
      alert('Failed to create schedule');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this schedule?')) return;
    try {
      await api.delete(`/availability/${id}`);
      setSchedules(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot delete');
    }
    setOpenMenu(null);
  };

  // Build a human-readable summary like "Mon - Fri, 9:00 AM - 5:00 PM"
  const buildSummary = (days) => {
    if (!days) return '';
    const enabled = days.filter(d => d.enabled);
    if (!enabled.length) return 'No available times';
    const fmt = t => {
      const [h, m] = t.split(':').map(Number);
      const ampm = h >= 12 ? 'PM' : 'AM';
      return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${ampm}`;
    };
    const first = enabled[0];
    const last  = enabled[enabled.length - 1];
    const dayAbbr = d => d.day.slice(0, 3);
    const dayRange = first.day === last.day ? dayAbbr(first) : `${dayAbbr(first)} - ${dayAbbr(last)}`;
    return `${dayRange}, ${fmt(first.startTime)} - ${fmt(first.endTime)}`;
  };

  return (
    <DashboardLayout
      title="Availability"
      subtitle="Configure times when you are available for bookings."
      actions={
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex rounded-lg border border-[#2B2B2B] overflow-hidden">
            {[{id:'my', label:'My availability'},{id:'team', label:'Team availability'}].map((t,i) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex-1 px-4 py-1.5 text-[13px] font-medium transition-colors ${
                  activeTab === t.id ? 'bg-[#2B2B2B] text-white' : 'text-[#71717A] hover:text-white'
                } ${i === 0 ? 'border-r border-[#2B2B2B]' : ''}`}>
                <span className="whitespace-nowrap">{t.label}</span>
              </button>
            ))}
          </div>
          <button onClick={handleNew} disabled={creating}
            className="flex items-center justify-center gap-1.5 h-9 px-4 bg-white text-[#111827] text-[13px] font-semibold rounded-lg hover:bg-[#f4f4f5] disabled:opacity-60 transition-colors">
            {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            New
          </button>
        </div>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-[#52525B]" />
        </div>
      ) : (
        <div className="max-w-3xl space-y-3">
          {schedules.map((s, idx) => (
            <motion.div
              key={s._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.07 }}
              onClick={() => navigate(`/dashboard/availability/${s._id}`)}
              className="relative flex items-center px-6 py-5 bg-[#141414] border border-[#2B2B2B] rounded-xl cursor-pointer hover:border-[#3F3F46] transition-colors group"
            >

              <div className="flex-1 min-w-0">
                {/* Title row */}
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="text-[15px] font-bold text-white">{s.name}</span>
                  {s.isDefault && (
                    <span className="px-2 py-0.5 rounded-md border border-[#3F3F46] text-[11px] font-semibold text-[#A1A1AA] bg-[#1A1A1A]">
                      Default
                    </span>
                  )}
                </div>
                {/* Hours summary */}
                <p className="text-[13px] text-[#71717A]">{buildSummary(s.days)}</p>
                {/* Timezone */}
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Globe className="w-3 h-3 text-[#52525B]" />
                  <span className="text-[12px] text-[#52525B]">{s.timezone || 'UTC'}</span>
                </div>
              </div>

              {/* Kebab menu */}
              <button
                onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === s._id ? null : s._id); }}
                className="p-2 rounded-md text-[#52525B] hover:bg-[#2B2B2B] hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {openMenu === s._id && (
                <div className="absolute right-4 top-14 z-20 w-44 bg-[#1A1A1A] border border-[#3F3F46] rounded-xl shadow-2xl overflow-hidden">
                  <button onClick={e => { e.stopPropagation(); navigate(`/dashboard/availability/${s._id}`); setOpenMenu(null); }}
                    className="w-full text-left px-4 py-2.5 text-[13px] text-[#A1A1AA] hover:bg-[#2B2B2B] hover:text-white">
                    Edit
                  </button>
                  <button onClick={e => handleDelete(s._id, e)}
                    className="w-full text-left px-4 py-2.5 text-[13px] text-red-400 hover:bg-[#2B2B2B]">
                    Delete
                  </button>
                </div>
              )}
            </motion.div>
          ))}

          {/* Out-of-office footer */}
          <p className="text-center text-[13px] text-[#71717A] pt-4">
            Temporarily out-of-office?{' '}
            <span className="text-white underline cursor-pointer hover:text-[#A1A1AA] transition-colors">
              Add a redirect
            </span>
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}
