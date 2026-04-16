import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { Phone, Search, SlidersHorizontal, ArrowRight } from 'lucide-react';

// ── Fake chart (CSS-only dot chart matching the screenshot) ──────────────────
function FakeChart() {
  const cols = [
    { label: '08hr', val: 12, color1: '#4ADE80', color2: '#FB923C' },
    { label: '09hr', val: 24, color1: '#4ADE80', color2: '#FB923C' },
    { label: '10hr', val: 32, color1: '#4ADE80', color2: '#FB923C' },
    { label: '11hr', val: 32, color1: '#FB923C', color2: '#4ADE80' },
    { label: '12hr', val: 8,  color1: '#4ADE80', color2: '#F87171' },
    { label: '13hr', val: 12, color1: '#4ADE80', color2: '#FB923C' },
    { label: '14hr', val: 32, color1: '#FB923C', color2: '#F87171' },
    { label: '15hr', val: 40, color1: '#4ADE80', color2: '#FB923C' },
    { label: '16hr', val: 12, color1: '#4ADE80', color2: '#F87171' },
  ];
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm w-full">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold text-[#6B7280]">Booking hours – by available hours</span>
      </div>
      {/* Top numbers */}
      <div className="flex gap-1 mb-1 pl-2">
        {cols.map(c => (
          <div key={c.label} className="flex-1 text-center text-[10px] text-[#9CA3AF] font-medium">{c.val}</div>
        ))}
      </div>
      {/* Dot columns */}
      <div className="flex gap-1 items-end h-32 pl-2 mb-1">
        {cols.map(c => {
          const dots = Math.round(c.val / 4);
          return (
            <div key={c.label} className="flex-1 flex flex-col justify-end gap-0.5">
              {Array.from({ length: dots }).map((_, i) => (
                <div key={i}
                  style={{ background: i % 2 === 0 ? c.color1 : c.color2 }}
                  className="w-full rounded-sm"
                  style={{ height: 6, background: i % 2 === 0 ? c.color1 : c.color2 }}
                />
              ))}
            </div>
          );
        })}
      </div>
      {/* Bottom labels */}
      <div className="flex gap-1 pl-2">
        {cols.map(c => (
          <div key={c.label} className="flex-1 text-center text-[9px] text-[#9CA3AF]">{c.label}</div>
        ))}
      </div>
      {/* No-show section */}
      <div className="mt-4 border-t border-[#F3F4F6] pt-3">
        <p className="text-[11px] font-semibold text-[#6B7280] mb-2">No-show</p>
        {['Jordan Cook', 'James Corcoran'].map(name => (
          <div key={name} className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-full bg-[#E5E7EB] shrink-0" />
            <span className="text-[11px] text-[#9CA3AF]">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Paywall card (shared by Bookings, Routing, Router position, Wrong routing) ─
function InsightsPaywall() {
  return (
    <div className="max-w-4xl">
      <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl overflow-hidden flex flex-col md:flex-row gap-8 p-8 md:p-10">
        {/* Left — copy */}
        <div className="flex-1 flex flex-col justify-center">
          <span className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider mb-4">Insights</span>
          <h2 className="text-[22px] font-extrabold text-white leading-snug mb-3">
            See what's getting booked, and what's not
          </h2>
          <p className="text-[13px] text-[#71717A] leading-relaxed mb-5">
            Turn booking data into clarity for you and your team so you can spot gaps, balance workload, and make better scheduling decisions.
          </p>
          <ul className="space-y-2 mb-7">
            {[
              'Understand booking volume and cancellations',
              'See how meetings are distributed across team members',
              'Spot trends that help you improve availability and routing',
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-[13px] text-[#A1A1AA]">
                <span className="text-[#71717A] mt-1 shrink-0">·</span>
                {item}
              </li>
            ))}
          </ul>
          {/* Available on badges */}
          <div className="flex items-center gap-2 mb-7">
            <span className="text-[12px] text-[#71717A]">Available on</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#1D4ED8] text-white text-[11px] font-bold">Teams</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#7C3AED] text-white text-[11px] font-bold">Orgs</span>
          </div>
          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 h-10 px-5 bg-white text-[#111827] text-[13px] font-bold rounded-full hover:bg-[#F4F4F5] transition-colors">
              Try it for free <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button className="text-[13px] text-[#A1A1AA] font-semibold hover:text-white transition-colors">
              Learn more
            </button>
          </div>
        </div>

        {/* Right — chart mockup */}
        <div className="w-full md:w-[320px] shrink-0">
          <FakeChart />
        </div>
      </div>
    </div>
  );
}

// ── Call history empty state ──────────────────────────────────────────────────
function CallHistoryPage() {
  return (
    <DashboardLayout
      title="Insights"
      subtitle="View booking insights across your events"
      actions={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1A1A] border border-[#2B2B2B] rounded-lg w-44">
            <Search className="w-3.5 h-3.5 text-[#52525B] shrink-0" />
            <span className="text-[13px] text-[#52525B]">Search</span>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1A1A] border border-[#2B2B2B] rounded-lg text-[13px] text-[#A1A1AA] hover:text-white transition-colors">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Display
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center py-24 border border-[#2B2B2B] rounded-xl bg-[#141414] text-center max-w-3xl">
        <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#2B2B2B] flex items-center justify-center mb-6">
          <Phone className="w-7 h-7 text-[#71717A]" />
        </div>
        <h3 className="text-[17px] font-bold text-white mb-2">No call history</h3>
        <p className="text-[13px] text-[#71717A] max-w-xs mb-6 leading-relaxed">
          Create your first Cal.ai workflow and{' '}
          <span className="text-white">view your call history here.</span>
        </p>
        <button className="h-10 px-6 border border-[#3F3F46] rounded-full text-[13px] font-semibold text-white hover:bg-[#1A1A1A] transition-colors">
          Create a Cal.ai workflow
        </button>
      </div>
    </DashboardLayout>
  );
}

// ── Paywall wrapper ───────────────────────────────────────────────────────────
function PaywallPage() {
  return (
    <DashboardLayout
      title="Insights"
      subtitle="View booking insights across your events"
    >
      <InsightsPaywall />
    </DashboardLayout>
  );
}

// ── Router ────────────────────────────────────────────────────────────────────
export default function Insights() {
  const location = useLocation();

  if (location.pathname === '/dashboard/insights' || location.pathname === '/dashboard/insights/') {
    return <Navigate to="/dashboard/insights/bookings" replace />;
  }
  if (location.pathname === '/dashboard/insights/call-history') {
    return <CallHistoryPage />;
  }
  return <PaywallPage />;
}
