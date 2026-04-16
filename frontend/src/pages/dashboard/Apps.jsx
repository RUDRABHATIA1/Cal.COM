import React, { useState, useRef } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, ExternalLink, Plus } from 'lucide-react';

// ── App Data ─────────────────────────────────────────────────────────────────
const APPS = [
  // Conferencing
  { id:'8x8',         name:'8x8',               cat:'Conferencing', action:'install', color:'#EF4444', initials:'8x8', desc:'The best video conferencing solution for businesses of any size. Fully secure, reliable, packed with features and ridiculously simple to use.', image: '/images/de4psYuZknaXIa4YiJwyr7fv470.png' },
  { id:'cal-video',   name:'Cal Video',          cat:'Conferencing', action:'default', color:'#111111', initials:'CV',  desc:'Cal Video is the in-house web-based video conferencing platform powered by Daily.co, which is minimalistic and lightweight.', image: '/images/yBP2bxRn6dRgikoDZjkgAk2v0.png' },
  { id:'campfire',    name:'Campfire',            cat:'Conferencing', action:'install', color:'#F97316', initials:'🔥', desc:'Feel connected with your remote team. Team events, new hire onboardings, coffee chats, all on Campfire.', image: '/images/BihejtaehEHBHQEXgMcIudhKKp0.png' },
  { id:'demodesk',    name:'Demodesk',            cat:'Conferencing', action:'install', color:'#6366F1', initials:'D',  desc:'Run Professional Video Meetings, Coach Sales Teams in Real-Time with AI, And Schedule Meetings on Auto-Pilot.', image: '/images/amoj8RpnfR7ZH3Nk8tdZjI2KC98.svg' },
  { id:'discord',     name:'Discord',             cat:'Conferencing', action:'install', color:'#5865F2', initials:'D',  desc:'Copy your server invite link and start scheduling calls in Discord!', image: '/images/7rFCqyElXGwPLAPymO0KdGsetVw.svg' },
  { id:'element',     name:'Element Call',        cat:'Conferencing', action:'install', color:'#0DBD8B', initials:'E',  desc:'Element is an open-source communication platform that provides messaging, voice calling, and video conferencing.', image: '/images/qsV5rO9Z0v9AJ5BPcJjI9yPmU.svg' },
  { id:'facetime',    name:'Facetime',            cat:'Conferencing', action:'install', color:'#34C759', initials:'FT', desc:'Facetime makes it super simple for collaborating teams to jump on a video call.' },
  { id:'huddle01',    name:'Huddle01',            cat:'Conferencing', action:'install', color:'#8B5CF6', initials:'H',  desc:'Huddle01 is a new video conferencing software native to Web3, comparable to a decentralized version of Zoom.' },
  { id:'jelly',       name:'Jelly',               cat:'Conferencing', action:'install', color:'#EC4899', initials:'J',  desc:'JellyPhone is a video calling tool with a stacked rolodex. You can cut short podcasts for Tik Tok and Instagram.' },
  { id:'jitsi',       name:'Jitsi Video',         cat:'Conferencing', action:'install', color:'#0284C7', initials:'Ji', desc:'Jitsi is a free open-source video conferencing software for web and mobile.' },
  { id:'lyra',        name:'Lyra',                cat:'Conferencing', action:'install', color:'#7C3AED', initials:'L',  desc:'The meeting platform built for pros.' },
  { id:'ms-teams',    name:'Microsoft Teams',     cat:'Conferencing', action:'install', color:'#6264A7', initials:'T',  desc:'Microsoft Teams is a business communication platform included in Microsoft 365.' },
  { id:'mirotalk',    name:'Mirotalk',            cat:'Conferencing', action:'install', color:'#10B981', initials:'M',  desc:'Peer to peer real-time video conferences, optimized for small groups with unlimited time.' },
  { id:'pinggg',      name:'Ping.gg',             cat:'Conferencing', action:'install', color:'#F59E0B', initials:'P',  desc:'Ping.gg makes high quality video collaborations easier than ever. Think Zoom for streamers and creators.' },
  { id:'riverside',   name:'Riverside',           cat:'Conferencing', action:'install', color:'#EF4444', initials:'R',  desc:'Your online recording studio. Record podcasts and videos in studio quality from anywhere.' },
  { id:'roam',        name:'Roam',                cat:'Conferencing', action:'install', color:'#06B6D4', initials:'Ro', desc:'Roam is Your Whole Company in one HQ.' },
  { id:'signal',      name:'Signal',              cat:'Conferencing', action:'install', color:'#1D8348', initials:'S',  desc:'Schedule a chat with your guests or have a Signal Video call.' },
  { id:'skype',       name:'Skype',               cat:'Conferencing', action:'install', color:'#00AFF0', initials:'Sk', desc:'Skype is for connecting with the people that matter most in your life and work.' },
  { id:'sylaps',      name:'Sylaps',              cat:'Conferencing', action:'install', color:'#2563EB', initials:'Sy', desc:'Free Audio and Video Conferencing, Online Collaboration, Screen Sharing.' },
  { id:'tandem',      name:'Tandem Video',        cat:'Conferencing', action:'install', color:'#9333EA', initials:'Tv', desc:'Tandem is a new virtual office space that allows teams to effortlessly connect.' },
  { id:'telegram',    name:'Telegram',            cat:'Conferencing', action:'install', color:'#229ED9', initials:'Tg', desc:'Schedule a chat with your guests or have a Telegram Video call.' },
  { id:'webex',       name:'Webex',               cat:'Conferencing', action:'install', color:'#00C1DE', initials:'W',  desc:'Create meetings with Cisco Webex.', image: '/images/11KSGbIZoRSg4pjdnUoif6MKHI.svg' },
  { id:'whereby',     name:'Whereby',             cat:'Conferencing', action:'install', color:'#7C3AED', initials:'Wh', desc:'Whereby makes it super simple for collaborating teams to jump on a video call.', image: '/images/2uFL5TmA8WQRvj0Ebn4lQiVnC6w.svg' },
  { id:'whatsapp',    name:'WhatsApp',            cat:'Conferencing', action:'install', color:'#25D366', initials:'WA', desc:'Schedule a chat with your guests or have a WhatsApp Video call.', image: '/images/6tTbkXggWgQCAJ4DO2QEdXXmgM.svg' },
  { id:'zoom',        name:'Zoom Video',          cat:'Conferencing', action:'install', color:'#2D8CFF', initials:'Z',  desc:'Zoom is a secure and reliable video platform that supports all of your online communication needs.', image: '/images/0iAsSREuwQNIHS3aRfScLdNZqc.webp' },
  { id:'dialpad',     name:'dialpad',             cat:'Conferencing', action:'install', color:'#6366F1', initials:'dp', desc:'A new way to meet, with built-in Ai.' },

  // Automation
  { id:'autocheckin', name:'Autocheckin',         cat:'Automation', action:'visit',   color:'#F97316', initials:'Ac', desc:'You simply paste a Cal.com link of someone, select a frequency and we will take care of the scheduling for you.' },
  { id:'bolna',       name:'Bolna',               cat:'Automation', action:'visit',   color:'#6366F1', initials:'Bo', desc:'24x7 AI receptionists to answer all inbound calls.' },
  { id:'clic',        name:'Clic',                cat:'Automation', action:'visit',   color:'#0EA5E9', initials:'Cl', desc:'Create, List and Interact with Your Cal.com links and connections easily.' },
  { id:'elevenlabs',  name:'ElevenLabs',          cat:'Automation', action:'visit',   color:'#1A1A1A', initials:'11', desc:'Create the most realistic speech with our AI audio platform.' },
  { id:'greetmate',   name:'Greetmate.ai',        cat:'Automation', action:'visit',   color:'#7C3AED', initials:'Gm', desc:'Connect Cal.com to Greetmate.ai and enable appointment scheduling for your AI agents.' },
  { id:'lindy',       name:'Lindy',               cat:'Automation', action:'visit',   color:'#EC4899', initials:'Li', desc:'Build AI agents in minutes to automate workflows, save time and grow your business.' },
  { id:'make',        name:'Make',                cat:'Automation', action:'install', color:'#6B0FD8', initials:'M',  desc:'From tasks and workflows to apps and systems, build and automate anything in one powerful visual platform.' },
  { id:'millis',      name:'Millis AI',           cat:'Automation', action:'visit',   color:'#0F172A', initials:'Mi', desc:'Build next-gen voice agents with 500ms latency.' },
  { id:'monobot',     name:'Monobot CX',          cat:'Automation', action:'visit',   color:'#2563EB', initials:'Mx', desc:'Crafting your personalized AI-driven assistant is easy and fast.' },
  { id:'n8n',         name:'n8n',                 cat:'Automation', action:'visit',   color:'#EA580C', initials:'n8', desc:'Automate without limits. The workflow automation platform that never boxes you in.' },
  { id:'pipedream',   name:'Pipedream',           cat:'Automation', action:'visit',   color:'#10B981', initials:'Pd', desc:'Connect APIs, remarkably fast. Stop writing boilerplate code, struggling with authentication.' },
  { id:'retell',      name:'Retell AI',           cat:'Automation', action:'visit',   color:'#0EA5E9', initials:'RA', desc:'Supercharge your Call Operations with AI.' },
  { id:'routing',     name:'Routing',             cat:'Automation', action:'default', color:'#4F46E5', initials:'Rt', desc:'Route bookers to the right person or event faster using form inputs.' },
  { id:'synthflow',   name:'Synthflow',           cat:'Automation', action:'visit',   color:'#7C3AED', initials:'Sf', desc:'Effortless Human-Like AI Phone Calls and Scheduling.' },
  { id:'telli',       name:'telli',               cat:'Automation', action:'visit',   color:'#1D4ED8', initials:'te', desc:'telli AI agents reach your customers, make calls independently & enhance your customer experience.' },
  { id:'wipemycal',   name:'WipeMyCal',           cat:'Automation', action:'install', color:'#EF4444', initials:'WC', desc:'Redefines what it looks like to reschedule multiple meetings at the same time.' },
  { id:'zapier',      name:'Zapier',              cat:'Automation', action:'visit',   color:'#FF4A00', initials:'Za', desc:'Workflow automation for everyone. Automate your workflows when a booking is created or cancelled.' },
  { id:'fonio',       name:'fonio.ai',            cat:'Automation', action:'visit',   color:'#6D28D9', initials:'fo', desc:'Der KI-Telefonassistent auf Deutsch.' },
  { id:'sendgrid',    name:'Sendgrid',            cat:'Automation', action:'install', color:'#1A82E2', initials:'Sg', desc:'SendGrid delivers your transactional and marketing emails through the largest cloud-based email delivery platform.' },
  { id:'wordpress',   name:'Wordpress',           cat:'Automation', action:'visit',   color:'#21759B', initials:'Wp', desc:'Embedded booking pages right into your wordpress page.' },
  { id:'intercom',    name:'Intercom',            cat:'Automation', action:'install', color:'#1F8EFF', initials:'In', desc:'Enhance your scheduling and appointment management experience with the Intercom Integration.' },

  // Analytics
  { id:'fathom',      name:'Fathom',              cat:'Analytics', action:'install', color:'#7C3AED', initials:'Fa', desc:'Fathom Analytics provides simple, privacy-focused website analytics.' },
  { id:'g-analytics', name:'Google Analytics',    cat:'Analytics', action:'install', color:'#F59E0B', initials:'GA', desc:'Google Analytics is a web analytics service that tracks and reports website traffic.' },
  { id:'gtm',         name:'Google Tag Manager',  cat:'Analytics', action:'install', color:'#0284C7', initials:'GT', desc:'App to install Google Tag Manager on your booking pages.' },
  { id:'insihts',     name:'Insihts',             cat:'Analytics', action:'install', color:'#4F46E5', initials:'Is', desc:'An all-in-one platform for businesses looking to track user behavior and optimize workflows.' },
  { id:'matomo',      name:'Matomo',              cat:'Analytics', action:'install', color:'#3AB0FF', initials:'Ma', desc:'Google Analytics alternative that protects your data and your customers privacy.' },
  { id:'metapixel',   name:'Meta Pixel',          cat:'Analytics', action:'install', color:'#0866FF', initials:'MP', desc:'Add Meta Pixel to your bookings page to measure, optimize and build audiences for your ad campaigns.' },
  { id:'plausible',   name:'Plausible',           cat:'Analytics', action:'install', color:'#5850EC', initials:'Pl', desc:'Simple, privacy-friendly Google Analytics alternative.' },
  { id:'posthog',     name:'Posthog',             cat:'Analytics', action:'install', color:'#F97316', initials:'Ph', desc:'PostHog is the all-in-one platform for building better products.' },
  { id:'twipla',      name:'Twipla',              cat:'Analytics', action:'install', color:'#6366F1', initials:'Tw', desc:'Twipla is a website intelligence platform that helps you understand how visitors interact with your website.' },
  { id:'umami',       name:'Umami',               cat:'Analytics', action:'install', color:'#1D4ED8', initials:'Um', desc:'Umami makes it easy to collect, analyze, and understand your web data.' },
  { id:'vimcal',      name:'Vimcal',              cat:'Analytics', action:'visit',   color:'#0EA5E9', initials:'Vc', desc:'The world fastest calendar, beautifully designed for a remote world.' },

  // Calendar
  { id:'apple-cal',   name:'Apple Calendar',      cat:'Calendar', action:'install', color:'#FF3B30', initials:'📅', desc:'Apple calendar runs both the macOS and iOS mobile operating systems.' },
  { id:'caldav',      name:'CalDav (Beta)',        cat:'Calendar', action:'install', color:'#D97706', initials:'CD', desc:'Caldav is a protocol that allows different clients/servers to access scheduling information on remote servers.' },
  { id:'deel',        name:'Deel',                cat:'Calendar', action:'visit',   color:'#FF5C35', initials:'De', desc:'Integrate Deel with your Calendar and get automatic updates on key employee dates.' },
  { id:'g-calendar',  name:'Google Calendar',     cat:'Calendar', action:'install', color:'#4285F4', initials:'📆', desc:'Google Calendar is a time management and scheduling service developed by Google.' },
  { id:'g-meet',      name:'Google Meet',         cat:'Conferencing', action:'install', color:'#00897B', initials:'GM', desc:'Google Meet is Google web-based video conferencing platform, designed to compete with major conferencing platforms.' },
  { id:'ics-feed',    name:'ICS Feed',            cat:'Calendar', action:'install', color:'#64748B', initials:'IC', desc:'Import events from an ICS Feed into Cal.com.' },
  { id:'lark-cal',    name:'Lark Calendar',       cat:'Calendar', action:'install', color:'#1677FF', initials:'LC', desc:'Lark Calendar is a time management and scheduling service developed by Lark.' },
  { id:'linear',      name:'Linear',              cat:'Calendar', action:'visit',   color:'#5E6AD2', initials:'Li', desc:'Linear is a better way to build products. Connect your calendar to automate your status.' },
  { id:'ms-exchange', name:'Microsoft Exchange',  cat:'Calendar', action:'install', color:'#0078D4', initials:'Ex', desc:'Fetch Microsoft Exchange calendars and availabilities using Exchange Web Services.' },
  { id:'outlook',     name:'Outlook Calendar',    cat:'Calendar', action:'install', color:'#0072C6', initials:'OL', desc:'Microsoft Office 365 is a suite of apps that helps you stay connected with others and get things done.' },
  { id:'zoho-cal',    name:'Zoho Calendar',       cat:'Calendar', action:'install', color:'#E42527', initials:'ZC', desc:'Zoho Calendar is an online business calendar that makes scheduling easy for you.' },

  // CRM
  { id:'attio',       name:'Attio',               cat:'CRM', action:'install', color:'#6366F1', initials:'At', desc:'Attio is the AI-native CRM that builds, scales and grows your company to the next level.' },
  { id:'close',       name:'Close.com',           cat:'CRM', action:'install', color:'#22C55E', initials:'Cl', desc:'Close is the inside sales CRM of choice for startups and SMBs.' },
  { id:'hubspot',     name:'HubSpot CRM',         cat:'CRM', action:'install', color:'#FF7A59', initials:'HS', desc:'HubSpot is a cloud-based CRM designed to help align sales and marketing teams.' },
  { id:'salesforce',  name:'Salesforce',          cat:'CRM', action:'install', color:'#00A1E0', initials:'SF', desc:'Salesforce is a cloud-based application designed to help your salespeople sell smarter and faster.' },
  { id:'salesroom',   name:'Salesroom',           cat:'CRM', action:'install', color:'#7C3AED', initials:'Sr', desc:'Unlock real-time AI and take your sales game to the next level.' },
  { id:'zoho-bigin',  name:'Zoho Bigin',          cat:'CRM', action:'install', color:'#E42527', initials:'ZB', desc:'Bigin easily transforms your day-to-day customer processes into actionable pipelines.' },
  { id:'zohocrm',     name:'ZohoCRM',             cat:'CRM', action:'install', color:'#E42527', initials:'ZC', desc:'Zoho CRM is a cloud-based application designed to help your salespeople sell smarter and faster.' },

  // Payment
  { id:'alby',        name:'Alby',                cat:'Payment', action:'install', color:'#FBBF24', initials:'Al', desc:'Your Bitcoin & Nostr companion for the web. Use Alby to charge Satoshi for your Cal.com meetings.' },
  { id:'btcpay',      name:'BTCPayServer',        cat:'Payment', action:'install', color:'#F7931A', initials:'BT', desc:'BTCPay Server is a self-hosted open source Bitcoin payment processor.' },
  { id:'hitpay',      name:'HitPay',              cat:'Payment', action:'install', color:'#6366F1', initials:'HP', desc:'HitPay Cal.com payment integration combines powerful scheduling with seamless local payment acceptance.' },
  { id:'paypal',      name:'Paypal',              cat:'Payment', action:'install', color:'#003087', initials:'PP', desc:'Paypal payment app by Cal.com.' },
  { id:'stripe',      name:'Stripe',              cat:'Payment', action:'install', color:'#635BFF', initials:'St', desc:'A SaaS company and payment processing software for e-commerce websites and mobile applications.' },

  // Messaging
  { id:'chatbase',    name:'Chatbase',            cat:'Messaging', action:'visit',   color:'#0F172A', initials:'Ch', desc:'Add Cal.com to your Chatbase AI Chatbot and accept bookings right inside chat.' },

  // Other
  { id:'baa',         name:'BAA for HIPAA',       cat:'Other', action:'visit',   color:'#0EA5E9', initials:'⚕️', desc:'Request a signed Business Associate Agreement for your HIPAA compliance records.' },
  { id:'dub',         name:'Dub',                 cat:'Other', action:'install', color:'#000000', initials:'Db', desc:'Dub is the modern link attribution platform for short links, conversion analytics, and affiliate programs.' },
  { id:'giphy',       name:'Giphy',               cat:'Other', action:'install', color:'#000000', initials:'G',  desc:'GIPHY is your top source for the best & newest GIFs & Animated Stickers online.' },
  { id:'granola',     name:'Granola',             cat:'Other', action:'visit',   color:'#1A1A1A', initials:'Gr', desc:'The AI notepad for people in back-to-back meetings for MacOS.' },
  { id:'qrcode',      name:'QR Code',             cat:'Other', action:'install', color:'#1F2937', initials:'QR', desc:'Easily generate a QR code for your links to print, share, or embed.' },
  { id:'raycast',     name:'Raycast',             cat:'Other', action:'visit',   color:'#F97316', initials:'Rc', desc:'Quickly share your Cal.com meeting links with Raycast.' },
  { id:'vital',       name:'Vital',               cat:'Other', action:'install', color:'#DC2626', initials:'Vi', desc:'Connect your health data or wearables to trigger actions on your calendar.' },
  { id:'weather',     name:'Weather in Calendar', cat:'Other', action:'install', color:'#0EA5E9', initials:'⛅', desc:'Get the local weather forecast with icons in your calendar.' },
];

