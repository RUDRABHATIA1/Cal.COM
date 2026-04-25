import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft, ExternalLink, Link as LinkIcon, Code2, Trash2, Loader2,
  Sparkles, Calendar, Clock, SlidersHorizontal, Repeat2,
  Grid3X3, Zap, Webhook, ChevronRight, ChevronDown, Plus, X,
  Bold, Italic, Link2, Search, Users, GitBranch, BarChart2, Settings,
  LogOut, Copy, ExternalLink as Ext, Pencil, Check, Mail, Phone
} from 'lucide-react';
import api from '../../utils/api';

// ── Main sidebar nav items (same as DashboardLayout) ─────────────────────
const NAV = [
  { icon: LinkIcon,       label: 'Event Types',  path: '/dashboard' },
  { icon: Clock,          label: 'Bookings',     path: '/dashboard/bookings' },
  { icon: Calendar,       label: 'Availability', path: '/dashboard/availability' },
  { icon: Users,          label: 'Teams',        path: '/dashboard/teams' },
  { icon: Grid3X3,        label: 'Apps',         path: '/dashboard/apps' },
  { icon: GitBranch,      label: 'Routing',      path: '/dashboard/routing-forms' },
  { icon: Zap,            label: 'Workflows',    path: '/dashboard/workflows' },
  { icon: BarChart2,      label: 'Insights',     path: '/dashboard/insights' },
];

// ── Secondary sub-nav (inside edit page) ─────────────────────────────────
const SUBNAV = [
  { id: 'basics',       icon: Sparkles,         label: 'Basics',       sub: '' },
  { id: 'availability', icon: Calendar,         label: 'Availability', sub: 'Working hours' },
  { id: 'limits',       icon: Clock,            label: 'Limits',       sub: 'How often you can be booked' },
  { id: 'advanced',     icon: SlidersHorizontal,label: 'Advanced',     sub: 'Calendar settings & more...' },
  { id: 'recurring',    icon: Repeat2,          label: 'Recurring',    sub: 'Set up a repeating schedule' },
  { id: 'apps',         icon: Grid3X3,          label: 'Apps',         sub: '0 apps, 0 active' },
  { id: 'workflows',    icon: Zap,              label: 'Workflows',    sub: '0 active' },
  { id: 'webhooks',     icon: Webhook,          label: 'Webhooks',     sub: '0 active' },
];

