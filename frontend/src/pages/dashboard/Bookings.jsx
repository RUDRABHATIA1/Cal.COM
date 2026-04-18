import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Filter, ChevronDown, Clock, ExternalLink,
  Mail, Search, Video, Phone, MapPin, CheckCircle2,
  XCircle, AlertCircle, MoreHorizontal, X, Ban
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

const TABS = ['Upcoming', 'Unconfirmed', 'Recurring', 'Past', 'Cancelled'];

const STATUS_ICON = {
  ACCEPTED:  <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  PENDING:   <AlertCircle  className="w-4 h-4 text-amber-400" />,
  CANCELLED: <XCircle      className="w-4 h-4 text-red-400" />,
};

function formatBookingDate(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  const day = isToday(s) ? 'Today' : isTomorrow(s) ? 'Tomorrow' : format(s, 'EEE, MMM d');
  return `${day}, ${format(s, 'h:mm a')} – ${format(e, 'h:mm a')}`;
}

const locationIcon = (loc = '') => {
  const l = loc.toLowerCase();
  if (l.includes('zoom') || l.includes('meet') || l.includes('video')) return <Video className="w-3.5 h-3.5" />;
  if (l.includes('phone') || l.includes('call')) return <Phone className="w-3.5 h-3.5" />;
  return <MapPin className="w-3.5 h-3.5" />;
};