const CATEGORIES = ['All','Conferencing','Automation','Analytics','Calendar','CRM','Payment','Messaging','Other'];
const MOST_POPULAR = ['g-meet','g-calendar','zoom','zapier','hubspot','stripe'];
const RECENTLY_ADDED = ['telli','n8n','greetmate','millis','attio','posthog'];

const FEATURED = [
  { cat:'Conferencing', apps:27, icon:'🎥' },
  { cat:'Automation',   apps:22, icon:'⚡' },
  { cat:'Analytics',    apps:11, icon:'📊' },
  { cat:'Other',        apps:11, icon:'🔧' },
  { cat:'Calendar',     apps:10, icon:'📅' },
  { cat:'CRM',          apps:7,  icon:'💼' },
  { cat:'Payment',      apps:5,  icon:'💳' },
  { cat:'Messaging',    apps:4,  icon:'💬' },
];

// ── App Icon ──────────────────────────────────────────────────────────────────
function AppIcon({ app, size = 'md' }) {
  const sz = size === 'lg' ? 'w-14 h-14 text-xl rounded-2xl' : 'w-12 h-12 text-sm rounded-xl';
  
  if (app.image) {
    return (
      <div className={`${sz} bg-white flex items-center justify-center p-2 shrink-0 shadow-inner border border-white/5`}>
        <img src={app.image} alt={app.name} className="w-full h-full object-contain" />
      </div>
    );
  }

  return (
    <div className={`${sz} flex items-center justify-center font-black text-white shrink-0 shadow-inner`}
      style={{ background: app.color }}>
      {app.initials}
    </div>
  );
}

