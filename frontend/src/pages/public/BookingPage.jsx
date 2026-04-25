import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Globe, ChevronLeft, CheckCircle2, Calendar as CalendarIcon, Loader2, User, Mail, MessageSquare, AlertCircle } from 'lucide-react';
import api from '../../utils/api';
import { format, addMinutes, parse, isAfter, isBefore } from 'date-fns';

export default function BookingPage() {
  const { username, slug } = useParams();
  const [searchParams] = useSearchParams();
  const rescheduleId = searchParams.get('rescheduleId');

  const [data, setData] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [rescheduleData, setRescheduleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [step, setStep] = useState(1); 
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({ name: '', email: '', notes: '' });

  useEffect(() => {
    fetchEventDetails();
    if (rescheduleId) fetchRescheduleDetails();
  }, [username, slug, rescheduleId]);

  useEffect(() => {
    if (data && selectedDate) {
      fetchSlotsForDate();
    }
  }, [selectedDate, data]);

  const fetchRescheduleDetails = async () => {
    try {
      const res = await api.get(`/bookings/public/booking/${rescheduleId}`);
      setRescheduleData(res.data);
      setForm({
        name: res.data.attendeeName,
        email: res.data.attendeeEmail,
        notes: res.data.notes || ''
      });
    } catch (err) {
      console.error('Failed to fetch reschedule details');
    }
  };

  const fetchEventDetails = async () => {
    try {
      const res = await api.get(`/bookings/public/${username}/${slug}`);
      setData(res.data);
      const availRes = await api.get(`/availability/public/${res.data.host.id}`);
      setAvailability(availRes.data);
    } catch (err) {
      console.error('Failed to fetch event details', err);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const fetchSlotsForDate = async () => {
    if (!data || !availability) return;
    setSlotsLoading(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const busyRes = await api.get(`/bookings/public/slots/${data.host.id}/${dateStr}`);
      calculateAvailableSlots(availability, busyRes.data);
    } catch (err) {
      console.error('Failed to fetch busy slots', err);
    } finally {
      setSlotsLoading(false);
    }
  };

  const calculateAvailableSlots = (avail, busy) => {
    const dayOfWeek = format(selectedDate, 'EEEE');
    const dayConfig = avail.days.find(d => d.day === dayOfWeek);
    if (!dayConfig || !dayConfig.enabled) { setAvailableSlots([]); return; }

    const slots = [];
    const eventLength = data.eventType.length;
    let current = parse(dayConfig.startTime, 'HH:mm', selectedDate);
    const end = parse(dayConfig.endTime, 'HH:mm', selectedDate);

    while (isBefore(current, end)) {
      const slotEnd = addMinutes(current, eventLength);
      const isBusy = busy.some(b => {
        const bStart = new Date(b.startTime);
        const bEnd = new Date(b.endTime);
        return (isBefore(current, bEnd) && isAfter(slotEnd, bStart));
      });
      if (!isBusy) slots.push(format(current, 'HH:mm'));
      current = addMinutes(current, eventLength);
    }
    setAvailableSlots(slots);
  };

  const handleBooking = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      const startTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      startTime.setHours(parseInt(hours), parseInt(minutes), 0);
      const endTime = addMinutes(startTime, data.eventType.length);

      if (rescheduleId) {
        await api.patch(`/bookings/${rescheduleId}/reschedule`, { startTime, endTime });
      } else {
        await api.post('/bookings', {
          eventTypeId: data.eventType.id,
          attendeeName: form.name,
          attendeeEmail: form.email,
          startTime,
          endTime,
          notes: form.notes
        });
      }
      setStep(4);
    } catch (err) {
      alert('Failed to process booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-20 h-20 bg-white/5 border border-white/10 rounded-[28px] flex items-center justify-center shadow-2xl"
        >
          <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/40 mt-10 text-[11px] font-bold tracking-[0.2em] uppercase">Syncing availability</motion.p>
      </div>
    );
  }

  if (!data) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white/50">404 - Scheduling link expired.</div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-white/20">
      
      {/* ── Background decoration ────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/[0.03] blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/[0.03] blur-[150px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto min-h-screen flex items-center justify-center p-0 sm:p-4 md:p-8">
        <motion.div 
          layout
          initial="initial" animate="animate" variants={containerVariants}
          className="w-full bg-[#111111]/80 backdrop-blur-3xl border-0 sm:border border-white/10 rounded-none sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-screen sm:min-h-[640px]"
        >
          {/* ── Left Column: Host Details ────────────────────── */}
          <div className="w-full md:w-[380px] p-6 sm:p-10 border-b md:border-b-0 md:border-r border-white/5 flex flex-col bg-white/[0.02]">
            {rescheduleId && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="text-[12px] sm:text-[13px] text-amber-200/80 leading-relaxed font-medium">
                  <strong>Rescheduling</strong><br />
                  You are changing the time of your meeting with {data.host.name}.
                </div>
              </motion.div>
            )}

            <div className="mb-6 sm:mb-10">
              <div className="flex items-center gap-4 mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-lg sm:text-xl font-black uppercase text-white shadow-inner">
                  {data.host.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white/30 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] mb-0.5">{data.host.username}</p>
                  <p className="text-lg sm:text-xl font-bold text-white/95">{data.host.name}</p>
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent mb-4 sm:mb-5 leading-[1.15] font-cal tracking-tight">
                {data.eventType.title}
              </h1>
              <p className="text-white/50 text-[14px] sm:text-[15px] leading-relaxed line-clamp-4">
                {data.eventType.description || 'No description provided.'}
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6 flex-1">
              <div className="flex items-center gap-4 text-white/70">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 grid place-items-center"><Clock className="w-4 h-4" /></div>
                <span className="text-[14px] sm:text-[15px] font-semibold">{data.eventType.length} minutes</span>
              </div>
              <div className="flex items-center gap-4 text-white/70">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 grid place-items-center"><Globe className="w-4 h-4" /></div>
                <span className="text-[14px] sm:text-[15px] font-semibold truncate">{availability?.timezone || 'Universal Time'}</span>
              </div>
            </div>

            {step > 1 && step < 4 && (
              <button onClick={() => setStep(step - 1)} className="mt-8 sm:mt-12 group flex items-center gap-3 text-white/30 hover:text-white transition-all text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </div>
                Go Back
              </button>
            )}
          </div>

          {/* ── Right Column: Step Logic ──────────────────────── */}
          <div className="flex-1 p-6 sm:p-10 flex flex-col relative">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="h-full flex flex-col">
                  <div className="mb-6 sm:mb-10">
                    <h2 className="text-xl sm:text-2xl font-bold text-white font-cal tracking-tight">Select a date</h2>
                    <p className="text-white/40 text-[13px] sm:text-[14px] mt-1.5 font-medium">Choose a day that works best for you.</p>
                  </div>
                  <div className="custom-calendar-container flex-1"><Calendar onChange={setSelectedDate} value={selectedDate} minDate={new Date()} className="premium-calendar" /></div>
                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => setStep(2)} className="w-full mt-8 sm:mt-10 py-4 sm:py-5 bg-white text-black rounded-xl sm:rounded-2xl font-black text-sm tracking-wide shadow-[0_10px_40px_rgba(255,255,255,0.1)]">Select Time</motion.button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="h-full flex flex-col">
                  <div className="mb-6 sm:mb-10 flex items-end justify-between">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white font-cal tracking-tight">Select a time</h2>
                      <p className="text-white/40 text-[12px] sm:text-[14px] mt-1.5 font-bold uppercase tracking-widest">{format(selectedDate, 'EEEE, MMM do')}</p>
                    </div>
                    {slotsLoading && <Loader2 className="w-5 h-5 animate-spin text-white/40" />}
                  </div>
                  
                  <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="grid grid-cols-2 gap-2 sm:gap-3 overflow-y-auto pr-1 flex-1 scroll-smooth no-scrollbar" style={{ maxHeight: '420px' }}>
                    {availableSlots.length > 0 ? (
                      availableSlots.map(time => (
                        <motion.button key={time} variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} onClick={() => setSelectedTime(time)}
                          className={`group relative py-4 sm:py-5 rounded-xl sm:rounded-2xl border transition-all ${
                            selectedTime === time 
                              ? 'bg-white border-white text-black shadow-2xl shadow-white/20' 
                              : 'border-white/5 bg-white/[0.04] text-white/70 hover:border-white/20 hover:bg-white/[0.08]'
                          }`}
                        >
                          <span className="text-[14px] sm:text-[15px] font-bold tracking-tight">{time}</span>
                        </motion.button>
                      ))
                    ) : (
                      <div className="col-span-2 py-16 sm:py-20 text-center flex flex-col items-center gap-4 sm:gap-6 border border-dashed border-white/10 rounded-[24px] sm:rounded-[32px] bg-white/[0.02]">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/5 grid place-items-center"><CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white/20" /></div>
                        <p className="text-white/20 font-bold tracking-wide uppercase text-[10px] sm:text-[11px]">No slots available</p>
                      </div>
                    )}
                  </motion.div>
                  
                  <motion.button disabled={!selectedTime} whileHover={selectedTime ? { scale: 1.01 } : {}} whileTap={selectedTime ? { scale: 0.99 } : {}}
                    onClick={() => rescheduleId ? handleBooking() : setStep(3)}
                    className="w-full mt-8 sm:mt-10 py-4 sm:py-5 bg-white text-black rounded-xl sm:rounded-2xl font-black text-sm tracking-wide disabled:opacity-20 shadow-[0_10px_40px_rgba(255,255,255,0.1)]"
                  >
                    {rescheduleId ? (isSubmitting ? 'Updating...' : 'Confirm Reschedule') : 'Enter Details'}
                  </motion.button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="max-w-md mx-auto w-full flex flex-col h-full">
                  <div className="mb-8 sm:mb-12 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white font-cal mb-3">Almost there</h2>
                    <p className="text-white/40 text-[14px] sm:text-[15px] font-medium leading-relaxed">Please verify your details below to confirm.</p>
                  </div>
                  
                  <form onSubmit={handleBooking} className="space-y-4 sm:space-y-6 flex-1">
                    <div className="space-y-3 sm:space-y-4">
                      <FormInput icon={<User />} value={form.name} onChange={v => setForm({...form, name: v})} placeholder="Full Name" />
                      <FormInput icon={<Mail />} value={form.email} onChange={v => setForm({...form, email: v})} placeholder="Email Address" type="email" />
                      <div className="relative">
                        <MessageSquare className="absolute left-5 top-5 w-4 h-4 text-white/20" />
                        <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Additional notes" rows={4}
                          className="w-full pl-14 pr-5 py-4 sm:py-5 bg-white/[0.04] border border-white/10 rounded-[20px] sm:rounded-[24px] focus:border-white/30 focus:bg-white/[0.06] outline-none transition-all resize-none text-[14px] sm:text-[15px]" />
                      </div>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full mt-auto py-4 sm:py-5 bg-white text-black rounded-xl sm:rounded-2xl font-black shadow-2xl flex items-center justify-center gap-3">
                      {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Confirm Booking <ChevronLeft className="w-4 h-4 rotate-180 stroke-[3]" /></>}
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center p-4 sm:p-10">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-500/10 border border-green-500/20 rounded-[30px] sm:rounded-[40px] flex items-center justify-center text-green-400 mb-8 sm:mb-12 shadow-[0_0_50px_rgba(52,211,153,0.1)]">
                    <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white font-cal mb-4 sm:mb-5 tracking-tight">{rescheduleId ? 'Successfully Rescheduled!' : 'Perfectly Timed!'}</h2>
                  <p className="text-white/50 mb-8 sm:mb-12 text-[15px] sm:text-[17px] leading-relaxed max-w-sm">
                    {rescheduleId ? 'Your meeting has been moved.' : 'Check your inbox for the calendar invite.'} We've updated <span className="text-white font-bold">{form.email}</span>.
                  </p>
                  <div className="w-full max-w-sm bg-white/[0.04] border border-white/5 rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 text-left space-y-4 sm:space-y-5">
                    <SummaryRow label="Host" val={data.host.name} />
                    <SummaryRow label="New Time" val={`${format(selectedDate, 'MMM do')}, ${selectedTime}`} />
                  </div>
                  <button onClick={() => window.location.href = '/dashboard/bookings'} className="mt-8 sm:mt-12 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white transition-all">Back to Dashboard</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <style>{`
        .premium-calendar { background: transparent !important; border: none !important; color: #fff !important; width: 100% !important; font-family: inherit !important; }
        .premium-calendar .react-calendar__navigation { margin-bottom: 1.5rem; background: rgba(255,255,255,0.03); border-radius: 16px; padding: 4px; }
        @media (min-width: 640px) { .premium-calendar .react-calendar__navigation { margin-bottom: 2.5rem; border-radius: 20px; padding: 6px; } }
        .premium-calendar .react-calendar__navigation button { color: #fff; font-weight: 800; border-radius: 12px; padding: 10px 0; font-family: "Cal Sans", sans-serif; }
        .premium-calendar .react-calendar__navigation button:hover { background: rgba(255,255,255,0.08); }
        .premium-calendar .react-calendar__month-view__weekdays { font-size: 0.65rem; color: rgba(255,255,255,0.2); font-weight: 900; text-transform: uppercase; margin-bottom: 1rem; letter-spacing: 0.1em; }
        .premium-calendar .react-calendar__month-view__weekdays__weekday { display: flex; justify-content: center; }
        .premium-calendar .react-calendar__tile { color: rgba(255,255,255,0.6); aspect-ratio: 1; border-radius: 12px; font-weight: 700; font-size: 0.85rem; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); margin-bottom: 4px; padding: 8px; }
        @media (min-width: 640px) { .premium-calendar .react-calendar__tile { border-radius: 16px; font-size: 0.95rem; } }
        .premium-calendar .react-calendar__tile:enabled:hover { background: rgba(255,255,255,0.1); color: #fff; transform: translateY(-2px); }
        .premium-calendar .react-calendar__tile--now { background: rgba(255,255,255,0.05); color: #fff; font-weight: 900; }
        .premium-calendar .react-calendar__tile--active { background: white !important; color: black !important; font-weight: 900; transform: scale(1.1) !important; box-shadow: 0 10px 40px rgba(255,255,255,0.2) !important; z-index: 10; }
        .premium-calendar .react-calendar__month-view__days__day--neighboringMonth { opacity: 0.05; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

function FormInput({ icon, ...props }) {
  return (
    <div className="relative">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20">{icon}</div>
      <input {...props} onChange={e => props.onChange(e.target.value)}
        className="w-full pl-14 pr-5 py-5 bg-white/[0.04] border border-white/10 rounded-[24px] focus:border-white/30 focus:bg-white/[0.06] outline-none transition-all text-[15px]" required />
    </div>
  );
}

function SummaryRow({ label, val }) {
  return (
    <div className="flex justify-between items-center text-[13px]">
      <span className="text-white/30 font-bold uppercase tracking-widest text-[10px]">{label}</span>
      <span className="font-bold text-white/90">{val}</span>
    </div>
  );
}
