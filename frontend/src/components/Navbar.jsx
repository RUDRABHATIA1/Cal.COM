import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ChevronDown, Globe, Zap, Shield, Sparkles, LayoutGrid, Users, Building2, BookText, Code, User, Network, Send, DollarSign, GraduationCap, PhoneCall, FlaskConical, MessageSquare, BarChart3, FileText, Layers, Terminal, Smartphone, Moon, CreditCard, Newspaper, Webhook } from 'lucide-react';

const BlueprintBox = ({ children }) => (
  <div className="relative w-11 h-11 min-w-[44px] rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
    {/* Corner Dots */}
    <div className="absolute top-[3px] left-[3px] w-[3px] h-[3px] rounded-full bg-gray-200" />
    <div className="absolute top-[3px] right-[3px] w-[3px] h-[3px] rounded-full bg-gray-200" />
    <div className="absolute bottom-[3px] left-[3px] w-[3px] h-[3px] rounded-full bg-gray-200" />
    <div className="absolute bottom-[3px] right-[3px] w-[3px] h-[3px] rounded-full bg-gray-200" />
    <div className="relative z-10 text-gray-700">{children}</div>
  </div>
);

const NAV_ITEMS = [
  { label: 'Solutions', hasArrow: true, dropdown: 'solutions' },
  { label: 'Enterprise', hasArrow: false },
  { label: 'Cal.ai', hasArrow: false },
  { label: 'Developer', hasArrow: true, dropdown: 'developer' },
  { label: 'Resources', hasArrow: true, dropdown: 'resources' },
  { label: 'Pricing', hasArrow: false },
];