// ── App Card (grid) ───────────────────────────────────────────────────────────
function AppCard({ app, index }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="flex flex-col bg-[#141414] border border-[#2B2B2B] rounded-xl overflow-hidden hover:border-[#3F3F46] hover:bg-[#1A1A1A] transition-colors"
    >
      {/* Top badge */}
      {app.action === 'default' && (
        <div className="flex justify-end px-3 pt-2">
          <span className="px-2 py-0.5 rounded-md bg-[#2B2B2B] text-[#A1A1AA] text-[11px] font-semibold">Default</span>
        </div>
      )}
      <div className="px-4 pt-4 pb-3 flex-1">
        <AppIcon app={app} />
        <h3 className="text-[14px] font-bold text-white mt-3 mb-1">{app.name}</h3>
        <p className="text-[12px] text-[#71717A] leading-relaxed line-clamp-3">{app.desc}</p>
      </div>
      <div className="px-4 pb-4 flex gap-2 mt-1">
        <button className="flex-1 h-8 border border-[#3F3F46] rounded-lg text-[12px] font-semibold text-[#A1A1AA] hover:border-[#71717A] hover:text-white transition-colors">
          Details
        </button>
        {app.action === 'install' && (
          <button className="flex-1 h-8 border border-[#3F3F46] rounded-lg text-[12px] font-semibold text-[#A1A1AA] hover:border-[#71717A] hover:text-white transition-colors flex items-center justify-center gap-1">
            <Plus className="w-3 h-3" /> Install
          </button>
        )}
        {app.action === 'visit' && (
          <button className="flex-1 h-8 border border-[#3F3F46] rounded-lg text-[12px] font-semibold text-[#A1A1AA] hover:border-[#71717A] hover:text-white transition-colors flex items-center justify-center gap-1">
            <ExternalLink className="w-3 h-3" /> Visit
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ── Horizontal scroll row ─────────────────────────────────────────────────────
function HScrollRow({ children }) {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  return (
    <div className="relative">
      <button onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-[#1A1A1A] border border-[#3F3F46] rounded-full flex items-center justify-center text-[#A1A1AA] hover:text-white -translate-x-4">
        <ChevronLeft className="w-4 h-4" />
      </button>
      <div ref={ref} className="flex gap-4 overflow-x-auto pb-2 px-1 scroll-smooth no-scrollbar">
        {children}
      </div>
      <button onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-[#1A1A1A] border border-[#3F3F46] rounded-full flex items-center justify-center text-[#A1A1AA] hover:text-white translate-x-4">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Popular/Recent card (horizontal) ─────────────────────────────────────────
function HCard({ app, index }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="w-[220px] shrink-0 bg-[#141414] border border-[#2B2B2B] rounded-xl p-4 hover:border-[#3F3F46] transition-colors flex flex-col gap-3 cursor-pointer group"
    >
      <AppIcon app={app} />
      <div>
        <p className="text-[14px] font-bold text-white group-hover:text-sky-400 transition-colors uppercase tracking-tight">{app.name}</p>
        <p className="text-[12px] text-[#71717A] mt-0.5 line-clamp-2">{app.desc}</p>
      </div>
    </motion.div>
  );
}

// ── Featured category card ────────────────────────────────────────────────────
function FeaturedCard({ item, onClick, index }) {
  return (
    <motion.button 
      onClick={() => onClick(item.cat)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05, backgroundColor: '#1A1A1A' }}
      whileTap={{ scale: 0.95 }}
      className="w-[190px] shrink-0 bg-[#141414] border border-[#2B2B2B] rounded-xl p-5 hover:border-[#3F3F46] text-left transition-colors relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-2xl rounded-full translate-x-12 -translate-y-12 group-hover:bg-white/10 transition-all" />
      <div className="text-4xl mb-4 relative z-10">{item.icon}</div>
      <p className="text-[14px] font-bold text-white relative z-10">{item.cat}</p>
      <p className="text-[12px] text-[#71717A] mt-0.5 relative z-10">{item.apps} apps →</p>
    </motion.button>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ title }) {
  return (
    <motion.h2 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="text-[16px] font-bold text-white mb-4"
    >
      {title}
    </motion.h2>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Apps() {
  const [category, setCategory] = useState('All');
  const [search, setSearch]     = useState('');

  const popular  = MOST_POPULAR.map(id => APPS.find(a => a.id === id)).filter(Boolean);
  const recent   = RECENTLY_ADDED.map(id => APPS.find(a => a.id === id)).filter(Boolean);

  const filtered = APPS.filter(a => {
    const matchCat = category === 'All' || a.cat === category;
    const matchQ   = a.name.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <DashboardLayout
      title="App store"
      subtitle="Connecting people, technology and the workplace."
      actions={
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1A1A] border border-[#2B2B2B] rounded-lg w-52">
          <Search className="w-3.5 h-3.5 text-[#52525B] shrink-0" />
          <input type="text" placeholder="Search" value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-[13px] text-white placeholder:text-[#52525B] focus:outline-none flex-1 w-full" />
        </div>
      }
    >
      <div className="space-y-10 max-w-5xl">

        {/* ── Featured categories ─────────────────────────────── */}
        {!search && (
          <section>
            <SectionHeader title="Featured categories" />
            <HScrollRow>
              {FEATURED.map((item, i) => (
                <FeaturedCard key={item.cat} index={i} item={item} onClick={cat => { setCategory(cat); }} />
              ))}
            </HScrollRow>
          </section>
        )}

        {/* ── Most popular ────────────────────────────────────── */}
        {!search && category === 'All' && (
          <section>
            <SectionHeader title="Most popular" />
            <HScrollRow>
              {popular.map((app, i) => <HCard key={app.id} index={i} app={app} />)}
            </HScrollRow>
          </section>
        )}

        {/* ── Recently added ──────────────────────────────────── */}
        {!search && category === 'All' && (
          <section>
            <SectionHeader title="Recently added" />
            <HScrollRow>
              {recent.map((app, i) => <HCard key={app.id} index={i} app={app} />)}
            </HScrollRow>
          </section>
        )}

        {/* ── All apps ────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <SectionHeader title="All apps" />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1.5 flex-wrap mb-6">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                  category === cat ? 'bg-white text-[#111827]' : 'bg-[#1A1A1A] text-[#A1A1AA] border border-[#2B2B2B] hover:border-[#3F3F46] hover:text-white'
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {filtered.map((app, i) => <AppCard key={app.id} index={i} app={app} />)}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center border border-[#2B2B2B] rounded-xl bg-[#141414]"
              >
                <p className="text-[15px] font-bold text-white mb-2">No apps found</p>
                <p className="text-[13px] text-[#71717A]">Try a different search term or category.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>
    </DashboardLayout>
  );
}