/* ── Cancel Booking Modal ────────────────────────────────────────────────── */
function CancelModal({ booking, onClose, onCancelled }) {
  const [reason, setReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await api.patch(`/bookings/${booking._id}/cancel`, { reason });
      onCancelled();
    } catch (err) {
      alert('Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1A1A1A] border border-[#3F3F46] rounded-2xl w-full max-w-[460px] shadow-2xl"
      >
        <div className="px-7 pt-7 pb-5 border-b border-[#2B2B2B]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <Ban className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-white">Cancel Booking</h2>
              <p className="text-[#71717A] text-[13px]">This action cannot be undone.</p>
            </div>
          </div>
        </div>

        <div className="px-7 py-6 space-y-5">
          {/* Booking summary */}
          <div className="bg-[#141414] border border-[#2B2B2B] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#71717A] uppercase font-bold tracking-wider">Meeting</span>
              <span className="text-[13px] text-white font-semibold">{booking.title || booking.attendeeName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#71717A] uppercase font-bold tracking-wider">When</span>
              <span className="text-[13px] text-[#A1A1AA]">{formatBookingDate(booking.startTime, booking.endTime)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#71717A] uppercase font-bold tracking-wider">Attendee</span>
              <span className="text-[13px] text-[#A1A1AA]">{booking.attendeeEmail}</span>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">
              Reason for cancellation <span className="text-[#52525B]">(optional)</span>
            </label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Let the attendee know why you're cancelling..."
              rows={3}
              className="w-full px-3 py-2.5 bg-[#101010] border border-[#3F3F46] rounded-lg text-[14px] text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#71717A] transition-colors resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 h-10 rounded-lg border border-[#3F3F46] bg-transparent text-[14px] font-semibold text-[#A1A1AA] hover:border-[#71717A] hover:text-white transition-colors"
            >
              Keep Booking
            </button>
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="flex-1 h-10 rounded-lg bg-red-600 text-[14px] font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {cancelling ? 'Cancelling…' : 'Cancel Booking'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Booking Card ────────────────────────────────────────────────────────── */
function BookingCard({ booking, index, username, onCancelClick }) {
  const eventSlug = booking.eventTypeId?.slug || '30min';
  const rescheduleUrl = `/${username}/${eventSlug}?rescheduleId=${booking._id}`;
  const isCancelled = booking.status === 'CANCELLED';
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [menuOpen]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className={`flex items-start gap-4 px-6 py-5 border-b border-[#2B2B2B] last:border-0 hover:bg-[#1A1A1A] transition-colors group ${isCancelled ? 'opacity-60' : ''}`}
    >
      {/* Status / Avatar circle */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0 mt-0.5 ${
        isCancelled
          ? 'bg-gradient-to-br from-red-500/40 to-red-700/40'
          : 'bg-gradient-to-br from-sky-500 to-blue-600'
      }`}>
        {booking.attendeeName?.[0]?.toUpperCase() || '?'}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className={`text-[14px] font-bold ${isCancelled ? 'text-[#71717A] line-through' : 'text-white'}`}>
            {booking.title || booking.attendeeName}
          </span>
          {STATUS_ICON[booking.status]}
          {booking.status === 'PENDING' && (
            <span className="text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">Unconfirmed</span>
          )}
          {isCancelled && (
            <span className="text-[11px] font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">Cancelled</span>
          )}
        </div>
        <p className="text-[13px] text-[#71717A] mb-1.5">{formatBookingDate(booking.startTime, booking.endTime)}</p>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1 text-[12px] text-[#52525B]">
            <Mail className="w-3.5 h-3.5" /> {booking.attendeeEmail}
          </span>
          {booking.location && (
            <span className="flex items-center gap-1 text-[12px] text-[#52525B]">
              {locationIcon(booking.location)} {booking.location}
            </span>
          )}
        </div>
        {booking.cancellationReason && (
          <p className="text-[12px] text-red-400/70 mt-2 italic">
            Reason: {booking.cancellationReason}
          </p>
        )}
      </div>

      {/* Actions */}
      {!isCancelled && (
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <a
            href={rescheduleUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-semibold bg-[#2B2B2B] text-[#A1A1AA] hover:text-white hover:bg-[#3F3F46] transition-all"
          >
            <Calendar className="w-3.5 h-3.5" />
            Reschedule
          </a>
          {booking.meetingUrl && (
            <a
              href={booking.meetingUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-md text-[#71717A] hover:text-white hover:bg-[#2B2B2B] transition-colors"
              title="Join meeting"
              onClick={e => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {/* More menu with cancel */}
          <div className="relative">
            <button
              onClick={e => { e.stopPropagation(); setMenuOpen(v => !v); }}
              className="p-2 rounded-md text-[#71717A] hover:text-white hover:bg-[#2B2B2B] transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-44 bg-[#1A1A1A] border border-[#3F3F46] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] z-50 py-1"
                onClick={e => e.stopPropagation()}
              >
                <a
                  href={rescheduleUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium text-[#D4D4D8] hover:bg-[#2B2B2B] transition-colors"
                >
                  <Calendar className="w-4 h-4 text-[#71717A]" />
                  Reschedule
                </a>
                <div className="my-1 border-t border-[#3F3F46]" />
                <button
                  onClick={() => { setMenuOpen(false); onCancelClick(booking); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium text-red-400 hover:bg-red-900/20 transition-colors"
                >
                  <XCircle className="w-4 h-4 text-red-400" />
                  Cancel booking
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────────── */
export default function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [search, setSearch] = useState('');
  const [cancelTarget, setCancelTarget] = useState(null);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      console.log('API Bookings Response:', res.data);
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to fetch bookings', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = bookings.filter(b => {
    const now = new Date();
    const start = new Date(b.startTime);
    if (activeTab === 'Upcoming')    return b.status !== 'CANCELLED' && start >= now;
    if (activeTab === 'Unconfirmed') return b.status === 'PENDING';
    if (activeTab === 'Past')        return b.status !== 'CANCELLED' && isPast(start);
    if (activeTab === 'Cancelled')   return b.status === 'CANCELLED';
    return true;
  }).filter(b =>
    !search ||
    b.attendeeName?.toLowerCase().includes(search.toLowerCase()) ||
    b.attendeeEmail?.toLowerCase().includes(search.toLowerCase()) ||
    b.title?.toLowerCase().includes(search.toLowerCase())
  );

  // Sort: upcoming ascending, past/cancelled descending
  const sorted = [...filtered].sort((a, b) => {
    const aTime = new Date(a.startTime).getTime();
    const bTime = new Date(b.startTime).getTime();
    if (activeTab === 'Upcoming' || activeTab === 'Unconfirmed') return aTime - bTime;
    return bTime - aTime;
  });

  // Count badges
  const counts = {
    Upcoming: bookings.filter(b => b.status !== 'CANCELLED' && new Date(b.startTime) >= new Date()).length,
    Unconfirmed: bookings.filter(b => b.status === 'PENDING').length,
    Cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
  };

  return (
    <DashboardLayout
      title="Bookings"
      subtitle="See upcoming and past events booked through your event type links."
      actions={
        <div className="flex items-center gap-2 h-9 px-3 bg-[#1A1A1A] border border-[#3F3F46] rounded-lg">
          <Search className="w-4 h-4 text-[#52525B]" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-[13px] text-white placeholder:text-[#52525B] focus:outline-none w-32"
          />
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center bg-[#101010] border border-[#2B2B2B] rounded-lg p-1">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === tab
                    ? 'bg-[#1E1E1E] text-white border border-[#2B2B2B]'
                    : 'text-[#A1A1AA] hover:text-white hover:bg-[#1A1A1A]'
                }`}
              >
                {tab}
                {counts[tab] > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === tab ? 'bg-[#3F3F46] text-white' : 'bg-[#2B2B2B] text-[#71717A]'
                  }`}>
                    {counts[tab]}
                  </span>
                )}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-[#101010] border border-[#2B2B2B] rounded-lg text-[13px] font-medium text-[#A1A1AA] hover:text-white hover:bg-[#1A1A1A] transition-colors">
            <Filter className="w-3.5 h-3.5" />
            Filter
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Booking list */}
        <div className="border border-[#2B2B2B] rounded-xl overflow-hidden bg-[#141414] min-h-[300px]">
          {loading ? (
            <div className="flex flex-col">
              {[1,2,3].map(i => (
                <div key={i} className="h-[88px] border-b border-[#2B2B2B] last:border-0 animate-pulse bg-[#1A1A1A]" />
              ))}
            </div>
          ) : sorted.length > 0 ? (
            <AnimatePresence>
              <div>
                {sorted.map((b, i) => (
                  <BookingCard
                    key={b._id}
                    booking={b}
                    index={i}
                    username={user?.username}
                    onCancelClick={(booking) => setCancelTarget(booking)}
                  />
                ))}
              </div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center text-center py-20 px-6"
            >
              <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#2B2B2B] flex items-center justify-center mb-6">
                <Calendar className="w-7 h-7 text-[#71717A]" />
              </div>
              <h3 className="text-[16px] font-bold text-white mb-2">No {activeTab.toLowerCase()} bookings</h3>
              <p className="text-[#71717A] text-[13px] max-w-[320px] leading-relaxed">
                You have no {activeTab.toLowerCase()} bookings. As soon as someone books a time with you it will show up here.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      {cancelTarget && (
        <CancelModal
          booking={cancelTarget}
          onClose={() => setCancelTarget(null)}
          onCancelled={() => {
            setCancelTarget(null);
            fetchBookings();
          }}
        />
      )}
    </DashboardLayout>
  );
}
