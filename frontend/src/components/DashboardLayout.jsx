import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Link as LinkIcon,
  Clock,
  Calendar,
  Grid,
  Zap,
  BarChart2,
  Settings,
  Users,
  GitBranch,
  ChevronDown,
  ExternalLink,
  Copy,
  LogOut,
  LayoutDashboard,
  Database,
  ShieldCheck,
  ShieldAlert,
  Search
} from 'lucide-react';
import api from '../utils/api';

// side se jo appear ho rahi hai chize that kind of transition 
const sidebarVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: 'easeOut'
    }
  })
};

const submenuVariants = {
  hidden: { opacity: 0, height: 0, overflow: 'hidden' },
  visible: { 
    opacity: 1, 
    height: 'auto',
    transition: { duration: 0.2, ease: 'easeInOut' }
  },
  exit: { 
    opacity: 0, 
    height: 0,
    transition: { duration: 0.2, ease: 'easeInOut' }
  }
};

const StatRow = ({ label, value, primary, success }) => (
  <div className="flex items-center justify-between py-2 border-b border-[#2B2B2B] last:border-0">
    <span className="text-[13px] text-[#71717A]">{label}</span>
    <span className={`text-[14px] font-mono ${
      primary ? 'text-emerald-400 font-bold' : 
      success ? 'text-emerald-500' :
      value === 'NO' ? 'text-red-500' : 'text-white'
    }`}>
      {value}
    </span>
  </div>
);

