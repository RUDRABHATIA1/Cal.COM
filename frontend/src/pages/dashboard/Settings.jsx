import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft, Search, User, Settings2, Calendar, Video,
  Palette, Briefcase, Bell, Zap, Shield, KeyRound,
  Users, ShieldCheck, Webhook, Code2, Globe,
  CreditCard, Layers, LogOut, Plus, ExternalLink,
  MoreHorizontal, Bold, Italic, Link as LinkIcon, SlidersHorizontal
} from 'lucide-react';

// ── Shared toggle ─────────────────────────────────────────────────────────────
function Toggle({ on = false, onChange, disabled = false }) {
  return (
    <button onClick={() => !disabled && onChange?.(!on)} disabled={disabled}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
        disabled ? 'opacity-40 cursor-not-allowed' : ''
      } ${on ? 'bg-[#0ea5e9]' : 'bg-[#3F3F46]'}`}>
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

// ── Shared dark select ────────────────────────────────────────────────────────
function DarkSelect({ value, onChange, options }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full h-10 pl-3 pr-8 bg-[#1A1A1A] border border-[#2B2B2B] rounded-lg text-[13px] text-white focus:outline-none focus:border-[#52525B] appearance-none">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <div className="absolute right-2.5 top-3 pointer-events-none text-[#71717A]">⌄</div>
    </div>
  );
}

// ── Dark input ────────────────────────────────────────────────────────────────
function DarkInput({ value, onChange, placeholder, readOnly, prefix }) {
  return (
    <div className="flex h-10 bg-[#1A1A1A] border border-[#2B2B2B] rounded-lg overflow-hidden focus-within:border-[#52525B]">
      {prefix && (
        <span className="flex items-center px-3 text-[13px] text-[#71717A] border-r border-[#2B2B2B] shrink-0 bg-[#141414]">{prefix}</span>
      )}
      <input value={value} onChange={e => onChange?.(e.target.value)} placeholder={placeholder}
        readOnly={readOnly}
        className="flex-1 px-3 bg-transparent text-[13px] text-white focus:outline-none placeholder:text-[#52525B]" />
    </div>
  );
}

// ── Section card ──────────────────────────────────────────────────────────────
function Card({ children, className = '' }) {
  return (
    <div className={`bg-[#141414] border border-[#2B2B2B] rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
}

// ── Toggle row card ───────────────────────────────────────────────────────────
function ToggleCard({ title, desc, defaultOn = false, disabled = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[14px] font-bold text-white mb-0.5">{title}</p>
          <p className="text-[12px] text-[#71717A] leading-relaxed">{desc}</p>
        </div>
        <Toggle on={on} onChange={setOn} disabled={disabled} />
      </div>
    </Card>
  );
}

// ── Update button ─────────────────────────────────────────────────────────────
function UpdateBtn({ label = 'Update', onClick }) {
  return (
    <div className="flex justify-end mt-4">
      <button onClick={onClick}
        className="h-9 px-5 bg-[#2B2B2B] text-white text-[13px] font-semibold rounded-lg hover:bg-[#3F3F46] transition-colors">
        {label}
      </button>
    </div>
  );
}

// ── Label ─────────────────────────────────────────────────────────────────────
function Label({ children }) {
  return <label className="block text-[13px] font-semibold text-white mb-2">{children}</label>;
}

// ══════════════════════════════════════════════════════════════════════════════
// SUB-PAGES
// ══════════════════════════════════════════════════════════════════════════════

// ── PROFILE ───────────────────────────────────────────────────────────────────
function ProfilePage({ user }) {
  const [username, setUsername] = useState(user?.username || 'rudra-bhatia-22egnz');
  const [fullName, setFullName] = useState(user?.name || '');
  const [bio, setBio] = useState('');

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Avatar + basic info */}
      <Card>
        {/* Avatar row */}
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-[#2B2B2B]">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold uppercase shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="text-[13px] font-bold text-white mb-2">Profile picture</p>
            <div className="flex items-center gap-2">
              <button className="h-8 px-3 border border-[#3F3F46] rounded-lg text-[12px] font-semibold text-white hover:bg-[#1A1A1A] transition-colors">
                Upload avatar
              </button>
              <button className="h-8 px-3 text-[12px] text-[#A1A1AA] hover:text-white transition-colors">
                Remove
              </button>
            </div>
          </div>
        </div>

        {/* Username */}
        <div className="mb-5">
          <Label>Username</Label>
          <DarkInput value={username} onChange={setUsername} prefix="cal.com/" />
          <p className="text-[11px] text-[#71717A] mt-2 flex items-center gap-1">
            ⓘ Tip: You can add a '+' between usernames (e.g. cal.com/anna+brian) to meet with multiple people
          </p>
        </div>

        {/* Full name */}
        <div className="mb-5">
          <Label>Full name</Label>
          <DarkInput value={fullName} onChange={setFullName} />
        </div>

        {/* Email */}
        <div className="mb-5">
          <Label>Email</Label>
          <div className="flex h-10 bg-[#1A1A1A] border border-[#2B2B2B] rounded-lg overflow-hidden items-center px-3 gap-3">
            <span className="text-[13px] text-white flex-1">{user?.email}</span>
            <span className="text-[11px] font-bold text-white bg-[#1D4ED8] px-2 py-0.5 rounded-full">Primary</span>
            <button className="text-[#71717A] hover:text-white transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
          </div>
          <button className="flex items-center gap-1.5 mt-2 text-[13px] text-[#A1A1AA] hover:text-white transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add email
          </button>
        </div>

        {/* About */}
        <div className="mb-5">
          <Label>About</Label>
          <div className="border border-[#2B2B2B] rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-[#2B2B2B] bg-[#1A1A1A]">
              <select className="bg-transparent text-[12px] text-[#A1A1AA] focus:outline-none">
                <option>Normal</option><option>Heading 1</option><option>Heading 2</option>
              </select>
              <div className="w-[1px] h-4 bg-[#3F3F46] mx-1" />
              {[Bold, Italic, LinkIcon].map((Icon, i) => (
                <button key={i} className="p-1 text-[#71717A] hover:text-white transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
            <textarea rows={5} value={bio} onChange={e => setBio(e.target.value)}
              className="w-full bg-[#1A1A1A] text-[13px] text-white px-3 py-2.5 focus:outline-none resize-none" />
          </div>
        </div>

        {/* Connected accounts */}
        <div className="mb-5">
          <Label>Connected accounts</Label>
          <div className="flex items-center justify-between py-1">
            <span className="text-[13px] text-white">Google</span>
            <button className="h-8 px-3 bg-red-500 text-white text-[12px] font-semibold rounded-lg hover:bg-red-600 transition-colors">
              Disconnect
            </button>
          </div>
        </div>

        <UpdateBtn />
      </Card>

      {/* Danger zone */}
      <Card>
        <p className="text-[14px] font-bold text-white mb-1">Danger zone</p>
        <p className="text-[12px] text-[#71717A] mb-4">Be careful. Account deletion cannot be undone.</p>
        <div className="flex justify-end">
          <button className="h-9 px-5 border border-red-600 text-red-500 rounded-lg text-[13px] font-semibold hover:bg-red-600/10 transition-colors">
            Delete account
          </button>
        </div>
      </Card>
    </div>
  );
}

// ── GENERAL ───────────────────────────────────────────────────────────────────
function GeneralPage() {
  const [lang, setLang]       = useState('English');
  const [tz, setTz]           = useState('Europe/London');
  const [timeFmt, setTimeFmt] = useState('12-hour');
  const [weekStart, setWeekStart] = useState('Sunday');

  return (
    <div className="space-y-4 max-w-2xl">
      <Card>
        <div className="space-y-5">
          <div>
            <Label>Language</Label>
            <DarkSelect value={lang} onChange={setLang} options={['English','Spanish','French','German','Japanese','Portuguese']} />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Timezone</Label>
              <DarkSelect value={tz} onChange={setTz} options={['Europe/London','America/New_York','America/Chicago','America/Los_Angeles','Asia/Kolkata','Asia/Tokyo','UTC']} />
            </div>
            <div className="flex items-end">
              <button className="flex items-center gap-2 h-10 px-4 border border-[#2B2B2B] rounded-lg text-[13px] text-[#A1A1AA] hover:text-white hover:border-[#3F3F46] transition-colors whitespace-nowrap">
                <Calendar className="w-3.5 h-3.5" /> Schedule timezone change
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Time format</Label>
              <DarkSelect value={timeFmt} onChange={setTimeFmt} options={['12-hour','24-hour']} />
            </div>
            <div>
              <Label>Start of week</Label>
              <DarkSelect value={weekStart} onChange={setWeekStart} options={['Sunday','Monday','Tuesday']} />
            </div>
          </div>
          <p className="text-[11px] text-[#71717A]">This is an internal setting and will not affect how times are displayed on your <span className="underline cursor-pointer">public booking pages</span>.</p>
        </div>
        <UpdateBtn />
      </Card>

      <ToggleCard title="Dynamic group links" desc="Allow attendees to book you through dynamic group bookings" />
      <ToggleCard title="Allow search engine indexing" desc="Allow search engines to access your public content" />
      <ToggleCard title="Monthly digest email" desc="Monthly digest email for teams" />
      <ToggleCard title="Prevent impersonation on bookings"
        desc="When enabled, anyone trying to book events using your email address must verify they own it via a one time code or be logged in to prevent impersonation"
        disabled />
    </div>
  );
}

// ── CALENDARS ─────────────────────────────────────────────────────────────────
function CalendarsPage() {
  return (
    <div className="max-w-2xl">
      <Card>
        <div className="flex flex-col items-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#2B2B2B] flex items-center justify-center mb-5">
            <Calendar className="w-7 h-7 text-[#71717A]" />
          </div>
          <h3 className="text-[16px] font-bold text-white mb-2">No calendar apps</h3>
          <p className="text-[13px] text-[#71717A] max-w-xs mb-6">Add a calendar app to check for conflicts to prevent double bookings</p>
          <button className="flex items-center gap-2 h-9 px-5 border border-[#3F3F46] rounded-full text-[13px] font-semibold text-white hover:bg-[#1A1A1A] transition-colors">
            Connect your first calendar <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </Card>
    </div>
  );
}

// ── CONFERENCING ─────────────────────────────────────────────────────────────
function ConferencingPage() {
  return (
    <div className="max-w-2xl">
      <Card>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#1D4ED8] rounded-lg flex items-center justify-center shrink-0">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[14px] font-bold text-white">Cal Video</p>
              <span className="px-1.5 py-0.5 bg-[#14532D] border border-[#166534] text-[#4ADE80] text-[11px] font-bold rounded">Default</span>
            </div>
            <p className="text-[12px] text-[#71717A] leading-relaxed">Cal Video is the in-house web-based video conferencing platform powered by Daily.co, which is minimalistic and lightweight, but has most of the features you need.</p>
          </div>
          <button className="text-[#71717A] hover:text-white transition-colors shrink-0 p-1">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </Card>
    </div>
  );
}

// ── APPEARANCE ────────────────────────────────────────────────────────────────
function ThemePreview({ type }) {
  // type: 'system-default' | 'light' | 'dark'
  const isDefault = type === 'system-default';
  const isDark    = type === 'dark';
  return (
    <div className={`w-full aspect-[4/3] rounded-lg overflow-hidden border-2 border-[#3F3F46] flex ${isDark ? 'bg-[#111]' : 'bg-white'}`}>
      {/* Left panel (always light for system-default & light, dark for dark) */}
      <div className={`flex-1 p-2 ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
        <div className={`w-3/4 h-1.5 rounded mb-1.5 ${isDark ? 'bg-[#2B2B2B]' : 'bg-[#E5E7EB]'}`} />
        <div className={`w-1/2 h-1.5 rounded mb-3 ${isDark ? 'bg-[#2B2B2B]' : 'bg-[#E5E7EB]'}`} />
        {[1,2,3].map(i=><div key={i} className={`w-full h-3 rounded mb-1.5 ${isDark?'bg-[#2B2B2B]':'bg-[#F3F4F6]'}`}/>)}
      </div>
      {/* Right panel — only shown for system-default */}
      {isDefault && (
        <div className="flex-1 p-2 bg-[#111]">
          <div className="w-3/4 h-1.5 rounded mb-1.5 bg-[#2B2B2B]" />
          <div className="w-1/2 h-1.5 rounded mb-3 bg-[#2B2B2B]" />
          {[1,2,3].map(i=><div key={i} className="w-full h-3 rounded mb-1.5 bg-[#2B2B2B]"/>)}
        </div>
      )}
    </div>
  );
}

function BookingThemePreview({ type }) {
  const isDark = type === 'dark';
  return (
    <div className={`w-full aspect-[4/3] rounded-lg overflow-hidden border-2 border-[#3F3F46] flex ${isDark?'bg-[#111]':'bg-gray-50'}`}>
      {type === 'system-default'
        ? <>
            <div className="flex-1 p-2 bg-white">
              <div className="w-8 h-8 rounded-full bg-[#E5E7EB] mb-2" />
              {[1,2,3].map(i=><div key={i} className="w-full h-2 rounded mb-1 bg-[#F3F4F6]"/>)}
            </div>
            <div className="flex-1 p-2 bg-[#111]">
              <div className="w-8 h-8 rounded-full bg-[#2B2B2B] mb-2" />
              {[1,2,3].map(i=><div key={i} className="w-full h-2 rounded mb-1 bg-[#2B2B2B]"/>)}
            </div>
          </>
        : <div className="flex-1 p-2">
            <div className={`w-8 h-8 rounded-full mb-2 ${isDark?'bg-[#2B2B2B]':'bg-[#E5E7EB]'}`} />
            {[1,2,3].map(i=><div key={i} className={`w-full h-2 rounded mb-1 ${isDark?'bg-[#2B2B2B]':'bg-[#F3F4F6]'}`}/>)}
            <div className={`mt-2 grid grid-cols-3 gap-1`}>
              {[1,2,3,4,5,6].map(i=><div key={i} className={`h-3 rounded ${isDark?'bg-[#2B2B2B]':'bg-[#E5E7EB]'}`}/>)}
            </div>
          </div>
      }
    </div>
  );
}

function LayoutPreview({ type }) {
  return (
    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-[#3F3F46] bg-[#F9FAFB] p-2">
      <div className="w-8 h-8 rounded-full bg-[#E5E7EB] mb-2" />
      {type === 'month' && <div className="grid grid-cols-7 gap-0.5">{Array.from({length:28}).map((_,i)=><div key={i} className="h-2.5 bg-[#E5E7EB] rounded-sm"/>)}</div>}
      {type === 'weekly' && <div className="grid grid-cols-3 gap-1">{Array.from({length:9}).map((_,i)=><div key={i} className="h-3 bg-[#E5E7EB] rounded"/>)}</div>}
      {type === 'column' && <div className="space-y-1">{Array.from({length:6}).map((_,i)=><div key={i} className="flex gap-1">{[1,2,3].map(j=><div key={j} className="flex-1 h-2.5 bg-[#E5E7EB] rounded-sm"/>)}</div>)}</div>}
    </div>
  );
}

function AppearancePage() {
  const [dashTheme, setDashTheme]       = useState('system-default');
  const [bookTheme, setBookTheme]       = useState('system-default');
  const [layouts, setLayouts]           = useState({ month:true, weekly:true, column:true });
  const [defaultView, setDefaultView]   = useState('month');
  const [brandColors, setBrandColors]   = useState(false);
  const [lightColor, setLightColor]     = useState('292929');
  const [darkColor, setDarkColor]       = useState('fafafa');

  const THEMES = [
    { id:'system-default', label:'System default' },
    { id:'light',          label:'Light' },
    { id:'dark',           label:'Dark' },
  ];

  return (
    <div className="max-w-2xl space-y-4">
      {/* Dashboard theme */}
      <Card>
        <p className="text-[14px] font-bold text-white mb-1">Dashboard theme</p>
        <p className="text-[12px] text-[#71717A] mb-4">This only applies to your logged in dashboard</p>
        <div className="grid grid-cols-3 gap-4">
          {THEMES.map(t => (
            <label key={t.id} className="cursor-pointer">
              <ThemePreview type={t.id} />
              <div className="flex items-center gap-2 mt-2">
                <input type="radio" name="dashboard-theme" value={t.id} checked={dashTheme===t.id} onChange={()=>setDashTheme(t.id)}
                  className="accent-sky-500" />
                <span className="text-[13px] text-white font-medium">{t.label}</span>
              </div>
            </label>
          ))}
        </div>
        <UpdateBtn />
      </Card>

      {/* Booking page theme */}
      <Card>
        <p className="text-[14px] font-bold text-white mb-1">Booking page theme</p>
        <p className="text-[12px] text-[#71717A] mb-4">This only applies to your public booking pages</p>
        <div className="grid grid-cols-3 gap-4">
          {THEMES.map(t => (
            <label key={t.id} className="cursor-pointer">
              <BookingThemePreview type={t.id} />
              <div className="flex items-center gap-2 mt-2">
                <input type="radio" name="booking-theme" value={t.id} checked={bookTheme===t.id} onChange={()=>setBookTheme(t.id)}
                  className="accent-sky-500" />
                <span className="text-[13px] text-white font-medium">{t.label}</span>
              </div>
            </label>
          ))}
        </div>
        <UpdateBtn />
      </Card>

      {/* Booking layout */}
      <Card>
        <p className="text-[14px] font-bold text-white mb-1">Booking layout</p>
        <p className="text-[12px] text-[#71717A] mb-4">You can select multiple and bookers can switch views. This can be overridden on a per event basis.</p>
        <div className="grid grid-cols-3 gap-4 mb-5">
          {[{id:'month',label:'Month (Default)'},{id:'weekly',label:'Weekly'},{id:'column',label:'Column'}].map(l => (
            <label key={l.id} className="cursor-pointer">
              <div className={`rounded-lg overflow-hidden border-2 ${layouts[l.id]?'border-white':'border-[#3F3F46]'}`}>
                <LayoutPreview type={l.id} />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" checked={layouts[l.id]} onChange={()=>setLayouts(p=>({...p,[l.id]:!p[l.id]}))}
                  className="accent-sky-500" />
                <span className="text-[13px] text-white font-medium">{l.label}</span>
              </div>
            </label>
          ))}
        </div>
        <div className="mb-2">
          <p className="text-[13px] font-semibold text-white mb-2">Default view</p>
          <div className="flex gap-2">
            {['Month','Weekly','Column'].map(v => (
              <button key={v} onClick={()=>setDefaultView(v.toLowerCase())}
                className={`px-3 py-1 rounded-md text-[13px] font-medium transition-colors ${
                  defaultView===v.toLowerCase()?'bg-[#2B2B2B] text-white':'text-[#A1A1AA] hover:text-white'
                }`}>{v}</button>
            ))}
          </div>
        </div>
        <UpdateBtn />
      </Card>

      {/* Custom brand colors */}
      <Card>
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-[14px] font-bold text-white">Custom brand colors</p>
            <p className="text-[12px] text-[#71717A] mt-0.5">Customize your own brand colour into your booking page.</p>
          </div>
          <Toggle on={brandColors} onChange={setBrandColors} />
        </div>
        {brandColors && (
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-[12px] font-semibold text-white mb-2">Brand color (light theme)</p>
              <div className="flex items-center h-10 bg-[#1A1A1A] border border-[#2B2B2B] rounded-lg px-3 gap-2">
                <div className="w-5 h-5 rounded border border-[#3F3F46] shrink-0" style={{background:`#${lightColor}`}} />
                <input value={lightColor} onChange={e=>setLightColor(e.target.value)}
                  className="flex-1 bg-transparent text-[13px] text-white focus:outline-none" />
              </div>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-white mb-2">Brand color (dark theme)</p>
              <div className="flex items-center h-10 bg-[#1A1A1A] border border-[#2B2B2B] rounded-lg px-3 gap-2">
                <div className="w-5 h-5 rounded border border-[#3F3F46] shrink-0" style={{background:`#${darkColor}`}} />
                <input value={darkColor} onChange={e=>setDarkColor(e.target.value)}
                  className="flex-1 bg-transparent text-[13px] text-white focus:outline-none" />
              </div>
            </div>
          </div>
        )}
        <UpdateBtn />
      </Card>

      {/* Disable Cal.com branding */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-[14px] font-bold text-white">Disable Cal.com branding</p>
              <span className="px-1.5 py-0.5 rounded bg-[#1D4ED8] text-white text-[10px] font-bold">Teams</span>
            </div>
            <p className="text-[12px] text-[#71717A]">Removes any Cal.com related brandings, i.e. 'Powered by Cal.com.'</p>
          </div>
          <button className="flex items-center gap-1.5 h-9 px-4 bg-[#2B2B2B] text-white text-[13px] font-semibold rounded-lg hover:bg-[#3F3F46] transition-colors whitespace-nowrap">
            Upgrade →
          </button>
        </div>
      </Card>
    </div>
  );
}

// ── OUT OF OFFICE ─────────────────────────────────────────────────────────────
function OutOfOfficePage() {
  const [tab, setTab] = useState('My OOO');
  const tabs = ['My OOO','Team OOO','Holidays'];
  return (
    <div className="max-w-2xl space-y-4">
      {/* Tab row + Add button are in the header — rendered here as top bar */}
      <div className="flex items-center gap-1 bg-[#1A1A1A] border border-[#2B2B2B] rounded-lg p-0.5 w-fit">
        {tabs.map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition-colors ${
              tab===t?'bg-[#2B2B2B] text-white':'text-[#71717A] hover:text-white'
            }`}>{t}</button>
        ))}
      </div>
      {/* Search + filter */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 h-9 bg-[#1A1A1A] border border-[#2B2B2B] rounded-lg flex-1 max-w-[200px]">
          <Search className="w-3.5 h-3.5 text-[#52525B] shrink-0" />
          <input placeholder="Search" className="bg-transparent text-[13px] text-white placeholder:text-[#52525B] focus:outline-none flex-1" />
        </div>
        <button className="flex items-center gap-1.5 h-9 px-3 border border-[#2B2B2B] rounded-lg text-[13px] text-[#A1A1AA] hover:text-white bg-[#1A1A1A]">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Filter
        </button>
        <button className="h-9 px-3 border border-[#2B2B2B] rounded-lg text-[13px] text-[#A1A1AA] hover:text-white bg-[#1A1A1A]">Save</button>
        <button className="flex items-center gap-1.5 h-9 px-3 border border-[#2B2B2B] rounded-lg text-[13px] text-[#A1A1AA] hover:text-white bg-[#1A1A1A]">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Saved filters ⌄
        </button>
      </div>
      {/* Empty state */}
      <Card>
        <div className="flex flex-col items-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D1D5DB] to-[#9CA3AF] flex items-center justify-center mb-5 text-2xl">
            <span className="text-[24px]">🌙</span>
          </div>
          <h3 className="text-[17px] font-bold text-white mb-3">Create an OOO</h3>
          <p className="text-[13px] text-[#71717A] max-w-sm leading-relaxed mb-6">
            Communicate to your bookers when you're not available to take bookings. They can still book you upon your return or you can forward them to a team member.
          </p>
          <button className="flex items-center gap-2 h-9 px-5 border border-[#3F3F46] rounded-full text-[13px] font-semibold text-white hover:bg-[#1A1A1A] transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </Card>
    </div>
  );
}

// ── PUSH NOTIFICATIONS ────────────────────────────────────────────────────────
function PushNotificationsPage() {
  return (
    <div className="max-w-2xl">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[14px] font-bold text-white mb-0.5">Browser notifications</p>
            <p className="text-[12px] text-[#71717A]">Manage whether this browser receives booking alerts.</p>
          </div>
          <button className="h-9 px-4 bg-white text-[#111827] text-[13px] font-semibold rounded-lg hover:bg-[#F4F4F5] transition-colors whitespace-nowrap">
            Allow browser notifications
          </button>
        </div>
      </Card>
    </div>
  );
}

// ── FEATURES ──────────────────────────────────────────────────────────────────
function FeaturesPage() {
  return (
    <div className="max-w-2xl space-y-4">
      <ToggleCard title="Teams" desc="Enable teams feature to allow group scheduling and round-robin events." defaultOn />
      <ToggleCard title="Insights" desc="View analytics and booking insights for your events." defaultOn />
      <ToggleCard title="Workflows" desc="Automate email and SMS notifications around your events." defaultOn />
    </div>
  );
}

// ── PASSWORD ──────────────────────────────────────────────────────────────────
function PasswordPage() {
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  return (
    <div className="max-w-2xl">
      <Card>
        <div className="space-y-4">
          <div>
            <Label>Old password</Label>
            <DarkInput value={oldPw} onChange={setOldPw} placeholder="••••••••" />
          </div>
          <div>
            <Label>New password</Label>
            <DarkInput value={newPw} onChange={setNewPw} placeholder="••••••••" />
          </div>
          <div>
            <Label>Confirm new password</Label>
            <DarkInput value={confirmPw} onChange={setConfirmPw} placeholder="••••••••" />
          </div>
        </div>
        <UpdateBtn label="Save" />
      </Card>
    </div>
  );
}

// ── IMPERSONATION ─────────────────────────────────────────────────────────────
function ImpersonationPage() {
  return (
    <div className="max-w-2xl">
      <ToggleCard title="Allow Cal.com support to sign in as you" desc="This allows our support team to temporarily access your account for troubleshooting purposes. You can revoke access at any time." />
    </div>
  );
}

// ── COMPLIANCE ────────────────────────────────────────────────────────────────
function CompliancePage() {
  return (
    <div className="max-w-2xl space-y-4">
      <ToggleCard title="Data processing agreement" desc="Request our standard data processing agreement for GDPR compliance." />
      <ToggleCard title="Privacy policy on booking pages" desc="Show a link to your privacy policy on all public booking pages." />
    </div>
  );
}

// ── MANAGE BILLING ────────────────────────────────────────────────────────────
function ManageBillingPage() {
  return (
    <div className="max-w-2xl">
      <Card>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[14px] font-bold text-white mb-0.5">Current plan</p>
            <p className="text-[12px] text-[#71717A]">You are currently on the <span className="text-white font-semibold">Free</span> plan.</p>
          </div>
          <button className="h-9 px-5 bg-white text-[#111827] text-[13px] font-semibold rounded-lg hover:bg-[#F4F4F5] transition-colors">
            Upgrade
          </button>
        </div>
        <div className="border-t border-[#2B2B2B] pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#A1A1AA]">Billing period</span>
            <span className="text-[13px] text-white">Monthly</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#A1A1AA]">Next invoice</span>
            <span className="text-[13px] text-white">—</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#A1A1AA]">Payment method</span>
            <span className="text-[13px] text-white">None</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ── PLANS ─────────────────────────────────────────────────────────────────────
function PlansPage() {
  const plans = [
    { name:'Free', price:'$0', period:'/mo', features:['1 calendar connection','Unlimited event types','Cal Video built-in'], current:true },
    { name:'Teams', price:'$15', period:'/user/mo', features:['Everything in Free','Round-robin scheduling','Team workflows','Collective scheduling'], current:false },
    { name:'Organization', price:'$37', period:'/user/mo', features:['Everything in Teams','Org-wide branding','Advanced analytics','SAML SSO','Priority support'], current:false },
  ];
  return (
    <div className="max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map(p => (
          <Card key={p.name} className={p.current ? 'border-white' : ''}>
            <p className="text-[16px] font-bold text-white mb-1">{p.name}</p>
            <div className="flex items-baseline gap-0.5 mb-4">
              <span className="text-[28px] font-extrabold text-white">{p.price}</span>
              <span className="text-[13px] text-[#71717A]">{p.period}</span>
            </div>
            <ul className="space-y-2 mb-6">
              {p.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-[12px] text-[#A1A1AA]">
                  <span className="text-[#4ADE80]">✓</span> {f}
                </li>
              ))}
            </ul>
            {p.current
              ? <div className="h-9 flex items-center justify-center text-[13px] font-semibold text-[#71717A] border border-[#2B2B2B] rounded-lg">Current plan</div>
              : <button className="w-full h-9 bg-white text-[#111827] text-[13px] font-semibold rounded-lg hover:bg-[#F4F4F5] transition-colors">Upgrade</button>
            }
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── GENERIC PLACEHOLDER ───────────────────────────────────────────────────────
function PlaceholderPage({ title }) {
  return (
    <div className="max-w-2xl">
      <Card>
        <div className="flex flex-col items-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#2B2B2B] flex items-center justify-center mb-4">
            <Settings2 className="w-5 h-5 text-[#71717A]" />
          </div>
          <h3 className="text-[15px] font-bold text-white mb-2">{title}</h3>
          <p className="text-[13px] text-[#71717A]">This section will be available soon.</p>
        </div>
      </Card>
    </div>
  );
}

// ── OVERVIEW GRID ─────────────────────────────────────────────────────────────
const PERSONAL_SETTINGS = [
  { icon: User,      title: 'Profile',             desc: 'Manage your profile details or delete your account' },
  { icon: Settings2, title: 'General',             desc: 'Manage language, timezone, and other preferences' },
  { icon: Calendar,  title: 'Calendars',           desc: 'Connect and manage your calendar integrations' },
  { icon: Video,     title: 'Conferencing',        desc: 'Configure your video conferencing apps' },
  { icon: Briefcase, title: 'Out of office',       desc: 'Set your away dates and redirect bookings' },
  { icon: CreditCard,title: 'Manage billing',      desc: 'View and manage your subscription and invoices' },
  { icon: Layers,    title: 'Plans',               desc: 'Compare plans and upgrade your subscription' },
  { icon: Palette,   title: 'Appearance',          desc: 'Customize your booking page theme and branding' },
  { icon: Bell,      title: 'Push notifications',  desc: 'Configure push notification preferences' },
  { icon: Zap,       title: 'Features',            desc: 'Opt in to new and experimental features' },
];
const SECURITY_SETTINGS = [
  { icon: KeyRound,    title: 'Password',                  desc: 'Update your password or sign-in method' },
  { icon: Users,       title: 'Impersonation',             desc: 'Allow support to sign in on your behalf' },
  { icon: Shield,      title: 'Two factor authentication', desc: 'Add an extra layer of security to your account' },
  { icon: ShieldCheck, title: 'Compliance',                desc: 'Manage data compliance and privacy settings' },
];
const DEVELOPER_SETTINGS = [
  { icon: Webhook, title: 'Webhooks',      desc: 'Subscribe to events and receive real-time notifications' },
  { icon: Code2,   title: 'API keys',      desc: 'Create and manage your API keys' },
  { icon: Globe,   title: 'OAuth Clients', desc: 'Register and manage OAuth applications' },
];

function SettingsGrid({ items, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.button 
            key={item.title} 
            onClick={() => onSelect(item.title)}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02 }}
            whileHover={{ backgroundColor: '#1E1E1E' }}
            className="flex items-start gap-4 p-5 text-left rounded-xl transition-colors group">
            <div className="w-10 h-10 shrink-0 bg-[#1A1A1A] border border-[#2B2B2B] rounded-lg flex items-center justify-center group-hover:bg-[#2B2B2B] transition-colors">
              <Icon className="w-5 h-5 text-[#A1A1AA] group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-white mb-0.5 group-hover:text-sky-400 transition-colors uppercase tracking-tight">{item.title}</p>
              <p className="text-[12px] text-[#71717A] leading-relaxed line-clamp-2">{item.desc}</p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

function OverviewPage({ onSelect }) {
  return (
    <div className="max-w-5xl space-y-10">
      <section>
        <h2 className="text-[16px] font-bold text-white mb-4">Personal settings</h2>
        <div className="border border-[#2B2B2B] rounded-xl bg-[#141414]">
          <SettingsGrid items={PERSONAL_SETTINGS} onSelect={onSelect} />
        </div>
      </section>
      <section>
        <h2 className="text-[16px] font-bold text-white mb-4">Security</h2>
        <div className="border border-[#2B2B2B] rounded-xl bg-[#141414]">
          <SettingsGrid items={SECURITY_SETTINGS} onSelect={onSelect} />
        </div>
      </section>
      <section>
        <h2 className="text-[16px] font-bold text-white mb-4">Developer</h2>
        <div className="border border-[#2B2B2B] rounded-xl bg-[#141414]">
          <SettingsGrid items={DEVELOPER_SETTINGS} onSelect={onSelect} />
        </div>
      </section>
    </div>
  );
}

// ── Page routing ──────────────────────────────────────────────────────────────
function SubPage({ page, user, onSelect }) {
  const variants = {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={page}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.2 }}
      >
        {page === 'Overview' && <OverviewPage onSelect={onSelect} />}
        {page === 'Profile' && <ProfilePage user={user} />}
        {page === 'General' && <GeneralPage />}
        {page === 'Calendars' && <CalendarsPage />}
        {page === 'Conferencing' && <ConferencingPage />}
        {page === 'Appearance' && <AppearancePage />}
        {page === 'Out of office' && <OutOfOfficePage />}
        {page === 'Push notifications' && <PushNotificationsPage />}
        {page === 'Features' && <FeaturesPage />}
        {page === 'Password' && <PasswordPage />}
        {page === 'Impersonation' && <ImpersonationPage />}
        {page === 'Compliance' && <CompliancePage />}
        {page === 'Manage billing' && <ManageBillingPage />}
        {page === 'Plans' && <PlansPage />}
        {![ 'Overview','Profile','General','Calendars','Conferencing','Appearance','Out of office','Push notifications','Features','Password','Impersonation','Compliance','Manage billing','Plans'].includes(page) && (
          <PlaceholderPage title={page} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// ── Sidebar nav item ──────────────────────────────────────────────────────────
function NavItem({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`w-full text-left px-3 py-1.5 rounded-md text-[13px] transition-colors ${
        active ? 'bg-[#2B2B2B] text-white font-semibold' : 'text-[#A1A1AA] hover:text-white hover:bg-[#1A1A1A]'
      }`}>
      {label}
    </button>
  );
}

// ── Page meta ──────────────────────────────────────────────────────────────────
const PAGE_META = {
  Overview:             { title: 'Settings',            subtitle: 'Manage your account and settings.' },
  Profile:              { title: 'Profile',             subtitle: 'Manage settings for your Cal.com profile' },
  General:              { title: 'General',             subtitle: 'Manage settings for your language and timezone' },
  Calendars:            { title: 'Calendars',           subtitle: 'Configure how your event types interact with your calendars', action: true },
  Conferencing:         { title: 'Conferencing',        subtitle: 'Configure your video conferencing apps' },
  Appearance:           { title: 'Appearance',          subtitle: 'Customize your booking page theme and branding' },
  'Out of office':      { title: 'Out of office',       subtitle: 'Set your away dates and redirect bookings' },
  'Push notifications': { title: 'Push notifications',  subtitle: 'Configure push notification preferences' },
  Features:             { title: 'Features',            subtitle: 'Opt in to new and experimental features' },
  Password:             { title: 'Password',            subtitle: 'Update your password or sign-in method' },
  Impersonation:        { title: 'Impersonation',       subtitle: 'Allow support to sign in on your behalf' },
  Compliance:           { title: 'Compliance',          subtitle: 'Manage data compliance and privacy settings' },
  'Manage billing':     { title: 'Manage billing',      subtitle: 'View and manage your subscription and invoices' },
  Plans:                { title: 'Plans',               subtitle: 'Compare plans and upgrade your subscription' },
};

const PERSONAL_NAV = ['Profile','General','Calendars','Conferencing','Appearance','Out of office','Push notifications','Features'];

// ── Main component ─────────────────────────────────────────────────────────────
export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('Overview');
  const [search, setSearch] = useState('');
  const [showMobileNav, setShowMobileNav] = useState(false);

  const meta = PAGE_META[activePage] || { title: activePage, subtitle: '' };

  const SidebarContent = () => (
    <>
        {/* Back */}
        <div className="px-4 py-4 border-b border-[#2B2B2B] shrink-0">
          <button onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-[13px] text-[#A1A1AA] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        <div className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {/* Overview */}
          <button onClick={() => { setActivePage('Overview'); setShowMobileNav(false); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13.5px] font-medium transition-colors ${
              activePage === 'Overview' ? 'bg-[#2B2B2B] text-white' : 'text-[#A1A1AA] hover:bg-[#1E1E1E] hover:text-white'
            }`}>
            <div className="w-5 h-5 shrink-0 grid grid-cols-2 gap-px p-0.5">
              {[0,1,2,3].map(i => <div key={i} className="bg-[#A1A1AA] rounded-[1px]" />)}
            </div>
            Overview
          </button>

          {/* User block */}
          <div className="pt-2 pb-1">
            <div className="flex items-center gap-2 px-3 py-1.5">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-[9px] font-bold uppercase shrink-0">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="text-[13px] font-semibold text-white truncate">{user?.name || 'User'}</span>
            </div>
            <div className="space-y-0.5 mt-0.5">
              {PERSONAL_NAV.map(label => (
                <NavItem key={label} label={label} active={activePage === label} onClick={() => { setActivePage(label); setShowMobileNav(false); }} />
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="pt-3 pb-1 border-t border-[#2B2B2B]">
            <div className="flex items-center gap-2 px-3 py-1 mb-1">
              <KeyRound className="w-3.5 h-3.5 text-[#52525B]" />
              <span className="text-[11px] font-bold text-[#52525B] uppercase tracking-wider">Security</span>
            </div>
            {['Password','Impersonation','Compliance'].map(label => (
              <NavItem key={label} label={label} active={activePage === label} onClick={() => { setActivePage(label); setShowMobileNav(false); }} />
            ))}
          </div>

          {/* Billing */}
          <div className="pt-3 pb-1 border-t border-[#2B2B2B]">
            <div className="flex items-center gap-2 px-3 py-1 mb-1">
              <CreditCard className="w-3.5 h-3.5 text-[#52525B]" />
              <span className="text-[11px] font-bold text-[#52525B] uppercase tracking-wider">Billing</span>
            </div>
            {['Manage billing','Plans'].map(label => (
              <NavItem key={label} label={label} active={activePage === label} onClick={() => { setActivePage(label); setShowMobileNav(false); }} />
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="px-3 py-3 border-t border-[#2B2B2B] shrink-0">
          <button onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[13px] text-[#A1A1AA] hover:bg-[#1E1E1E] hover:text-white transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#101010]">
      {/* ══ Sidebar (Desktop) ═══════════════════════════════════════════════ */}
      <aside className="hidden lg:flex w-[220px] shrink-0 fixed inset-y-0 left-0 flex-col bg-[#101010] border-r border-[#2B2B2B] z-20 overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* ══ Sidebar (Mobile Drawer) ═════════════════════════════════════════ */}
      <AnimatePresence>
        {showMobileNav && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileNav(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[260px] bg-[#101010] border-r border-[#2B2B2B] z-[101] flex flex-col lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ══ Main ═══════════════════════════════════════════════════ */}
      <main className="flex-1 lg:ml-[220px] min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#101010]/80 backdrop-blur-md border-b border-[#2B2B2B] px-4 sm:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowMobileNav(true)}
              className="lg:hidden p-2 -ml-2 rounded-md text-[#A1A1AA] hover:text-white hover:bg-[#1A1A1A]"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-[18px] sm:text-[20px] font-bold text-white">{meta.title}</h1>
              {meta.subtitle && <p className="text-[12px] sm:text-[13px] text-[#71717A] mt-0.5 line-clamp-1">{meta.subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {activePage === 'Calendars' && (
              <button className="flex items-center gap-1.5 h-9 px-3 sm:px-4 border border-[#3F3F46] rounded-lg text-[13px] font-semibold text-white hover:bg-[#1A1A1A]">
                <Plus className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Add calendar</span><span className="sm:hidden">Add</span>
              </button>
            )}
            {activePage === 'Conferencing' && (
              <button className="flex items-center gap-1.5 h-9 px-3 sm:px-4 border border-[#3F3F46] rounded-lg text-[13px] font-semibold text-white hover:bg-[#1A1A1A]">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            )}
            {activePage === 'Out of office' && (
              <button className="flex items-center gap-1.5 h-9 px-3 sm:px-4 border border-[#3F3F46] rounded-lg text-[13px] font-semibold text-white hover:bg-[#1A1A1A]">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            )}
            {activePage === 'Overview' && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#1A1A1A] border border-[#2B2B2B] rounded-lg w-52">
                <Search className="w-3.5 h-3.5 text-[#52525B] shrink-0" />
                <input type="text" placeholder="Search" value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-transparent text-[13px] text-white placeholder:text-[#52525B] focus:outline-none flex-1" />
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-4 sm:px-8 py-8">
          {activePage === 'Overview'
            ? <OverviewPage onSelect={setActivePage} />
            : <SubPage page={activePage} user={user} onSelect={setActivePage} />
          }
        </div>
      </main>
    </div>
  );
}