const DROPDOWN_CONTENT = {
  solutions: {
    sections: [
      {
        title: 'By team size',
        items: [
          { label: 'For Individuals', desc: 'Personal scheduling made simple', icon: <User className="w-5 h-5 text-gray-500" /> },
          { label: 'For Teams', desc: 'Collaborative scheduling for groups', icon: <Users className="w-5 h-5 text-blue-500" /> },
          { label: 'For Organizations', desc: 'Larger teams scheduling for more control & security', icon: <Network className="w-5 h-5 text-emerald-500" /> },
          { label: 'For Enterprises', desc: 'Enterprise-level scheduling solutions', icon: <Building2 className="w-5 h-5 text-gray-700" /> },
        ]
      },
      {
        title: 'By use case',
        items: [
          { label: 'Recruiting', icon: <Send className="w-4 h-4 text-gray-600" /> },
          { label: 'Sales', icon: <DollarSign className="w-4 h-4 text-gray-600" /> },
          { label: 'HR', icon: <Users className="w-4 h-4 text-gray-600" /> },
          { label: 'Education', icon: <GraduationCap className="w-4 h-4 text-gray-600" /> },
          { label: 'Support', icon: <PhoneCall className="w-4 h-4 text-gray-600" /> },
          { label: 'Healthcare', icon: <FlaskConical className="w-4 h-4 text-gray-600" /> },
          { label: 'Telehealth', icon: <MessageSquare className="w-4 h-4 text-gray-600" /> },
          { label: 'Marketing', icon: <BarChart3 className="w-4 h-4 text-gray-600" /> },
        ]
      }
    ]
  },
  developer: {
    sections: [
      {
        title: null,
        items: [
          { label: 'Developer Documentation', desc: 'Documentation for the Cal.com platform', icon: 'file' },
          { label: 'API', desc: 'Build your own integrations with our public API', icon: 'code' },
          { label: 'Scheduling Components', desc: 'Use our react atoms to add scheduling to your app', icon: 'layers' },
          { label: 'Create OAuth Client', desc: 'Integrate Cal.com using OAuth', icon: 'terminal' },
        ]
      }
    ]
  },
  resources: {
    sections: [
      {
        title: null,
        items: [
          { label: 'Font: Cal Sans UI & Text', desc: 'Our own variable typeface for user interface design', icon: 'font' },
          { label: 'App Store', desc: 'Integrate with your favorite apps', icon: 'smartphone' },
          { label: 'Collective Events', desc: 'Schedule events with multiple participants', icon: 'users' },
          { label: 'Help Docs', desc: 'Need to learn more about our system? Check the help docs', icon: 'file' },
        ]
      },
      {
        title: null,
        items: [
          { label: 'Embed', desc: 'Embed Cal.com into your website', icon: 'terminal' },
          { label: 'Out Of Office', desc: 'Schedule time off with ease', icon: 'moon' },
          { label: 'Payments', desc: 'Accept payments for bookings', icon: 'credit-card' },
          { label: 'Workflows', desc: 'Automate scheduling and reminders', icon: 'zap' },
        ]
      },
      {
        title: null,
        items: [
          { label: 'Blog', desc: 'Stay up to date with the latest news and updates', icon: 'newspaper' },
          { label: 'Instant Meetings', desc: 'Meet with clients in minutes', icon: 'lightning' },
          { label: 'Dynamic Group Links', desc: 'Seamlessly book meetings with multiple people', icon: 'users' },
          { label: 'Webhooks', desc: 'Get notified when something happens', icon: 'webhook' },
        ]
      }
    ]
  }
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[1000] flex justify-center p-6 pointer-events-none">
      <div className="relative max-w-5xl w-full pointer-events-auto">
        <motion.nav 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className={`
            flex items-center gap-2 px-6 py-2.5 rounded-full border bg-white/80 backdrop-blur-xl transition-all duration-500
            ${scrolled ? 'shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] border-gray-100' : 'shadow-sm border-transparent'}
          `}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 mr-6 group">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-black text-lg -rotate-12">C</span>
            </div>
            <span className="text-[17px] font-black tracking-[-0.03em] text-black">cal.com</span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
              <div 
                key={item.label}
                onMouseEnter={() => setActiveDropdown(item.dropdown || null)}
                className="relative"
              >
                <button className={`
                  flex items-center gap-1.5 px-4 py-2 rounded-full text-[14px] font-bold transition-all duration-300
                  ${activeDropdown === item.dropdown && item.dropdown ? 'bg-gray-100 text-black' : 'text-gray-500 hover:text-black hover:bg-gray-50'}
                `}>
                  {item.label}
                  {item.hasArrow && <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === item.dropdown ? 'rotate-180' : ''}`} />}
                </button>

                {/* Local Dropdown (Anchored to Link) */}
                <AnimatePresence>
                  {activeDropdown === item.dropdown && item.dropdown === 'developer' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                      onMouseEnter={() => setActiveDropdown(item.dropdown)}
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white rounded-[28px] shadow-[0_32px_96px_-16px_rgba(0,0,0,0.12)] border border-gray-100 p-6 w-[380px] z-[1100]"
                    >
                      {DROPDOWN_CONTENT[item.dropdown].sections.map((section, idx) => (
                        <div key={idx}>
                          {section.title && <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-300 mb-6">{section.title}</h4>}
                          <div className="space-y-1">
                            {section.items.map((subItem, i) => (
                              <DropdownLink key={i} item={subItem} index={i} type={item.dropdown} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="flex-1" />

          {/* Auth */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/dashboard" className="px-5 py-2 text-[14px] font-bold text-gray-500 hover:text-black hover:bg-gray-50 rounded-full transition-all">
                  Dashboard
                </Link>
                <button onClick={logout} className="px-5 py-2 text-[14px] font-bold text-red-500 hover:bg-red-50 rounded-full transition-all">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-5 py-2 text-[14px] font-bold text-gray-500 hover:text-black hover:bg-gray-50 rounded-full transition-all">
                  Sign in
                </Link>
                <Link to="/signup" className="px-5 py-2 text-[14px] font-bold text-white bg-black rounded-full hover:bg-gray-800 transition-all shadow-md shadow-black/5 hover:shadow-black/10">
                  Get started
                </Link>
              </>
            )}
          </div>
        </motion.nav>

        {/* Megamenu */}
        <AnimatePresence>
          {(activeDropdown === 'solutions' || activeDropdown === 'resources') && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
              onMouseEnter={() => setActiveDropdown(activeDropdown)}
              onMouseLeave={() => setActiveDropdown(null)}
              className="absolute top-full mt-4 left-0 right-0 bg-white rounded-[32px] shadow-[0_32px_96px_-16px_rgba(0,0,0,0.12)] border border-gray-100 p-10 overflow-hidden"
            >
              <div className="grid grid-cols-3 gap-12">
                {/* Regular Sections */}
                {DROPDOWN_CONTENT[activeDropdown].sections.map((section, idx) => (
                  <div key={idx} className={activeDropdown === 'solutions' && idx === 1 ? 'col-span-1' : ''}>
                    {section.title && <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-300 mb-6">{section.title}</h4>}
                    <div className={`grid gap-x-6 gap-y-2 ${activeDropdown === 'solutions' && idx === 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      {section.items.map((item, i) => (
                        <DropdownLink key={i} item={item} index={i} type={activeDropdown} />
                      ))}
                    </div>
                  </div>
                ))}
                
                {/* Featured Card for Solutions */}
                {activeDropdown === 'solutions' && (
                  <div className="flex flex-col">
                    <div className="relative flex-1 rounded-[32px] overflow-hidden group/card cursor-pointer border border-white/20 shadow-xl shadow-purple-500/10">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA]" />
                      <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-white/10 blur-[100px] rounded-full" />
                      <div className="relative h-full p-10 flex flex-col items-center justify-center text-center">
                        <div className="absolute top-6 right-6 px-3 py-1 bg-black/10 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-white" />
                          <span className="text-[10px] font-bold text-white whitespace-nowrap">Try Cal.ai now!</span>
                        </div>
                        <div className="mb-6">
                           <h3 style={{ fontFamily: '"Cal Sans", sans-serif' }} className="text-[52px] font-black text-white tracking-tighter flex items-center justify-center gap-2 drop-shadow-sm">Cal.ai</h3>
                        </div>
                        <p className="text-[16px] font-extrabold text-white leading-tight max-w-[220px]">Supercharged scheduling with AI-powered calls</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const DropdownLink = ({ item, index, type }) => {
  const IconComponent = () => {
    if (typeof item.icon === 'string') {
      if (item.icon === 'file') return <FileText className="w-5 h-5 fill-current opacity-80" />;
      if (item.icon === 'code') return <Code className="w-5 h-5" />;
      if (item.icon === 'layers') return <Layers className="w-5 h-5 fill-current opacity-80" />;
      if (item.icon === 'terminal') return <Terminal className="w-5 h-5" />;
      if (item.icon === 'font') return <div className="text-[10px] font-black bg-black text-white px-1 rounded-sm leading-tight">Cal</div>;
      if (item.icon === 'smartphone') return <Smartphone className="w-5 h-5" />;
      if (item.icon === 'users') return <Users className="w-5 h-5 fill-current opacity-80" />;
      if (item.icon === 'moon') return <Moon className="w-5 h-5 fill-current opacity-80" />;
      if (item.icon === 'credit-card') return <CreditCard className="w-5 h-5" />;
      if (item.icon === 'zap') return <Zap className="w-5 h-5 fill-current opacity-80" />;
      if (item.icon === 'newspaper') return <Newspaper className="w-5 h-5" />;
      if (item.icon === 'lightning') return <Zap className="w-5 h-5" />;
      if (item.icon === 'webhook') return <Webhook className="w-5 h-5 text-gray-700" />;
      return <FileText className="w-5 h-5" />;
    }
    return item.icon;
  };

  return (
    <motion.a 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      href="#" 
      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
    >
      {type === 'developer' || type === 'resources' ? (
        <BlueprintBox><IconComponent /></BlueprintBox>
      ) : (
        <div className="w-10 h-10 min-w-[40px] rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors border border-gray-100 shadow-sm text-gray-700">
          {item.icon}
        </div>
      )}
      <div>
        <p className="text-[14px] font-bold text-black group-hover:text-blue-600 transition-colors leading-tight">{item.label}</p>
        {item.desc && <p className="text-[12px] text-gray-400 font-medium leading-tight mt-1">{item.desc}</p>}
      </div>
    </motion.a>
  );
};
