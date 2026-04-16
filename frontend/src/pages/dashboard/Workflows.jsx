import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Zap, Plus, Mail, MessageSquare, Phone } from 'lucide-react';

// ── Template data ─────────────────────────────────────────────────────────────
const CALAI_TEMPLATES = [
  { icon: 'phone', title: 'Call to confirm booking',      timing: '2 hrs before event starts' },
  { icon: 'phone', title: 'Follow up with no shows',      timing: '30m after event ends' },
  { icon: 'phone', title: 'Remind attendees to bring ID', timing: '1 day before event starts' },
];

const STANDARD_TEMPLATES = [
  { icon: 'sms',   title: 'Send SMS reminder',         timing: '24 hours before event starts' },
  { icon: 'sms',   title: 'Follow up with no shows',   timing: '30m after event ends' },
  { icon: 'email', title: 'Remind attendees to bring ID', timing: '1 day before event starts' },
  { icon: 'email', title: 'Email reminder',             timing: '1 hour before event starts' },
  { icon: 'email', title: 'Custom email reminder',      timing: 'Event is rescheduled to host' },
  { icon: 'sms',   title: 'Custom SMS reminder',        timing: 'When event is scheduled' },
];

// ── Icon resolver ──────────────────────────────────────────────────────────────
function TemplateIcon({ type }) {
  const base = 'w-8 h-8 shrink-0 flex items-center justify-center rounded-md bg-[#2B2B2B] text-[#A1A1AA]';
  if (type === 'phone') return <div className={base}><Phone className="w-4 h-4" /></div>;
  if (type === 'sms')   return <div className={base}><MessageSquare className="w-4 h-4" /></div>;
  return <div className={base}><Mail className="w-4 h-4" /></div>;
}

// ── Template card ─────────────────────────────────────────────────────────────
function TemplateCard({ item }) {
  return (
    <button className="flex items-center gap-3 text-left px-4 py-4 bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl hover:border-[#3F3F46] transition-colors group w-full">
      <TemplateIcon type={item.icon} />
      <div className="min-w-0">
        <p className="text-[13.5px] font-bold text-white truncate">{item.title}</p>
        <p className="text-[12px] text-[#71717A] mt-0.5">{item.timing}</p>
      </div>
    </button>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({ children }) {
  return <h2 className="text-[15px] font-bold text-white mb-3">{children}</h2>;
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function Workflows() {
  const [workflows, setWorkflows] = useState([]);

  return (
    <DashboardLayout title="Workflows" subtitle="Automate notifications and follow-ups for your events.">
      <div className="max-w-4xl space-y-10">

        {/* ── Empty state hero ─────────────────────────────────── */}
        <div className="flex flex-col items-center text-center pt-6 pb-4">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#2B2B2B] flex items-center justify-center mb-5">
            <Zap className="w-7 h-7 text-[#A1A1AA]" />
          </div>

          <h2 className="text-[22px] font-bold text-white mb-3">Workflows</h2>
          <p className="text-[14px] text-[#71717A] max-w-sm leading-relaxed mb-6">
            Workflows enable simple automation to send notifications &amp; reminders enabling you to build processes around your events.
          </p>

          {/* CTA button */}
          <button
            onClick={() => alert('Create workflow — coming soon!')}
            className="flex items-center gap-2 h-10 px-5 bg-white text-[#111827] text-[14px] font-semibold rounded-full hover:bg-[#F4F4F5] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create a workflow
          </button>
        </div>

        {/* ── Cal.ai templates ─────────────────────────────────── */}
        <section>
          <SectionHeading>Cal.ai templates</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {CALAI_TEMPLATES.map((t, i) => <TemplateCard key={i} item={t} />)}
          </div>
        </section>

        {/* ── Standard templates ───────────────────────────────── */}
        <section>
          <SectionHeading>Standard templates</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {STANDARD_TEMPLATES.map((t, i) => <TemplateCard key={i} item={t} />)}
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
}
