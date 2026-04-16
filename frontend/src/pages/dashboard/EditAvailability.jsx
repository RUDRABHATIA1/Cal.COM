import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft, Pencil, Trash2, Loader2, Plus, Copy, Globe,
  ChevronDown, Check, Search, Users, GitBranch, BarChart2,
  Settings, LogOut, Clock, Calendar, Link as LinkIcon,
  Grid3X3, Zap, Webhook, ExternalLink
} from 'lucide-react';
import api from '../../utils/api';

const TIME_OPTIONS = [];
for (let h = 0; h < 24; h++) {
  for (let m of [0, 30]) {
    const hh = String(h).padStart(2,'0');
    const mm = String(m).padStart(2,'0');
    const ampm = h < 12 ? 'am' : 'pm';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    TIME_OPTIONS.push({ value: `${hh}:${mm}`, label: `${h12}:${mm === '00' ? '00' : mm}${ampm}` });
  }
}

const TIMEZONES = [
  'Europe/London','America/New_York','America/Chicago','America/Denver',
  'America/Los_Angeles','Asia/Kolkata','Asia/Tokyo','Australia/Sydney',
  'Pacific/Auckland','UTC',
];

const NAV = [
  { icon: LinkIcon,   label: 'Event Types',  path: '/dashboard' },
  { icon: Clock,      label: 'Bookings',     path: '/dashboard/bookings' },
  { icon: Calendar,   label: 'Availability', path: '/dashboard/availability' },
  { icon: Users,      label: 'Teams',        path: '/dashboard/teams' },
  { icon: Grid3X3,    label: 'Apps',         path: '/dashboard/apps' },
  { icon: GitBranch,  label: 'Routing',      path: '/dashboard/routing-forms' },
  { icon: Zap,        label: 'Workflows',    path: '/dashboard/workflows' },
  { icon: BarChart2,  label: 'Insights',     path: '/dashboard/insights' },
];

