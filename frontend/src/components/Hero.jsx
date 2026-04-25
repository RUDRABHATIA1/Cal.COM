import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Globe, MapPin, ChevronRight, Check } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function BookingWidget() {
  const [selectedDuration, setSelectedDuration] = useState('30m');
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
      className="bg-white rounded-[32px] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.12)] overflow-hidden w-full max-w-[620px] flex flex-col md:flex-row border border-gray-100"
    >
      {/* Left panel - Host Info */}
      <div className="w-full md:w-64 p-8 border-b md:border-b-0 md:border-r border-gray-50 bg-gray-50/30">
        <div className="relative mb-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-16 h-16 rounded-3xl bg-black flex items-center justify-center text-white text-2xl font-bold shadow-lg"
          >
            J
          </motion.div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white" />
        </div>
        
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">John Doe</p>
        <h3 className="text-xl font-bold text-black mb-4 leading-tight">30-min Video Consultation</h3>
        <p className="text-[14px] text-gray-500 mb-8 leading-relaxed font-medium">
          Quick sync to discuss project requirements and next steps.
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-600 font-bold text-xs uppercase tracking-tighter">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{selectedDuration} duration</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600 font-bold text-xs uppercase tracking-tighter">
            <Globe className="w-4 h-4 text-gray-400" />
            <span>GMT +5:30</span>
          </div>
        </div>
      </div>

      {/* Right panel - Dynamic Calendar */}
      <div className="flex-1 p-8 hero-calendar-wrapper">
        <Calendar 
          onChange={setSelectedDate} 
          value={selectedDate}
          className="border-0 w-full"
          view="month"
          prev2Label={null}
          next2Label={null}
        />

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-10 py-4 bg-black text-white rounded-2xl font-bold shadow-2xl shadow-black/20 transition-all hover:bg-gray-900"
        >
          Confirm Availability
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <div className="relative bg-[#F9F9F9] min-h-screen pt-32 pb-20 overflow-hidden text-black">
      
      {/* ── Background Elements ───────────────────────────── */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-white/80 to-transparent pointer-events-none" />
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-200px] left-[-200px] w-[600px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="flex flex-col lg:flex-row items-center gap-16 xl:gap-24">
          
          {/* ── Content Left ─────────────────────────────── */}
          <div className="flex-1 max-w-2xl text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm mb-10 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-[13px] font-bold text-gray-900">v6.4 is now live</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black text-black leading-[0.9] tracking-[-0.05em] mb-8"
            >
              Scheduling <br />
              <span className="text-gray-300">infrastructure</span> <br />
              for everyone.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed mb-12 max-w-xl mx-auto lg:mx-0"
            >
              The open-source scheduling infrastructure that gives you full control over your calendar and bookings.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center gap-4 lg:justify-start justify-center"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="h-14 px-8 bg-black text-white rounded-2xl font-bold shadow-xl shadow-black/10 flex items-center gap-3"
              >
                Get Started for Free <ChevronRight className="w-4 h-4" />
              </motion.button>
              <button className="h-14 px-8 bg-white text-gray-600 rounded-2xl font-bold border border-gray-100 hover:bg-gray-50 transition-colors">
                Book a Demo
              </button>
            </motion.div>
          </div>

          {/* ── Visual Right ─────────────────────────────── */}
          <div className="flex-1 w-full flex justify-center perspective-1000">
            <motion.div
              initial={{ rotateX: 15, rotateY: -15, opacity: 0 }}
              animate={{ rotateX: 0, rotateY: 0, opacity: 1 }}
              transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
              className="w-full max-w-[560px]"
            >
              <BookingWidget />
            </motion.div>
          </div>
        </div>

        {/* ── Social Proof ─────────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-32 pt-12 border-t border-gray-100/60"
        >
          <p className="text-center text-[12px] font-bold uppercase tracking-[0.2em] text-gray-300 mb-12">
            Powering the world's most scheduled teams
          </p>
          
          <div className="relative w-full overflow-hidden">
            {/* Faded edges mask */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#F9F9F9] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#F9F9F9] to-transparent z-10 pointer-events-none" />
            
            <div className="flex w-fit animate-marquee hover:[animation-play-state:paused] grayscale opacity-40">
              {/* Double the list for seamless loop */}
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-20 px-10">
                  {['PlanetScale', 'Coinbase', 'Storyblok', 'AngelList', 'Raycast', 'Deel', 'Framer', 'Twilio', 'Vercel', 'Linear'].map(name => (
                    <span key={`${i}-${name}`} className="text-2xl font-black tracking-tighter text-black whitespace-nowrap">
                      {name}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }

        /* Hero Calendar Customization */
        .hero-calendar-wrapper .react-calendar {
          background: transparent;
          border: none;
          font-family: inherit;
          width: 100% !important;
        }
        .hero-calendar-wrapper .react-calendar__navigation {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          height: auto;
        }
        /* Move the month/year label to the left and buttons to the right */
        .hero-calendar-wrapper .react-calendar__navigation__label {
          flex-grow: 0 !important;
          font-weight: 800 !important;
          font-size: 1.125rem !important;
          color: #000 !important;
          padding: 0 !important;
          background: none !important;
          pointer-events: none;
        }
        .hero-calendar-wrapper .react-calendar__navigation__arrow {
          flex-grow: 0;
          min-width: 32px !important;
          height: 32px !important;
          border: none !important;
          border-radius: 8px !important;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-left: 4px;
          background: transparent !important;
        }
        .hero-calendar-wrapper .react-calendar__navigation__arrow:hover {
          background: #f3f4f6 !important;
        }
        .hero-calendar-wrapper .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: 800;
          font-size: 10px;
          letter-spacing: 0.1em;
          color: #d1d5db;
          margin-bottom: 1rem;
        }
        .hero-calendar-wrapper .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
        }
        .hero-calendar-wrapper .react-calendar__tile {
          aspect-ratio: 1/1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          border-radius: 12px;
          transition: all 0.2s;
          color: #374151;
          background: none !important;
          padding: 0 !important;
        }
        .hero-calendar-wrapper .react-calendar__tile--now {
          color: #000;
          font-weight: 900;
        }
        .hero-calendar-wrapper .react-calendar__tile--active {
          background: #000 !important;
          color: #fff !important;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
          transform: scale(1.05);
        }
        .hero-calendar-wrapper .react-calendar__tile:hover:not(.react-calendar__tile--active) {
          background: #f9fafb !important;
        }
        .hero-calendar-wrapper .react-calendar__tile--neighboringMonth {
          display: none; /* Keep it clean like the static version */
        }
        .hero-calendar-wrapper .react-calendar__month-view__days {
          gap: 4px;
        }
      `}</style>
    </div>
  );
}