export default function EditEventType() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [event, setEvent]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [tab, setTab]         = useState('basics');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  // Limits tab state
  const [limits, setLimits] = useState({
    bufferBefore: 'No buffer time',
    bufferAfter: 'No buffer time',
    minimumNotice: '2',
    minimumNoticeUnit: 'Hours',
    timeSlotInterval: 'Use event length (default)',
    limitFrequency: false,
    firstSlotOnly: false,
    limitDuration: false,
    limitPerBooker: false,
    limitFuture: false,
  });
  const setLimit = (k, v) => setLimits(p => ({ ...p, [k]: v }));

  // Availability schedule (matches Cal.com default)
  const DAYS = [
    { day: 'Sunday',    available: false },
    { day: 'Monday',    available: true,  start: '9:00 AM',  end: '5:00 PM' },
    { day: 'Tuesday',   available: true,  start: '9:00 AM',  end: '5:00 PM' },
    { day: 'Wednesday', available: true,  start: '9:00 AM',  end: '5:00 PM' },
    { day: 'Thursday',  available: true,  start: '9:00 AM',  end: '5:00 PM' },
    { day: 'Friday',    available: true,  start: '9:00 AM',  end: '5:00 PM' },
    { day: 'Saturday',  available: false },
  ];

  useEffect(() => {
    api.get(`/event-types/${id}`)
      .then(r => setEvent({
        title:                r.data.title || '',
        slug:                 r.data.slug  || '',
        description:          r.data.description || '',
        length:               r.data.length || 30,
        location:             r.data.location || 'Cal Video (Default)',
        requiresConfirmation: r.data.requiresConfirmation || false,
        hidden:               r.data.hidden || false,
      }))
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k, v) => setEvent(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch(`/event-types/${id}`, event);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { alert('Save failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${event?.title}"?`)) return;
    await api.delete(`/event-types/${id}`);
    navigate('/dashboard');
  };

  const SidebarContent = () => (
    <>
      {/* User */}
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

      {/* Search */}
      <div className="px-3 py-2 border-b border-[#2B2B2B]">
        <div className="flex items-center gap-2 px-2 py-1.5 bg-[#1A1A1A] border border-[#2B2B2B] rounded-md">
          <Search className="w-3.5 h-3.5 text-[#52525B]" />
          <span className="text-[13px] text-[#52525B]">Search</span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(item => (
          <Link key={item.path} to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] font-medium transition-colors ${
              item.path === '/dashboard' 
                ? 'bg-[#2B2B2B] text-white'
                : 'text-[#A1A1AA] hover:bg-[#1E1E1E] hover:text-white'
            }`}>
            <item.icon className="w-4 h-4 shrink-0" />
            <span className="flex-1">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-[#2B2B2B] space-y-0.5">
        <a href={`/${user?.username}`} target="_blank" rel="noreferrer"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-[13px] text-[#A1A1AA] hover:bg-[#1E1E1E] hover:text-white">
          <Ext className="w-4 h-4" />View public page
        </a>
        <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${user?.username}`)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] text-[#A1A1AA] hover:bg-[#1E1E1E] hover:text-white">
          <Copy className="w-4 h-4" />Copy public page link
        </button>
        <Link to="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-md text-[13px] text-[#A1A1AA] hover:bg-[#1E1E1E] hover:text-white">
          <Settings className="w-4 h-4" />Settings
        </Link>
      </div>
    </>
  );

  if (loading) return (
    <div className="min-h-screen bg-[#101010] flex items-center justify-center">
      <Loader2 className="w-7 h-7 animate-spin text-[#52525B]" />
    </div>
  );

  if (!event) return (
    <div className="min-h-screen bg-[#101010] flex flex-col items-center justify-center text-center px-4">
      <div className="w-14 h-14 rounded-full bg-[#1A1A1A] grid place-items-center mb-5 text-[#52525B]">
        <Settings className="w-7 h-7" />
      </div>
      <h2 className="text-lg font-bold text-white mb-2">Event type not found</h2>
      <p className="text-[#71717A] text-sm mb-6 max-w-xs">
        This event type no longer exists (the server may have restarted).
      </p>
      <button onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 h-9 px-5 bg-white text-[#111827] text-sm font-semibold rounded-lg hover:bg-[#f4f4f5]">
        <ArrowLeft className="w-4 h-4" />Back to Event Types
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#101010]">

      {/* ══ MAIN SIDEBAR (Desktop) ══════════════════════════════════════ */}
      <aside className="hidden lg:flex w-[220px] shrink-0 fixed inset-y-0 left-0 flex flex-col bg-[#101010] border-r border-[#2B2B2B] z-20">
        <SidebarContent />
      </aside>

      {/* ══ MAIN SIDEBAR (Mobile Drawer) ════════════════════════════════ */}
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

      {/* ══ MAIN CONTENT ═══════════════════════════════════════════════ */}
      <div className="flex-1 lg:ml-[220px] flex flex-col min-h-screen">

        {/* ── Top header bar ──────────────────────────────────────── */}
        <header className="sticky top-0 z-10 bg-[#101010]/80 backdrop-blur-md border-b border-[#2B2B2B] px-4 h-14 flex items-center gap-3">
          <button 
            onClick={() => setShowMobileNav(true)}
            className="lg:hidden p-2 rounded-md text-[#71717A] hover:bg-[#1E1E1E] hover:text-white"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
          
          <button onClick={() => navigate('/dashboard')}
            className="hidden sm:block p-1.5 rounded-md text-[#71717A] hover:bg-[#1E1E1E] hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-[16px] sm:text-[18px] font-bold text-white flex-1 truncate">{event.title}</h1>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <div className="hidden md:flex items-center gap-2 pr-2 mr-1 border-r border-[#2B2B2B]">
              <span className="text-[13px] text-[#71717A]">Hidden</span>
              <button onClick={() => set('hidden', !event.hidden)}
                className={`relative inline-flex h-5 w-9 cursor-pointer rounded-full border-2 border-transparent transition-colors ${event.hidden ? 'bg-[#3F3F46]' : 'bg-[#0ea5e9]'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${event.hidden ? 'translate-x-0' : 'translate-x-4'}`} />
              </button>
            </div>

            <div className="flex items-center gap-0.5 sm:pr-2 sm:mr-1 sm:border-r border-[#2B2B2B]">
              <IconBtn icon={<ExternalLink className="w-4 h-4" />} title="Preview" onClick={() => window.open(`/user/${event.slug}`, '_blank')} />
              <button className="sm:hidden p-2 text-[#71717A]" onClick={() => set('hidden', !event.hidden)}>
                 {event.hidden ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
              </button>
              <IconBtn icon={<Trash2 className="w-4 h-4" />} title="Delete" onClick={handleDelete} className="hidden sm:flex" />
            </div>

            <button onClick={handleSave} disabled={saving}
              className={`h-8 sm:h-9 px-3 sm:px-5 rounded-lg text-[12px] sm:text-[13px] font-semibold transition-all flex items-center gap-2 ${
                saved ? 'bg-emerald-600 text-white' : 'bg-white text-[#111827] hover:bg-[#f4f4f5]'
              } disabled:opacity-60`}>
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {saved ? '✓ Saved' : saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </header>

        {/* ── Body: sub-nav + content ───────────────────────────── */}
        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">

          {/* Secondary sub-nav */}
          <nav className="w-full md:w-[220px] shrink-0 border-b md:border-b-0 md:border-r border-[#2B2B2B] flex md:flex-col overflow-x-auto md:overflow-y-auto no-scrollbar py-2 md:py-4 px-3 space-x-1 md:space-x-0 md:space-y-0.5">
            {SUBNAV.map(item => {
              const isActive = tab === item.id;
              const displaySub = item.id === 'basics' ? `${event.length} mins` : item.sub;
              return (
                <button key={item.id} onClick={() => setTab(item.id)}
                  className={`flex-shrink-0 flex items-center gap-3 px-3 py-2 md:py-2.5 rounded-lg text-left transition-colors ${
                    isActive ? 'bg-[#1E1E1E] text-white' : 'text-[#A1A1AA] hover:bg-[#1A1A1A] hover:text-white'
                  }`}>
                  <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#52525B]'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] sm:text-[13.5px] font-semibold leading-tight whitespace-nowrap">{item.label}</div>
                    {displaySub && (
                      <div className={`hidden md:block text-[11.5px] truncate leading-tight mt-0.5 ${isActive ? 'text-[#A1A1AA]' : 'text-[#52525B]'}`}>
                        {displaySub}
                      </div>
                    )}
                  </div>
                  {isActive && <ChevronRight className="hidden md:block w-3.5 h-3.5 text-[#52525B] shrink-0" />}
                </button>
              );
            })}
          </nav>

          {/* Content panel */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
            {tab === 'basics' && (
              <div className="max-w-2xl space-y-6">
                <FormField label="Title">
                  <DarkInput value={event.title} onChange={v => set('title', v)} placeholder="Quick Chat" />
                </FormField>

                <FormField label="Description">
                  <div className="border border-[#3F3F46] rounded-lg overflow-hidden focus-within:border-[#71717A] transition-colors">
                    <div className="flex items-center gap-1 px-3 py-2 border-b border-[#3F3F46]">
                      <span className="text-[13px] text-[#A1A1AA] font-medium">Normal</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#52525B] mr-2" />
                      <div className="h-4 w-[1px] bg-[#3F3F46] mx-1" />
                      <ToolbarBtn icon={<Bold className="w-3.5 h-3.5" />} />
                      <ToolbarBtn icon={<Italic className="w-3.5 h-3.5" />} />
                      <ToolbarBtn icon={<Link2 className="w-3.5 h-3.5" />} />
                    </div>
                    <textarea
                      rows={4}
                      value={event.description}
                      onChange={e => set('description', e.target.value)}
                      placeholder="A quick video meeting."
                      className="w-full px-3 py-2.5 bg-[#1A1A1A] text-[14px] text-white placeholder:text-[#52525B] focus:outline-none resize-none"
                    />
                  </div>
                </FormField>

                <FormField label="URL">
                  <div className="flex flex-col sm:flex-row bg-[#1A1A1A] border border-[#3F3F46] rounded-lg overflow-hidden focus-within:border-[#71717A] transition-colors">
                    <span className="flex items-center px-3 border-b sm:border-b-0 sm:border-r border-[#3F3F46] text-[#52525B] text-[12px] sm:text-[13px] whitespace-nowrap py-2 sm:py-2.5 bg-[#141414]">
                      cal.com/{user?.username}/
                    </span>
                    <input
                      type="text"
                      value={event.slug}
                      onChange={e => set('slug', e.target.value)}
                      className="flex-1 px-3 py-2.5 bg-transparent text-[14px] text-white placeholder:text-[#52525B] focus:outline-none"
                    />
                  </div>
                </FormField>

                <FormField label="Duration">
                  <div className="flex bg-[#1A1A1A] border border-[#3F3F46] rounded-lg overflow-hidden focus-within:border-[#71717A] transition-colors mb-3">
                    <input
                      type="number"
                      value={event.length}
                      onChange={e => set('length', parseInt(e.target.value) || 30)}
                      className="flex-1 px-3 py-2.5 bg-transparent text-[14px] text-white focus:outline-none"
                    />
                    <span className="flex items-center px-3 border-l border-[#3F3F46] text-[#52525B] text-[13px]">Minutes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setAllowMultiple(v => !v)}
                      className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full border-2 border-transparent transition-colors ${allowMultiple ? 'bg-[#0ea5e9]' : 'bg-[#3F3F46]'}`}>
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${allowMultiple ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    <span className="text-[14px] text-[#D4D4D8]">Allow multiple durations</span>
                  </div>
                </FormField>

                <FormField label="Location">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#3F3F46] rounded-lg px-3 py-2.5">
                      <span className="text-base">📹</span>
                      <select
                        value={event.location}
                        onChange={e => set('location', e.target.value)}
                        className="flex-1 bg-transparent text-[14px] text-white focus:outline-none"
                      >
                        <option value="Cal Video (Default)">Cal Video (Default)</option>
                        <option value="Google Meet">Google Meet</option>
                        <option value="Zoom">Zoom Video Conference</option>
                        <option value="Microsoft Teams">Microsoft Teams</option>
                        <option value="In Person">In Person Meeting</option>
                        <option value="Phone">Phone Call</option>
                      </select>
                    </div>

                    <button className="w-full flex items-center justify-between px-3 py-2 text-[13px] text-[#A1A1AA] hover:text-white border border-[#2B2B2B] rounded-lg transition-colors">
                      <span>Show advanced settings</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    <button className="flex items-center gap-2 text-[13px] text-[#A1A1AA] hover:text-white px-1 transition-colors">
                      <Plus className="w-4 h-4" />
                      Add a location
                    </button>
                  </div>
                </FormField>
              </div>
            )}

            {tab === 'availability' && (
              <div className="max-w-2xl space-y-4">
                <h2 className="text-[16px] font-bold text-white">Availability</h2>
                <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#3F3F46] rounded-lg px-4 py-2.5">
                  <span className="flex-1 text-[14px] text-white font-medium">Working hours</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#1D4ED8] text-white text-[11px] font-bold uppercase tracking-wide">Default</span>
                  <ChevronDown className="w-4 h-4 text-[#71717A] ml-2" />
                </div>
                <div className="bg-[#141414] border border-[#2B2B2B] rounded-xl overflow-hidden">
                  {DAYS.map((d, i) => (
                    <div key={d.day} className={`flex items-center px-4 sm:px-6 py-4 ${i < DAYS.length - 1 ? 'border-b border-[#2B2B2B]' : ''}`}>
                      <span className={`w-24 sm:w-32 text-[13px] sm:text-[14px] font-semibold ${d.available ? 'text-white' : 'text-[#52525B] line-through'}`}>
                        {d.day}
                      </span>
                      {d.available ? (
                        <div className="flex items-center gap-2 sm:gap-4 text-[13px] sm:text-[14px] text-[#A1A1AA]">
                          <span className="text-white">{d.start}</span>
                          <span className="text-[#52525B]">–</span>
                          <span className="text-white">{d.end}</span>
                        </div>
                      ) : (
                        <span className="text-[13px] sm:text-[14px] text-[#52525B]">Unavailable</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border border-[#2B2B2B] rounded-xl px-5 py-3.5 bg-[#141414] gap-4">
                  <div className="flex items-center gap-2 text-[13px] text-[#A1A1AA]">
                    <span>🌐</span>
                    <span>Europe/London</span>
                  </div>
                  <button className="flex items-center justify-center gap-1.5 text-[13px] font-semibold text-white hover:text-[#A1A1AA] transition-colors">
                    Edit availability
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {tab === 'limits' && (
              <div className="max-w-2xl space-y-4">
                <div className="bg-[#141414] border border-[#2B2B2B] rounded-xl overflow-hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 border-b border-[#2B2B2B]">
                    <div>
                      <label className="block text-[13px] font-semibold text-white mb-2">Before event</label>
                      <DarkSelect
                        value={limits.bufferBefore}
                        onChange={v => setLimit('bufferBefore', v)}
                        options={['No buffer time','5 minutes','10 minutes','15 minutes','30 minutes','1 hour']}
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-white mb-2">After event</label>
                      <DarkSelect
                        value={limits.bufferAfter}
                        onChange={v => setLimit('bufferAfter', v)}
                        options={['No buffer time','5 minutes','10 minutes','15 minutes','30 minutes','1 hour']}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5">
                    <div>
                      <label className="block text-[13px] font-semibold text-white mb-2">Minimum notice</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={limits.minimumNotice}
                          onChange={e => setLimit('minimumNotice', e.target.value)}
                          className="flex-1 sm:w-20 px-3 py-2 bg-[#1A1A1A] border border-[#3F3F46] rounded-lg text-[14px] text-white focus:outline-none focus:border-[#71717A]"
                        />
                        <DarkSelect
                          value={limits.minimumNoticeUnit}
                          onChange={v => setLimit('minimumNoticeUnit', v)}
                          options={['Minutes','Hours','Days']}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-white mb-2">Time-slot intervals</label>
                      <DarkSelect
                        value={limits.timeSlotInterval}
                        onChange={v => setLimit('timeSlotInterval', v)}
                        options={['Use event length (default)','5 minutes','10 minutes','15 minutes','20 minutes','30 minutes','45 minutes','1 hour']}
                      />
                    </div>
                  </div>
                </div>

                {[
                  { key: 'limitFrequency', label: 'Limit booking frequency',           desc: 'Limit how many times this event can be booked.' },
                  { key: 'firstSlotOnly',  label: 'Only show first slot of day', desc: 'Limit your availability to one slot per day.' },
                  { key: 'limitDuration',  label: 'Limit total booking duration',       desc: 'Limit total amount of time that this event can be booked' },
                  { key: 'limitPerBooker', label: 'Limit bookings per booker', desc: 'Limit the number of active bookings a booker can make.' },
                  { key: 'limitFuture',    label: 'Limit future bookings',              desc: 'Limit how far in the future this event can be booked.' },
                ].map(item => (
                  <div key={item.key} className="flex items-start justify-between bg-[#141414] border border-[#2B2B2B] rounded-xl p-5">
                    <div className="pr-6 flex-1">
                      <p className="text-[14px] font-bold text-white">{item.label}</p>
                      <p className="text-[12px] sm:text-[13px] text-[#71717A] mt-1 line-clamp-2">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setLimit(item.key, !limits[item.key])}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors mt-0.5 ${
                        limits[item.key] ? 'bg-[#0ea5e9]' : 'bg-[#3F3F46]'
                      }`}
                    >
                      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${limits[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {tab === 'advanced' && (
              <div className="max-w-2xl space-y-4">
                <AdvSection>
                  <AdvHeading>Calendar event name</AdvHeading>
                  <div className="flex items-center bg-[#1A1A1A] border border-[#3F3F46] rounded-lg overflow-hidden focus-within:border-[#71717A] transition-colors">
                    <input
                      type="text"
                      defaultValue={`${event.title} between ${user?.name || 'Host'} and {Scheduler}`}
                      className="flex-1 px-3 py-2.5 bg-transparent text-[14px] text-white focus:outline-none placeholder:text-[#52525B]"
                    />
                    <button className="px-3 text-[#71717A] hover:text-white transition-colors"><Pencil className="w-4 h-4" /></button>
                  </div>
                </AdvSection>

                <AdvSection>
                  <AdvHeading>Add to calendar</AdvHeading>
                  <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#3F3F46] rounded-lg px-3 py-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-[#1D4ED8] text-white text-[11px] font-bold uppercase hidden sm:block">Default</span>
                    <span className="flex-1 text-[13px] sm:text-[14px] text-[#A1A1AA] truncate">{user?.email || 'you@example.com'}</span>
                    <ChevronDown className="w-4 h-4 text-[#71717A]" />
                  </div>
                </AdvSection>

                <AdvSection>
                  <AdvHeading>Layout</AdvHeading>
                  <p className="text-[13px] text-[#71717A] mb-4">You can select multiple and your bookers can switch views.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {[{label:'Month', sub:'Default'},{label:'Weekly'},{label:'Column'}].map(v => (
                      <div key={v.label} className="border-2 border-[#3F3F46] rounded-xl overflow-hidden cursor-pointer hover:border-[#71717A] transition-colors">
                        <div className="bg-[#0D0D0D] h-20 sm:h-24 p-2 relative">
                          <div className="flex items-center gap-1 mb-1.5"><div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#2B2B2B]" /><div className="h-1 sm:h-1.5 w-8 sm:w-12 bg-[#2B2B2B] rounded" /></div>
                          <div className="grid grid-cols-4 gap-0.5">{Array(12).fill(0).map((_,i) => <div key={i} className="h-2 sm:h-2.5 bg-[#1E1E1E] rounded-sm" />)}</div>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1.5 bg-[#141414]">
                          <div className="w-4 h-4 rounded border border-[#3F3F46] bg-[#1D4ED8] flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>
                          <span className="text-[12px] sm:text-[13px] font-medium text-white">{v.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </AdvSection>

                <AdvSection>
                  <AdvHeading>Booking questions</AdvHeading>
                  <div className="space-y-2 border border-[#2B2B2B] rounded-xl overflow-hidden">
                    {[
                      { label: 'Name', type: 'Required' },
                      { label: 'Email', type: 'Required' },
                      { label: 'Notes', type: 'Optional' },
                    ].map((q, i, arr) => (
                      <div key={q.label} className={`flex items-center px-4 py-3 bg-[#141414] ${i < arr.length-1 ? 'border-b border-[#2B2B2B]' : ''}`}>
                        <div className="flex-1"><div className="text-[14px] font-semibold text-white">{q.label}</div><div className="text-[12px] text-[#52525B]">{q.type}</div></div>
                        <button className="px-3 py-1.5 border border-[#3F3F46] rounded-lg text-[12px] font-semibold text-[#A1A1AA] hover:text-white transition-colors">Edit</button>
                      </div>
                    ))}
                  </div>
                </AdvSection>
              </div>
            )}

            {tab !== 'basics' && tab !== 'availability' && tab !== 'limits' && tab !== 'advanced' && (
              <div className="max-w-2xl">
                <div className="bg-[#141414] border border-[#2B2B2B] rounded-xl p-8 sm:p-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#1A1A1A] grid place-items-center mx-auto mb-4 text-[#52525B]">
                    {React.createElement(SUBNAV.find(n => n.id === tab)?.icon || Settings, { className: 'w-6 h-6' })}
                  </div>
                  <h3 className="text-[16px] font-bold text-white mb-2">{SUBNAV.find(n => n.id === tab)?.label}</h3>
                  <p className="text-[#71717A] text-[13px] max-w-xs mx-auto">This section is coming soon.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helper components ─────────────────────────────────────────────────────
function IconBtn({ icon, title, onClick }) {
  return (
    <button onClick={onClick} title={title}
      className="p-2 rounded-md text-[#71717A] hover:bg-[#1E1E1E] hover:text-white transition-colors">
      {icon}
    </button>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-[14px] font-semibold text-white mb-2">{label}</label>
      {children}
    </div>
  );
}

function DarkInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-10 px-3 bg-[#1A1A1A] border border-[#3F3F46] rounded-lg text-[14px] text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#71717A] transition-colors"
    />
  );
}

function ToolbarBtn({ icon }) {
  return (
    <button className="p-1.5 rounded text-[#71717A] hover:text-white hover:bg-[#2B2B2B] transition-colors">
      {icon}
    </button>
  );
}

function DarkSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full h-10 px-3 bg-[#1A1A1A] border border-[#3F3F46] rounded-lg text-[14px] text-white focus:outline-none focus:border-[#71717A] transition-colors"
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function AdvSection({ children }) {
  return (
    <div className="bg-[#141414] border border-[#2B2B2B] rounded-xl p-5 space-y-3">
      {children}
    </div>
  );
}

function AdvHeading({ children }) {
  return <h3 className="text-[14px] font-bold text-white">{children}</h3>;
}