export default function DashboardLayout({ children, title, subtitle, actions }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [dbData, setDbData] = useState(null);
  const [checkingDb, setCheckingDb] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const checkDatabase = async () => {
    setCheckingDb(true);
    try {
      const res = await api.get('/debug/db');
      setDbData(res.data);
    } catch {
      setDbData({ error: 'Could not connect to API' });
    } finally {
      setCheckingDb(false);
    }
  };

  const navItems = [
    { icon: LinkIcon,   label: 'Event Types',   path: '/dashboard' },
    { icon: Clock,      label: 'Bookings',       path: '/dashboard/bookings' },
    { icon: Calendar,   label: 'Availability',   path: '/dashboard/availability' },
    { icon: Users,      label: 'Teams',          path: '/dashboard/teams' },
    { icon: Grid,       label: 'Apps',           path: '/dashboard/apps' },
    { icon: GitBranch,  label: 'Routing',        path: '/dashboard/routing-forms' },
    { icon: Zap,        label: 'Workflows',      path: '/dashboard/workflows' },
    { icon: BarChart2,  label: 'Insights',       path: '/dashboard/insights' },
  ];

  const INSIGHTS_SUB = [
    { label: 'Bookings',        path: '/dashboard/insights/bookings' },
    { label: 'Routing',         path: '/dashboard/insights/routing' },
    { label: 'Router position', path: '/dashboard/insights/router-position' },
    { label: 'Call history',    path: '/dashboard/insights/call-history' },
    { label: 'Wrong routing',   path: '/dashboard/insights/wrong-routing' },
  ];

  return (
    <div className="flex min-h-screen bg-[#101010]">

      {/* ── Mobile Sidebar Overlay ────────────────────── */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMobileMenu(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ────────────────────────────────────── */}
      <aside className={`
        w-[220px] shrink-0 fixed inset-y-0 left-0 flex flex-col bg-[#101010] border-r border-[#2B2B2B] z-50
        transition-transform duration-300 md:translate-x-0
        ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}
      `}>

        {/* User header */}
        <div className="px-3 py-3 border-b border-[#2B2B2B]">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-[#1E1E1E] transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-[11px] font-bold uppercase shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <span className="flex-1 text-left text-[13px] font-semibold text-white truncate">
              {user?.name || 'User'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
          </button>

          {showUserMenu && (
            <div className="mt-1 mx-1 border border-[#2B2B2B] rounded-lg bg-[#1A1A1A] overflow-hidden shadow-xl">
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-[#A1A1AA] hover:bg-[#2B2B2B] hover:text-white transition-colors">
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

        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item, i) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            const isApps = item.path === '/dashboard/apps';

            return (
              <motion.div 
                key={item.path}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={sidebarVariants}
              >
                <Link to={item.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] font-medium transition-all duration-200 ${
                    isActive ? 'bg-[#2B2B2B] text-white shadow-sm' : 'text-[#A1A1AA] hover:bg-[#1E1E1E] hover:text-white'
                  }`}>
                  <item.icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-[#71717A]'}`} />
                  <span className="flex-1">{item.label}</span>
                  {isApps && <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isActive ? 'rotate-0' : '-rotate-90'}`} />}
                </Link>
                
                <AnimatePresence>
                  {/* Apps sub-nav */}
                  {isApps && isActive && (
                    <motion.div 
                      variants={submenuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="ml-7 mt-0.5 space-y-0.5"
                    >
                      <Link to="/dashboard/apps"
                        onClick={() => setShowMobileMenu(false)}
                        className={`block px-3 py-1.5 rounded-md text-[13px] transition-colors ${
                          location.pathname === '/dashboard/apps' ? 'bg-[#1E1E1E] text-white font-semibold' : 'text-[#A1A1AA] hover:text-white hover:bg-[#1A1A1A]'
                        }`}>
                        App store
                      </Link>
                      <Link to="/dashboard/apps/installed"
                        onClick={() => setShowMobileMenu(false)}
                        className={`block px-3 py-1.5 rounded-md text-[13px] transition-colors ${
                          location.pathname === '/dashboard/apps/installed' ? 'bg-[#1E1E1E] text-white font-semibold' : 'text-[#A1A1AA] hover:text-white hover:bg-[#1A1A1A]'
                        }`}>
                        Installed apps
                      </Link>
                    </motion.div>
                  )}

                  {/* Insights sub-nav */}
                  {item.path === '/dashboard/insights' && isActive && (
                    <motion.div 
                      variants={submenuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="ml-7 mt-0.5 space-y-0.5"
                    >
                      {INSIGHTS_SUB.map(sub => (
                        <Link key={sub.path} to={sub.path}
                          onClick={() => setShowMobileMenu(false)}
                          className={`block px-3 py-1.5 rounded-md text-[13px] transition-colors ${
                            location.pathname === sub.path ? 'bg-[#1E1E1E] text-white font-semibold' : 'text-[#A1A1AA] hover:text-white hover:bg-[#1A1A1A]'
                          }`}>
                          {sub.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </nav>

        {/* Bottom links */}
        <div className="px-3 py-3 border-t border-[#2B2B2B] space-y-0.5">
          <a
            href={`/${user?.username}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-[13px] text-[#A1A1AA] hover:bg-[#1E1E1E] hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View public page
          </a>
          <button
            onClick={() => { 
              navigator.clipboard.writeText(`${window.location.origin}/${user?.username}`);
              setShowMobileMenu(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] text-[#A1A1AA] hover:bg-[#1E1E1E] hover:text-white transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copy public page link
          </button>
          <Link
            to="/dashboard/settings"
            onClick={() => setShowMobileMenu(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-[13px] text-[#A1A1AA] hover:bg-[#1E1E1E] hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>

          <button
            onClick={checkDatabase}
            disabled={checkingDb}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[11px] font-bold uppercase tracking-wider text-[#52525B] hover:text-emerald-400 hover:bg-emerald-400/5 transition-all mt-4 border border-[#2B2B2B] group"
          >
            <Database className="w-3.5 h-3.5 group-hover:animate-pulse" />
            {checkingDb ? 'Checking...' : 'DB Status'}
            {dbData && (
              <span className={`ml-auto w-2 h-2 rounded-full ${dbData.mongodb_connected ? 'bg-emerald-500' : 'bg-red-500'}`} />
            )}
          </button>
        </div>
      </aside>

      {/* DB Stats Overlay */}
      <AnimatePresence>
        {dbData && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setDbData(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-8 max-w-sm w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <Database className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Database Diagnostics</h3>
                <button onClick={() => setDbData(null)} className="ml-auto text-[#71717A] hover:text-white"><LogOut className="w-4 h-4 rotate-180" /></button>
              </div>
              
              <div className="space-y-4">
                <StatRow label="MongoDB Connected" value={dbData.mongodb_connected ? 'YES' : 'NO'} success={dbData.mongodb_connected} />
                <StatRow label="Stored Bookings" value={dbData.bookings} primary />
                <StatRow label="Event Types" value={dbData.eventTypes} />
                <StatRow label="Teams Created" value={dbData.teams} />
                <StatRow label="Environment" value={dbData.env} />
              </div>

              <div className="mt-8 pt-6 border-t border-[#2B2B2B]">
                <p className="text-[12px] text-[#71717A] leading-relaxed">
                  These counts are fetched directly from the database server. If the counts are greater than 0, your data exists and is safe.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content ────────────────────────────────── */}
      <main className="flex-1 md:ml-[220px] min-h-screen">
        {/* Page header */}
        <div className="sticky top-0 z-10 border-b border-[#2B2B2B] bg-[#101010] px-4 md:px-8 py-4 md:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowMobileMenu(true)}
                className="p-1.5 rounded-md hover:bg-[#1E1E1E] md:hidden text-[#71717A] hover:text-white transition-colors"
              >
                <Grid className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-[18px] md:text-[22px] font-bold text-white leading-tight">{title}</h1>
                {subtitle && <p className="hidden sm:block text-[#71717A] text-sm mt-0.5">{subtitle}</p>}
              </div>
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </div>

        {/* Page body */}
        <motion.div
          className="px-4 md:px-8 py-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </main>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2B2B2B; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
}
