import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, MoreHorizontal, Copy, ExternalLink, Trash2,
  Check, Share2, Settings, Clock, Search, ChevronUp, ChevronDown
} from 'lucide-react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ── Single row ───────────────────────────────────────────────────────────────
const EventTypeRow = ({ event, onDelete, onEdit, onCopy, onToggle, onMoveUp, onMoveDown, isFirst, isLast, index, username }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => { setMenuOpen(false); };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [menuOpen]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex items-center border-b border-[#2B2B2B] last:border-0 hover:bg-[#1A1A1A] transition-colors cursor-pointer group px-4 py-4"
      onClick={() => onEdit(event)}
    >
      {/* Left: Reorder arrows (Box-like structure) */}
      <div 
        className="hidden sm:flex flex-col gap-1 mr-4 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          disabled={isFirst}
          onClick={() => onMoveUp(event._id)}
          className="w-7 h-7 flex items-center justify-center rounded-md bg-[#1A1A1A] border border-[#2B2B2B] text-[#52525B] hover:text-white hover:border-[#3F3F46] hover:bg-[#2B2B2B] disabled:opacity-0 transition-all cursor-pointer"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          disabled={isLast}
          onClick={() => onMoveDown(event._id)}
          className="w-7 h-7 flex items-center justify-center rounded-md bg-[#1A1A1A] border border-[#2B2B2B] text-[#52525B] hover:text-white hover:border-[#3F3F46] hover:bg-[#2B2B2B] disabled:opacity-0 transition-all cursor-pointer"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Content: title + slug + badge */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[15px] font-semibold text-white">{event.title}</span>
          <span className="text-[13px] text-[#52525B]">/{event.slug}</span>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-[#1E1E1E] border border-[#3F3F46] text-[#A1A1AA] text-[12px] font-medium px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3" />
            {event.length}m
          </span>
        </div>
      </div>

      {/* Right: actions */}
      <div
        className="flex items-center gap-2 ml-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden label */}
        {event.hidden && (
          <span className="text-[13px] font-medium text-amber-500 mr-1">Hidden</span>
        )}

        {/* Toggle */}
        <button
          onClick={() => onToggle(event)}
          className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
            !event.hidden ? 'bg-[#0ea5e9]' : 'bg-[#3F3F46]'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ${
              !event.hidden ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>

        {/* External link */}
        <button
          onClick={() => window.open(`/${username}/${event.slug}`, '_blank')}
          className="p-2 rounded-md text-[#71717A] hover:text-white hover:bg-[#2B2B2B] transition-colors"
          title="Preview"
        >
          <ExternalLink className="w-4 h-4" />
        </button>

        {/* Copy link */}
        <button
          onClick={() => onCopy(event.slug)}
          className="p-2 rounded-md text-[#71717A] hover:text-white hover:bg-[#2B2B2B] transition-colors"
          title="Copy link"
        >
          <Copy className="w-4 h-4" />
        </button>

        {/* More menu */}
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v); }}
            className="p-2 rounded-md text-[#71717A] hover:text-white hover:bg-[#2B2B2B] transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-48 bg-[#1A1A1A] border border-[#3F3F46] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] z-50 py-1"
              onClick={(e) => e.stopPropagation()}
            >
              <DropItem icon={<Settings className="w-4 h-4" />} label="Edit" onClick={() => { setMenuOpen(false); onEdit(event); }} />
              <DropItem icon={<ExternalLink className="w-4 h-4" />} label="Preview" onClick={() => { setMenuOpen(false); window.open(`/${username}/${event.slug}`, '_blank'); }} />
              <DropItem icon={<Copy className="w-4 h-4" />} label="Copy link" onClick={() => { setMenuOpen(false); onCopy(event.slug); }} />
              <div className="my-1 border-t border-[#3F3F46]" />
              <DropItem icon={<Trash2 className="w-4 h-4" />} label="Delete" onClick={() => { setMenuOpen(false); onDelete(event._id); }} danger />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const DropItem = ({ icon, label, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium transition-colors ${
      danger ? 'text-red-400 hover:bg-red-900/20' : 'text-[#D4D4D8] hover:bg-[#2B2B2B]'
    }`}
  >
    <span className={danger ? 'text-red-400' : 'text-[#71717A]'}>{icon}</span>
    {label}
  </button>
);

// ── New event type modal ─────────────────────────────────────────────────────
const NewEventModal = ({ onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug]   = useState('');
  const [length, setLength] = useState(30);
  const [saving, setSaving] = useState(false);

  const autoSlug = (t) => t.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/event-types', {
        title,
        slug: slug || autoSlug(title),
        length,
        location: 'Google Meet',
        requiresConfirmation: false,
      });
      onCreated(res.data._id);
    } catch {
      alert('Failed to create event type.');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] border border-[#3F3F46] rounded-2xl w-full max-w-[480px] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="px-7 pt-7 pb-5 border-b border-[#2B2B2B]">
          <h2 className="text-[18px] font-bold text-white">Add a new event type</h2>
          <p className="text-[#71717A] text-[13px] mt-1">Create a new event type for people to book times with.</p>
        </div>

        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5">
          <div>
            <label className="block text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">Title</label>
            <input
              autoFocus
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Quick Chat"
              className="w-full h-10 px-3 bg-[#101010] border border-[#3F3F46] rounded-lg text-[14px] text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#71717A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">URL</label>
            <div className="flex h-10 bg-[#101010] border border-[#3F3F46] rounded-lg overflow-hidden focus-within:border-[#71717A] transition-colors">
              <span className="flex items-center px-3 border-r border-[#3F3F46] text-[#52525B] text-[13px] whitespace-nowrap">cal.com/user/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder={autoSlug(title) || 'quick-chat'}
                className="flex-1 px-3 bg-transparent text-[14px] text-white placeholder:text-[#52525B] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">Duration</label>
            <div className="grid grid-cols-3 gap-2">
              {[15, 30, 60].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setLength(m)}
                  className={`py-2 rounded-lg text-[14px] font-semibold border transition-all ${
                    length === m
                      ? 'bg-white border-white text-[#111827]'
                      : 'bg-transparent border-[#3F3F46] text-[#A1A1AA] hover:border-[#71717A] hover:text-white'
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-lg border border-[#3F3F46] bg-transparent text-[14px] font-semibold text-[#A1A1AA] hover:border-[#71717A] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 h-10 rounded-lg bg-white text-[14px] font-semibold text-[#111827] hover:bg-[#f4f4f5] transition-colors disabled:opacity-50"
            >
              {saving ? 'Creating…' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main page ────────────────────────────────────────────────────────────────
export default function EventTypes() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const username = user?.username || 'john';
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast]     = useState(null);
  const [search, setSearch]   = useState('');

  useEffect(() => { loadEvents(); }, []);

  const loadEvents = async () => {
    try {
      const r = await api.get('/event-types');
      setEvents(r.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopy = (slug) => {
    navigator.clipboard.writeText(`${window.location.origin}/${username}/${slug}`);
    showToast('Link copied!');
  };

  const handleToggle = async (event) => {
    await api.patch(`/event-types/${event._id}`, { hidden: !event.hidden });
    loadEvents();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this event type?')) return;
    await api.delete(`/event-types/${id}`);
    loadEvents();
  };

  const handleReorder = async (id, direction) => {
    // Optimistic UI update
    const idx = events.findIndex(e => e._id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= events.length) return;

    const newEvents = [...events];
    const temp = newEvents[idx];
    newEvents[idx] = newEvents[targetIdx];
    newEvents[targetIdx] = temp;
    setEvents(newEvents);

    try {
      await api.patch(`/event-types/${id}/reorder`, { direction });
    } catch {
      loadEvents(); // Revert on failure
    }
  };

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.slug.toLowerCase().includes(search.toLowerCase())
  );

  // ── Search + New button (passed as actions to DashboardLayout) ──
  const actions = (
    <>
      <div className="hidden sm:flex items-center gap-2 h-9 px-3 bg-[#1A1A1A] border border-[#3F3F46] rounded-lg">
        <Search className="w-4 h-4 text-[#52525B]" />
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-[13px] text-white placeholder:text-[#52525B] focus:outline-none w-36"
        />
      </div>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1.5 h-9 px-4 bg-white text-[#111827] text-[13px] font-semibold rounded-lg hover:bg-[#f4f4f5] transition-colors shadow-sm"
      >
        <Plus className="w-4 h-4" />
        New
      </button>
    </>
  );

  return (
    <DashboardLayout
      title="Event types"
      subtitle="Configure different events for people to book on your calendar."
      actions={actions}
    >
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#1A1A1A] border border-[#3F3F46] text-white px-5 py-2.5 rounded-xl shadow-2xl z-[500] animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-[13px] font-semibold">{toast}</span>
        </div>
      )}

      {loading ? (
        <div className="border border-[#2B2B2B] rounded-xl overflow-hidden">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[80px] border-b border-[#2B2B2B] last:border-0 animate-pulse bg-[#1A1A1A]" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="border border-[#2B2B2B] rounded-xl overflow-hidden bg-[#141414]">
          {filtered.map((evt, i) => (
            <EventTypeRow
              key={evt._id}
              index={i}
              event={evt}
              username={username}
              isFirst={i === 0}
              isLast={i === filtered.length - 1}
              onEdit={(e) => navigate(`/dashboard/event-types/${e._id}`)}
              onCopy={handleCopy}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onMoveUp={(id) => handleReorder(id, 'up')}
              onMoveDown={(id) => handleReorder(id, 'down')}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border-2 border-dashed border-[#2B2B2B] rounded-xl p-14 text-center hover:border-[#3F3F46] transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-[#1A1A1A] grid place-items-center mx-auto mb-4">
            <Plus className="w-6 h-6 text-[#52525B]" />
          </div>
          <h3 className="text-[16px] font-bold text-white mb-2">Create your first event type</h3>
          <p className="text-[#71717A] text-[13px] mb-8 max-w-xs mx-auto">
            Event types are the building blocks of your scheduling.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 h-9 px-5 bg-white text-[#111827] text-[13px] font-semibold rounded-lg hover:bg-[#f4f4f5] transition-colors"
          >
            <Plus className="w-4 h-4" />
            New event type
          </button>
        </motion.div>
      )}

      {showModal && (
        <NewEventModal
          onClose={() => setShowModal(false)}
          onCreated={(id) => { setShowModal(false); navigate(`/dashboard/event-types/${id}`); }}
        />
      )}
    </DashboardLayout>
  );
}
