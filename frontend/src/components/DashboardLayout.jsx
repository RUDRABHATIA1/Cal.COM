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
  Search,
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';

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

const SidebarItem = ({ icon: Icon, label, path, active, badge }) => (
  <Link
    to={path}
    className={`flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] font-medium transition-colors ${
      active
        ? 'bg-[#2B2B2B] text-white'
        : 'text-[#A1A1AA] hover:bg-[#1E1E1E] hover:text-white'
    }`}
  >
    <Icon className="w-4 h-4 shrink-0" />
    <span className="flex-1">{label}</span>
    {badge && <span className="text-[11px] bg-[#3F3F46] text-[#A1A1AA] px-1.5 py-0.5 rounded">{badge}</span>}
  </Link>
);

export default function DashboardLayout({ children, title, subtitle, actions }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
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

      {/* ── Sidebar ────────────────────────────────────── */}
      <aside className="w-[220px] shrink-0 fixed inset-y-0 left-0 flex flex-col bg-[#101010] border-r border-[#2B2B2B] z-20">

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
                        className={`block px-3 py-1.5 rounded-md text-[13px] transition-colors ${
                          location.pathname === '/dashboard/apps' ? 'bg-[#1E1E1E] text-white font-semibold' : 'text-[#A1A1AA] hover:text-white hover:bg-[#1A1A1A]'
                        }`}>
                        App store
                      </Link>
                      <Link to="/dashboard/apps/installed"
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
            onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/${user?.username}`); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] text-[#A1A1AA] hover:bg-[#1E1E1E] hover:text-white transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copy public page link
          </button>
          <Link
            to="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-[13px] text-[#A1A1AA] hover:bg-[#1E1E1E] hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────── */}
      <main className="flex-1 ml-[220px] min-h-screen">
        {/* Page header */}
        <div className="sticky top-0 z-10 border-b border-[#2B2B2B] bg-[#101010] px-8 py-5">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[22px] font-bold text-white">{title}</h1>
              {subtitle && <p className="text-[#71717A] text-sm mt-0.5">{subtitle}</p>}
            </div>
            {actions && <div className="ml-4 flex items-center gap-2">{actions}</div>}
          </div>
        </div>

        {/* Page body */}
        <motion.div
          className="px-8 py-6"
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