function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${on ? 'bg-[#0ea5e9]' : 'bg-[#3F3F46]'}`}>
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

function TimeSelect({ value, onChange }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-[110px] h-9 px-2 bg-[#1A1A1A] border border-[#3F3F46] rounded-lg text-[13px] text-white focus:outline-none focus:border-[#71717A] transition-colors">
      {TIME_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export default function EditAvailability() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [schedule, setSchedule]       = useState(null);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    api.get(`/availability/${id}`)
      .then(r => setSchedule(r.data))
      .catch(() => setSchedule(null))
      .finally(() => setLoading(false));
  }, [id]);

  const setDay = (index, field, value) => {
    setSchedule(prev => {
      const days = [...prev.days];
      days[index] = { ...days[index], [field]: value };
      return { ...prev, days };
    });
  };

  const copyTimes = (index) => {
    const src = schedule.days[index];
    setSchedule(prev => ({
      ...prev,
      days: prev.days.map((d, i) =>
        i === index ? d : d.enabled ? { ...d, startTime: src.startTime, endTime: src.endTime } : d
      ),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.patch(`/availability/${id}`, {
        name:      schedule.name,
        isDefault: schedule.isDefault,
        timezone:  schedule.timezone,
        days:      schedule.days,
        overrides: schedule.overrides,
      });
      setSchedule(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { alert('Save failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${schedule?.name}"?`)) return;
    try {
      await api.delete(`/availability/${id}`);
      navigate('/dashboard/availability');
    } catch (err) {
      alert(err.response?.data?.message || 'Cannot delete');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#101010] flex items-center justify-center">
      <Loader2 className="w-7 h-7 animate-spin text-[#52525B]" />
    </div>
  );

  if (!schedule) return (
    <div className="min-h-screen bg-[#101010] flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-lg font-bold text-white mb-2">Schedule not found</h2>
      <button onClick={() => navigate('/dashboard/availability')}
        className="flex items-center gap-2 h-9 px-5 bg-white text-[#111827] text-sm font-semibold rounded-lg">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
    </div>
  );

  const fmt = t => {
    if (!t) return '';
    const [h, m] = t.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${ampm}`;
  };
  const enabledDays = schedule.days.filter(d => d.enabled);
  const summaryDays = enabledDays.length
    ? `${enabledDays[0].day.slice(0,3)} - ${enabledDays[enabledDays.length-1].day.slice(0,3)}, ${fmt(enabledDays[0].startTime)} - ${fmt(enabledDays[0].endTime)}`
    : 'No available times';

  return (
    <div className="flex min-h-screen bg-[#101010]">

      {/* ══ SIDEBAR ════════════════════════════════════════════════════ */}
      <aside className="w-[220px] shrink-0 fixed inset-y-0 left-0 flex flex-col bg-[#101010] border-r border-[#2B2B2B] z-20">
        <div className="px-3 py-3 border-b border-[#2B2B2B]">
          <button onClick={() => setShowUserMenu(v => !v)}
            className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-[#1E1E1E] transition-colors">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-[11px] font-bold uppercase shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <span className="flex-1 text-left text-[13px] font-semibold text-white truncate">{user?.name || 'User'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
          </button>
          {showUserMenu && (
            <div className="mt-1 mx-1 border border-[#2B2B2B] rounded-lg bg-[#1A1A1A] overflow-hidden shadow-xl">
              <button onClick={() => { logout(); navigate('/'); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-[#A1A1AA] hover:bg-[#2B2B2B] hover:text-white">
                <LogOut className="w-4 h-4" />Logout
              </button>
            </div>
          )}
        </div>
        <div className="px-3 py-2 border-b border-[#2B2B2B]">
          <div className="flex items-center gap-2 px-2 py-1.5 bg-[#1A1A1A] border border-[#2B2B2B] rounded-md">
            <Search className="w-3.5 h-3.5 text-[#52525B]" />
            <span className="text-[13px] text-[#52525B]">Search</span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {NAV.map(item => (
            <button key={item.path} onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] font-medium transition-colors ${
                item.path === '/dashboard/availability'
                  ? 'bg-[#2B2B2B] text-white'
                  : 'text-[#A1A1AA] hover:bg-[#1E1E1E] hover:text-white'
              }`}>
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="px-3 py-3 border-t border-[#2B2B2B] space-y-0.5">
          <button onClick={() => window.open(`/${user?.username}`, '_blank')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] text-[#A1A1AA] hover:bg-[#1E1E1E] hover:text-white">
            <ExternalLink className="w-4 h-4" />View public page
          </button>
          <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${user?.username}`)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] text-[#A1A1AA] hover:bg-[#1E1E1E] hover:text-white">
            <Copy className="w-4 h-4" />Copy public page link
          </button>
          <button onClick={() => navigate('/dashboard/settings')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] text-[#A1A1AA] hover:bg-[#1E1E1E] hover:text-white">
            <Settings className="w-4 h-4" />Settings
          </button>
        </div>
      </aside>

      {/* ══ MAIN CONTENT ═══════════════════════════════════════════════ */}
      <div className="flex-1 ml-[220px] flex flex-col min-h-screen">

        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#101010] border-b border-[#2B2B2B] px-6 h-14 flex items-center gap-3">
          <button onClick={() => navigate('/dashboard/availability')}
            className="p-1.5 rounded-md text-[#71717A] hover:bg-[#1E1E1E] hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1">
            {editingName ? (
              <input autoFocus value={schedule.name}
                onChange={e => setSchedule(p => ({ ...p, name: e.target.value }))}
                onBlur={() => setEditingName(false)}
                onKeyDown={e => e.key === 'Enter' && setEditingName(false)}
                className="bg-transparent text-[18px] font-bold text-white focus:outline-none border-b border-[#3F3F46] pb-0.5"
              />
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-[18px] font-bold text-white">{schedule.name}</h1>
                <button onClick={() => setEditingName(true)}
                  className="text-[#52525B] hover:text-white transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            )}
            <p className="text-[12px] text-[#71717A] leading-none mt-0.5">{summaryDays}</p>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[#71717A]">Set as default</span>
            <Toggle on={schedule.isDefault} onChange={v => setSchedule(p => ({ ...p, isDefault: v }))} />
            <div className="h-5 w-[1px] bg-[#2B2B2B] mx-1" />
            <button onClick={handleDelete}
              className="p-2 rounded-md text-[#71717A] hover:bg-[#1E1E1E] hover:text-red-400 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="h-5 w-[1px] bg-[#2B2B2B] mx-1" />
            <button onClick={handleSave} disabled={saving}
              className={`h-9 px-5 rounded-lg text-[13px] font-semibold flex items-center gap-2 transition-all ${
                saved ? 'bg-emerald-600 text-white' : 'bg-white text-[#111827] hover:bg-[#f4f4f5]'
              } disabled:opacity-60`}>
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {saved ? '✓ Saved' : saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="flex flex-1 gap-6 px-8 py-8 max-w-5xl">

          {/* Days column */}
          <div className="flex-1 space-y-6">
            {/* Day rows */}
            <div className="space-y-3">
              {schedule.days.map((day, i) => (
                <div key={day.day} className="flex items-center gap-4 min-h-[44px]">
                  {/* Toggle */}
                  <Toggle on={day.enabled} onChange={v => setDay(i, 'enabled', v)} />

                  {/* Day name */}
                  <span className={`w-28 text-[14px] font-semibold ${day.enabled ? 'text-white' : 'text-[#52525B]'}`}>
                    {day.day}
                  </span>

                  {day.enabled ? (
                    <>
                      <TimeSelect value={day.startTime} onChange={v => setDay(i, 'startTime', v)} />
                      <span className="text-[#52525B] font-bold">-</span>
                      <TimeSelect value={day.endTime} onChange={v => setDay(i, 'endTime', v)} />

                      <button onClick={() => copyTimes(i)}
                        className="p-1.5 text-[#52525B] hover:text-white hover:bg-[#1E1E1E] rounded-md transition-colors"
                        title="Copy times to all days">
                        <Copy className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <span className="text-[13px] text-[#52525B] ml-1">Unavailable</span>
                  )}
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-[#2B2B2B]" />

            {/* Date overrides */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[15px] font-bold text-white">Date overrides</h3>
              </div>
              <p className="text-[13px] text-[#71717A] mb-4">
                Add dates when your availability changes from your daily hours.
              </p>

              {/* Existing overrides */}
              {schedule.overrides?.length > 0 && (
                <div className="space-y-2 mb-4">
                  {schedule.overrides.map((ov, idx) => (
                    <div key={idx} className="flex items-center gap-4 px-4 py-3 bg-[#141414] border border-[#2B2B2B] rounded-lg">
                      <span className="text-[13px] text-white font-medium w-28">{ov.date}</span>
                      {ov.isOff ? (
                        <span className="text-[13px] text-[#52525B]">Unavailable</span>
                      ) : (
                        <span className="text-[13px] text-[#A1A1AA]">{fmt(ov.startTime)} - {fmt(ov.endTime)}</span>
                      )}
                      <button onClick={() => setSchedule(p => ({
                        ...p, overrides: p.overrides.filter((_,j) => j !== idx)
                      }))} className="ml-auto text-[#52525B] hover:text-red-400 transition-colors">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={() => setSchedule(p => ({
                ...p,
                overrides: [...(p.overrides || []), { date: new Date().toISOString().split('T')[0], startTime: '09:00', endTime: '17:00', isOff: false }]
              }))} className="flex items-center gap-2 px-4 py-2 border border-[#2B2B2B] rounded-lg text-[13px] text-[#A1A1AA] hover:border-[#3F3F46] hover:text-white transition-colors">
                <Plus className="w-4 h-4" /> Add an override
              </button>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="w-[280px] shrink-0 space-y-4">
            {/* Timezone */}
            <div className="bg-[#141414] border border-[#2B2B2B] rounded-xl p-4">
              <label className="block text-[13px] font-bold text-white mb-3">Timezone</label>
              <div className="relative">
                <select value={schedule.timezone} onChange={e => setSchedule(p => ({ ...p, timezone: e.target.value }))}
                  className="w-full h-10 pl-3 pr-8 bg-[#1A1A1A] border border-[#3F3F46] rounded-lg text-[13px] text-white focus:outline-none focus:border-[#71717A] appearance-none transition-colors">
                  {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-3 w-4 h-4 text-[#71717A] pointer-events-none" />
              </div>
            </div>

            {/* Troubleshooter */}
            <div className="bg-[#141414] border border-[#2B2B2B] rounded-xl p-4 space-y-3">
              <p className="text-[13px] font-semibold text-white">Something doesn't look right?</p>
              <button className="px-4 py-2 border border-[#3F3F46] rounded-lg text-[13px] text-[#A1A1AA] hover:border-[#71717A] hover:text-white transition-colors">
                Launch troubleshooter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
