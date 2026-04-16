import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const PROFILES = [
  {
    name: 'Cédric van Ravesteijn',
    handle: 'cedric',
    title: 'Partnerships & Collaborations',
    bio: "Are you an agency, influencer, SaaS founder, or business looking to collaborate with Cal.com? Let's chat!",
    slots: ['15m', '30m', '45m', '1h'],
    activeSlot: 1,
    location: 'Europe/Amsterdam',
    video: 'Cal Video',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    settings: {
      notice: '2 days',
      bufferBefore: '0 mins',
      bufferAfter: '30 mins',
      interval: '1 hour'
    }
  },
  {
    name: 'Rajiv Sahal',
    handle: 'rajiv',
    title: 'Platform API Meeting',
    bio: "Interested in building on top of Cal.com or integrating our platform API into your product? Let's explore what's possible together.",
    slots: ['15m', '30m', '45m', '1h'],
    activeSlot: 2,
    location: 'Asia/Delhi',
    video: 'MS Teams',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    settings: {
      notice: '2 days',
      bufferBefore: '0 mins',
      bufferAfter: '30 mins',
      interval: '1 hour'
    }
  },
  {
    name: 'Ewa Michalak',
    handle: 'ewa',
    title: 'Marketing Strategy Session',
    bio: "Let's collaborate on campaigns, co-marketing opportunities, and learn how Cal.com is approaching growth and brand.",
    slots: ['15m', '30m', '45m', '1h'],
    activeSlot: 0,
    location: 'Europe/Warsaw',
    video: 'Google Meet',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    settings: {
      notice: '1 hour',
      bufferBefore: '15 mins',
      bufferAfter: '15 mins',
      interval: '5 mins'
    }
  },
  {
    name: 'Peer Richelsen',
    handle: 'peer',
    title: 'German Lessons',
    bio: "Let's learn German!",
    slots: ['15m', '30m', '45m', '1h'],
    activeSlot: 3,
    location: 'Europe/Hamburg',
    video: 'Google Meet',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    settings: {
      notice: '1 hour',
      bufferBefore: '15 mins',
      bufferAfter: '15 mins',
      interval: '5 mins'
    }
  },
  {
    name: 'Keith Williams',
    handle: 'keith',
    title: 'Engineering Deep-Dive',
    bio: "Have technical questions or want to dive into Cal.com's architecture, infrastructure, or roadmap? Book a time for a deep technical session.",
    slots: ['15m', '30m', '45m', '1h'],
    activeSlot: 3,
    location: 'South America/Buenos Aires',
    video: 'Cal Video',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    settings: {
      notice: '1 hour',
      bufferBefore: '15 mins',
      bufferAfter: '15 mins',
      interval: '5 mins'
    }
  }
];

/* ── Scroll-animated wrapper ── */
function AnimateOnScroll({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

/* ── Reusable pill tag ── */
function SectionTag({ icon, label }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: '#fff', border: '1px solid #E5E7EB',
      borderRadius: 100, padding: '6px 14px', marginBottom: 20,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}</span>
    </div>
  );
}

/* ── CTA button pair ── */
function CTAButtons({ primary = 'Get started', secondary = 'Book a demo' }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
      <a href="#" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: '#111827', color: '#fff', textDecoration: 'none',
        padding: '11px 22px', borderRadius: 100, fontWeight: 600, fontSize: 14,
        transition: 'background 0.15s',
      }}
        onMouseEnter={e => e.currentTarget.style.background = '#1F2937'}
        onMouseLeave={e => e.currentTarget.style.background = '#111827'}
      >
        {primary}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
      </a>
      <a href="#" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: '#fff', color: '#111827', textDecoration: 'none',
        padding: '11px 22px', borderRadius: 100, fontWeight: 600, fontSize: 14,
        border: '1px solid #E5E7EB', transition: 'background 0.15s',
      }}
        onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
      >
        {secondary}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
      </a>
    </div>
  );
}

/* ── Section wrapper (white card on gray) ── */
function Card({ children, style = {} }) {
  return (
    <div style={{
      background: '#F3F4F6', borderRadius: 24,
      padding: '64px 64px',
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ── How it works step cards ── */
function StepCard({ num, title, desc, children }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16,
      padding: '28px', flex: 1,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      border: '1px solid rgba(0,0,0,0.04)',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'inline-flex', background: '#F3F4F6', borderRadius: 8,
        padding: '4px 10px', fontSize: 12, fontWeight: 700, color: '#6B7280',
        marginBottom: 16, letterSpacing: '0.3px',
      }}>{num}</div>
      <h3 style={{ fontFamily: '"Cal Sans", sans-serif', fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>{title}</h3>
      <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6, margin: '0 0 20px' }}>{desc}</p>
      <div style={{ borderRadius: 12, overflow: 'hidden', background: '#F9FAFB', minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}

/* ── Benefit card ── */
function BenefitCard({ title, desc, children }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 20, padding: '32px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 10px 40px rgba(0,0,0,0.04)',
      border: '1px solid rgba(0,0,0,0.02)',
      display: 'flex', flexDirection: 'column', minHeight: 480,
      transition: 'box-shadow 0.3s ease-in-out'
    }}>
      <h3 style={{ fontFamily: '"Cal Sans", sans-serif', fontSize: 24, fontWeight: 800, color: '#111827', margin: '0 0 12px', lineHeight: 1.2, letterSpacing: '-0.5px' }}>{title}</h3>
      <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.6, margin: '0 0 28px' }}>{desc}</p>
      <div style={{ background: '#F9FAFB', borderRadius: 16, overflow: 'visible', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #F3F4F6' }}>
        {children}
      </div>
    </div>
  );
}

function FeatureIconCard({ icon: IconComponent, label, desc }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: '#fff', borderRadius: 20, padding: '20px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 10px 40px rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.02)',
        textAlign: 'center', height: 180, cursor: 'pointer', position: 'relative',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isHovered ? 'scale(1.03)' : 'scale(1)',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Dots: Animating from center to corners on hover */}
      {[
        { x: -1, y: -1 }, { x: 1, y: -1 },
        { x: -1, y: 1 }, { x: 1, y: 1 }
      ].map((pos, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={{
            x: isHovered ? pos.x * 120 : 0,
            y: isHovered ? pos.y * 70 : 0,
            scale: isHovered ? 1.2 : 0,
            opacity: isHovered ? 0.8 : 0
          }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 5, height: 5, background: '#D1D5DB', borderRadius: '50%',
            marginLeft: -2.5, marginTop: -2.5, zIndex: 5
          }}
        />
      ))}

      <AnimatePresence mode="wait">
        {!isHovered ? (
          <motion.div
            key="front"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
          >
            <div style={{
              width: 56, height: 56, background: '#F9FAFB', borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid #F3F4F6', boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
            }}>
              <IconComponent />
            </div>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#111827', letterSpacing: '-0.2px' }}>{label}</span>
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '0 6px' }}
          >
            <span style={{ fontSize: 14, fontWeight: 800, color: '#111827', letterSpacing: '-0.2px' }}>{label}</span>
            <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5, fontWeight: 600, margin: 0 }}>
              {desc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Actual icons matching screenshots
const CardIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <circle cx="20" cy="15" r="1.5" fill="#111827" />
  </svg>
);
const CameraIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 7l-7 5 7 5V7z" />
    <rect x="1" y="5" width="15" height="14" rx="2" />
    <circle cx="8" cy="12" r="2" />
  </svg>
);
const LinkIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);
const GlobeIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const EmbedIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
    <line x1="2" y1="8" x2="22" y2="8" />
    <circle cx="12" cy="14" r="3" />
    <line x1="12" y1="17" x2="12" y2="19" />
  </svg>
);
const AppsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);
const PaintIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="M2 2l5 5" />
  </svg>
);

/* ── Testimonial card ── */
function TestimonialCard({ quote, name, handle, avatar, company }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 20, padding: '36px 32px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #E5E7EB',
      display: 'flex', flexDirection: 'column', gap: 24, height: '100%',
      transition: 'transform 0.2s ease',
    }}>
      <p style={{
        fontFamily: '"Cal Sans", sans-serif', fontSize: 22, color: '#111827',
        lineHeight: 1.3, margin: 0, fontWeight: 800, letterSpacing: '-0.5px'
      }}>"{quote}"</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 'auto' }}>
        <img src={avatar} alt={name} style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover', border: '1px solid #F3F4F6' }} />
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, color: '#111827', marginBottom: 2 }}>{name}</div>
          <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>{company}</div>
        </div>
      </div>
    </div>
  );
}

const testimonials = [
  {
    quote: "I had a Calendly and a cal.com account. I was using Calendly. After switching to Cal.com, I'm not going back.",
    name: 'Nickolas Tazes', handle: '@nickolas_tazes', company: 'Founder',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
  },
  {
    quote: "Just gave it a go and it's definitely the easiest meeting I've ever scheduled!",
    name: 'Aria Minaei', handle: '@MrAhmeti', company: 'CEO, Theatre.JS',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  },
  {
    quote: "More elegant than Calendly, more open than SavvyCal, Cal.com works and it feels just right.",
    name: 'Flo Merian', handle: '@FloMerian', company: 'Product Marketing, Mintlify',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
  },
  {
    quote: "I think Cal.com has a very good chance of creating a new category of being both great and well designed.",
    name: 'Guillermo Rauch', handle: '@rauchg', company: 'CEO, Vercel',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
  },
  {
    quote: "This platform's open-source nature and incredible UX make it stand out.",
    name: 'Ant Wilson', handle: '@AntWilson', company: 'Co-Founder & CTO, Supabase',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  },
  {
    quote: "Switched from Calendly to Cal.com for scheduling and I'm loving the customization options.",
    name: 'Peer Richelsen', handle: '@peerrich', company: 'CEO, Cal.com',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop',
  },
];

const WALL_OF_LOVE_DATA = [
  {
    name: "Ahmed Elnaggar",
    handle: "@ahmed_elnaggar1",
    text: "This platform's open-source nature and flexible licensing are a developer's dream. Self-hosting and white-labeling empower personalization and seamless integration.",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100",
    badge: "P"
  },
  {
    name: "Ross Zeiger",
    handle: "@ross_zeiger",
    text: "Great, easy to use, and beautiful interface.",
    avatar: "https://images.unsplash.com/photo-1547037579-f0fc020ac3be?w=100",
    badge: "P"
  },
  {
    name: "Wilson Wilson",
    handle: "Co-founder of Senja",
    text: "I just learned about <span style='color: #7C3AED; font-weight: 700;'>cal.com</span> this morning and now they have a new customer. I'm head over heels about Peer's project. It just works! Well done!",
    avatar: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=100",
    badge: "circle"
  },
  {
    name: "Jessie Zwaan ✨",
    handle: "@jessicamayzwaan",
    text: "Consider me a convert!<br/><br/><span style='color: #7C3AED; font-weight: 600;'>@calcom</span> has shared an easy how-to guide on integrating <span style='color: #7C3AED; font-weight: 600;'>@whereby</span> rooms into your scheduling. ⚡⚡⚡",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    badge: "X"
  },
  {
    name: "Jeroen C.",
    handle: "Pre-incubator program manager",
    text: "I came from calendly, where I had a lot of features I didn't need in a paid account. <span style='color: #7C3AED; font-weight: 600;'>Cal.com</span>'s free account for a freelancer like me is great. It packs quite some features, including Google Analytics and workflows. Support has been very responsive in fixing things, big plus!",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    badge: "C"
  },
  {
    name: "David Midgley",
    handle: "Tech Enthusiast",
    text: "I am new to <span style='color: #7C3AED; font-weight: 700;'>Cal.com</span> but so far they have scored 10/10 - it has the features I need, including connecting to Apple Calendar (I withdrew from Calendly because they dropped support for iCal without giving a reason.) Also it is free; $10 a month may not seem much but when you have several apps of this kind it adds up. And <span style='color: #7C3AED; font-weight: 700;'>cal.com</span> were extremely helpful and prompt in dealing with my questions.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    badge: "star"
  },
  {
    name: "Shivansh",
    handle: "@Shivansh_C",
    text: "I've officially transitioned out of Calendly to for personal calendar needs.<br/><br/>Simple onboarding, automated workflows and comprehensive documentation- that's the reason why. The fact that it's open source is a cherry on cake.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100",
    badge: "X"
  },
  {
    name: "Rotimi Best",
    handle: "@rotimi_best",
    text: "for the love of me, why do people still use Calendly? Just today I have seen products reference Calendly while they know of <span style='color: #7C3AED; font-weight: 700;'>@calcom</span><br/><br/>It's a no brainer for me to use , their brand is amazing, cool team + they even have more compelling features 👑",
    avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100",
    badge: "X"
  },
  {
    name: "JJ — oss/acc",
    handle: "@JosephJacks_",
    text: "Officially switching from <span style='color: #7C3AED; font-weight: 600;'>@Calendly</span> to <span style='color: #7C3AED; font-weight: 600;'>@calcom</span> ⚡",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100",
    badge: "X"
  },
  {
    name: "daniel roe UA",
    handle: "@danielroe",
    text: "... and a shout-out to <span style='color: #7C3AED; font-weight: 700;'>@calcom</span> who made it incredibly easy (and beautiful) to set things up.<br/><br/>I'm so impressed that I'm migrating to from calendly + google calendar scheduling.",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100",
    badge: "X"
  }
];

function WallOfLoveCard({ name, handle, text, avatar, badge }) {
  return (
    <div style={{ 
      background: '#fff', borderRadius: 20, padding: 24, marginBottom: 16,
      border: '1px solid #E5E7EB', breakInside: 'avoid',
      display: 'flex', flexDirection: 'column', gap: 16,
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative' }}>
          <img src={avatar} alt={name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
          <div style={{ 
            position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, 
            background: badge === 'X' ? '#000' : badge === 'P' ? '#ea580c' : '#F3F4F6', 
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #fff', fontSize: 8, fontWeight: 900, color: '#fff'
          }}>
            {badge === 'X' ? '𝕏' : badge === 'P' ? 'P' : badge === 'star' ? '★' : 'C'}
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 14, color: '#111827' }}>{name}</div>
          <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>{handle}</div>
        </div>
      </div>
      <p 
        style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, margin: 0 }} 
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
}

const integrationApps = [
  { name: 'Google Calendar', img: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg' },
  { name: 'Microsoft Teams', img: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Microsoft_Teams_logo.svg' },
  { name: 'Zoom Meeting', img: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Zoom-logo.png' },
  { name: 'HubSpot CRM', img: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/HubSpot_Logo.svg' },
  { name: 'Salesforce', img: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg' },
  { name: 'Stripe Pay', img: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg' },
  { name: 'Slack', img: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg' },
  { name: 'Zapier', img: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Zapier_logo.svg' },
  { name: 'Notion', img: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png' },
  { name: 'Google Meet', img: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Google_Meet_icon_%282020%29.svg' },
  { name: 'Office 365', img: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg' },
  { name: 'Framer Design', img: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Framer_Logo.svg' },
];

/* ── Card 01: Calendar Orbit ── */
function CalendarOrbit() {
  const icons = [
    { name: 'Apple', color: '#ff3b30', delay: 0, radius: 55, speed: 20 },
    { name: 'Google', color: '#4285F4', delay: 2, radius: 80, speed: 25 },
    { name: 'Outlook', color: '#0078d4', delay: 4, radius: 105, speed: 30 },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Central Pill */}
      <div style={{
        zIndex: 10,
        background: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: 100,
        padding: '6px 16px',
        fontWeight: 700,
        fontSize: 13,
        color: '#111827',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      }}>
        Cal.com
      </div>

      {/* Orbit Rings */}
      {[55, 80, 105].map(r => (
        <div key={r} style={{
          position: 'absolute',
          width: r * 2,
          height: r * 2,
          border: '1px solid #F3F4F6',
          borderRadius: '50%',
        }} />
      ))}

      {/* Orbiting Icons */}
      {icons.map((icon, i) => (
        <motion.div
          key={icon.name}
          animate={{ rotate: 360 }}
          transition={{ duration: icon.speed, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            width: icon.radius * 2,
            height: icon.radius * 2,
          }}
        >
          <motion.div
            style={{
              position: 'absolute',
              top: -12,
              left: '50%',
              marginLeft: -12,
              width: 24,
              height: 24,
              borderRadius: 6,
              background: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              border: '1px solid #F3F4F6',
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: icon.speed, repeat: Infinity, ease: "linear" }}
          >
            {icon.name === 'Apple' && <span style={{ color: '#ff3b30', fontSize: 9, fontWeight: 900 }}>17</span>}
            {icon.name === 'Google' && (
              <svg width="12" height="12" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            {icon.name === 'Outlook' && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#0078d4">
                <path d="M16 11c0 2.209-1.791 4-4 4s-4-1.791-4-4 1.791-4 4-4 4 1.791 4 4zm-4-6c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm10 6c0 5.5-4.5 10-10 10s-10-4.5-10-10 4.5-10 10-10 10 4.5 10 10z" />
              </svg>
            )}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Card 02: Availability Toggles (Refined Pattern) ── */
function AvailabilityMock({ checked }) {
  const days = [
    { label: 'Mon', time: '8:30 am - 5:00 pm' },
    { label: 'Tue', time: '9:00 am - 6:30 pm' },
    { label: 'Wed', time: '10:00 am - 7:00 pm' },
  ];

  return (
    <div style={{ width: '100%', padding: '24px', background: '#fff', border: '1px solid #F3F4F6', borderRadius: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {days.map((day, i) => (
          <div key={day.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <motion.div
              animate={{
                backgroundColor: checked[i] ? '#111827' : '#E5E7EB',
                scale: checked[i] ? [1, 0.95, 1] : 1
              }}
              transition={{
                duration: 0.2,
                scale: { duration: 0.15 }
              }}
              style={{ width: 32, height: 18, borderRadius: 100, position: 'relative', cursor: 'pointer', flexShrink: 0 }}
            >
              <motion.div
                animate={{ x: checked[i] ? 16 : 2 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
                style={{ position: 'absolute', top: 2, width: 14, height: 14, background: '#fff', borderRadius: '50%', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
              />
            </motion.div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', width: 34 }}>{day.label}</span>
            <div style={{ flex: 1, height: 32, background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: 6, display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: 12, color: '#6B7280', overflow: 'hidden' }}>
              <span className="truncate">{day.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const UserIcon = ({ isAllChecked }) => (
  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <motion.div
      initial={false}
      animate={{
        scale: isAllChecked ? [1, 1.15, 1.1] : 0,
        opacity: isAllChecked ? [0, 0.15, 0.1] : 0
      }}
      transition={{ duration: 0.8, repeat: isAllChecked ? Infinity : 0, repeatType: 'reverse' }}
      style={{ position: 'absolute', width: 90, height: 90, background: '#D1D5DB', borderRadius: '50%', zIndex: 0 }}
    />
    <svg width="48" height="48" viewBox="0 0 24 24" fill="#374151" style={{ position: 'relative', zIndex: 1 }}>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  </div>
);

/* ── Card 03: Video Meeting Mockup (New) ── */
function VideoMeetingMock({ isAllChecked }) {
  const toolbarIcons = [
    { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg> },
    { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="1" y1="1" x2="23" y2="23" /><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" /><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg> },
    { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> },
    { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg> },
    { icon: <div style={{ fontSize: 7, fontWeight: 900, border: '1.5px solid currentColor', padding: '1px 2px', borderRadius: 3 }}>REC</div> }
  ];

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 180, background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px 16px 0 0', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      {/* Browser Header - More Compact */}
      <div style={{ padding: '8px 12px', borderBottom: '1px solid #F3F4F6', display: 'flex', gap: 4 }}>
        {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#E5E7EB' }} />)}
      </div>

      {/* Split Screen Content - Multi-tone */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', background: '#FDFDFD' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #F3F4F6', background: '#FAFAFA' }}>
          <UserIcon isAllChecked={isAllChecked} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <UserIcon isAllChecked={isAllChecked} />
        </div>
      </div>

      {/* Floating Toolbar - Glassmorphic & Scaled */}
      <div style={{ 
        position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', 
        display: 'flex', gap: 8, padding: '6px 14px', 
        background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(229, 231, 235, 0.5)', borderRadius: 100, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.06)', zIndex: 10 
      }}>
        {toolbarIcons.map((item, i) => (
          <div key={i} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, color: i === 1 ? '#EF4444' : '#6B7280' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>{item.icon}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DropdownField({ label, value }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8, letterSpacing: '-0.2px' }}>{label}</label>
      <div style={{
        background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '12px 14px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, color: '#111827',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)', fontWeight: 500
      }}>
        {value}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}

function NoticeAndBuffersMock({ profile }) {
  return (
    <div style={{ width: '90%', padding: '32px', background: '#fff', borderRadius: 24, border: '1px solid #E5E7EB', boxShadow: '0 20px 50px rgba(0,0,0,0.08)' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={profile.handle}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5"><path d="M12 2v20M2 12h20" /></svg>
            <h4 style={{ fontSize: 18, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>Notice and buffers</h4>
          </div>

          <DropdownField label="Minimum notice" value={profile.settings?.notice || '2 days'} />

          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <DropdownField label="Buffer before event" value={profile.settings?.bufferBefore || '0 mins'} />
            </div>
            <div style={{ flex: 1 }}>
              <DropdownField label="Buffer after event" value={profile.settings?.bufferAfter || '30 mins'} />
            </div>
          </div>

          <DropdownField label="Time-slot intervals" value={profile.settings?.interval || '1 hour'} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function BookingLinkMock({ profile }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute', width: '120%', height: '120%',
        background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 70%)',
        opacity: 0.5
      }} />

      <AnimatePresence mode="wait">
        <motion.div
          key={profile.handle}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          style={{
            width: '85%', maxWidth: 300, background: '#fff', borderRadius: 24,
            border: '1px solid #E5E7EB', boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
            overflow: 'visible', position: 'relative'
          }}
        >
          {/* Floating Glassmorphic Pill URL */}
          <div style={{
            position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(243, 244, 246, 0.8)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(229, 231, 235, 0.5)', borderRadius: 100,
            padding: '6px 20px', fontSize: 15, fontWeight: 800, color: '#111827',
            zIndex: 10, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            cal.com/<span style={{ color: '#3B82F6' }}>{profile.handle}</span>
          </div>

          <div style={{ padding: '36px 28px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <img src={profile.avatar} alt={profile.name} style={{ width: 52, height: 52, borderRadius: '50%', border: '2px solid #F3F4F6' }} />
              <div>
                <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>{profile.name}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>{profile.title}</div>
              </div>
            </div>

            <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.6, marginBottom: 20, fontWeight: 500 }}>{profile.bio}</p>

            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              {profile.slots.map(slot => (
                <div key={slot} style={{
                  flex: 1, height: 32,
                  background: slot === profile.slots[profile.activeSlot] ? '#111827' : '#fff',
                  border: `1px solid ${slot === profile.slots[profile.activeSlot] ? '#111827' : '#E5E7EB'}`,
                  borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 800, color: slot === profile.slots[profile.activeSlot] ? '#fff' : '#4B5563',
                  boxShadow: slot === profile.slots[profile.activeSlot] ? '0 4px 10px rgba(0,0,0,0.1)' : 'none'
                }}>
                  {slot}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 700, color: '#111827' }}>
                <div style={{ width: 24, height: 24, background: '#F3F4F6', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 10.5V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3.5l4 4v-11l-4 4z" /></svg>
                </div>
                {profile.video}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600, color: '#6B7280' }}>
                <div style={{ width: 24, height: 24, background: '#F3F4F6', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                </div>
                {profile.location}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
function BookerExperienceMock({ profile }) {
  const days = [
    {
      name: 'Wed 06', events: [
        { title: 'Coffee', time: '11 AM - 12 PM', color: '#E9D5FF', textColor: '#7E22CE' },
        { title: 'Lunch date', time: '12 PM - 1 PM', color: '#E9D5FF', textColor: '#7E22CE' }
      ]
    },
    {
      name: 'Thu 07', events: [
        { title: 'Design conference', time: '12 PM - 2 PM', color: '#F3F4F6', textColor: '#4B5563' }
      ]
    },
    { name: 'Fri 08', events: [] },
    {
      name: 'Sat 09', events: [
        { title: 'Hiring call', time: '11:30 AM - 1 PM', color: '#FEE2E2', textColor: '#B91C1C' }
      ]
    },
    {
      name: 'Sun 10', events: [
        { title: 'Company meeting', time: '11 AM - 2:30 PM', color: '#DBEAFE', textColor: '#1D4ED8' }
      ]
    }
  ];

  return (
    <div style={{ width: '100%', background: '#fff', borderRadius: 16, border: '1px solid #F3F4F6', padding: '16px 20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      {/* Header with Toggles */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 16, background: '#111827', borderRadius: 100, position: 'relative' }}>
            <div style={{ position: 'absolute', right: 2, top: 2, width: 12, height: 12, background: '#fff', borderRadius: '50%' }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Overlay my calendar</span>
        </div>
        <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: 6, padding: 2 }}>
          <div style={{ padding: '4px 8px', fontSize: 11, fontWeight: 600, color: '#111827', background: '#fff', borderRadius: 4, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>12h</div>
          <div style={{ padding: '4px 8px', fontSize: 11, fontWeight: 600, color: '#6B7280' }}>24h</div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', border: '1px solid #F3F4F6', borderRadius: 8, overflow: 'hidden' }}>
        {days.map((day, colIdx) => (
          <div key={day.name} style={{ borderRight: colIdx < 4 ? '1px solid #F3F4F6' : 'none' }}>
            <div style={{ padding: '8px 0', fontSize: 12, color: '#6B7280', textAlign: 'center', borderBottom: '1px solid #F3F4F6' }}>{day.name}</div>
            <div style={{ height: 160, padding: 4, display: 'flex', flexDirection: 'column', gap: 4, position: 'relative' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={profile.handle + colIdx}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    visible: { transition: { staggerChildren: 0.1, delayChildren: colIdx * 0.1 } }
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}
                >
                  {day.events.map((event, i) => (
                    <motion.div
                      key={event.title}
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      style={{
                        background: event.color, padding: '6px 8px', borderRadius: 4,
                        display: 'flex', flexDirection: 'column', gap: 1
                      }}
                    >
                      <div style={{ fontSize: 9, fontWeight: 700, color: event.textColor }}>{event.title}</div>
                      <div style={{ fontSize: 8, fontWeight: 500, color: event.textColor, opacity: 0.8 }}>{event.time}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Benefit: Meeting Reminders Mock (High Fidelity Stack) ── */
function MeetingRemindersMock({ profile, index }) {
  const states = [
    { title: 'Meeting is starting now', body: 'Your meeting is starting now. Hurry up!', time: 'Just now' },
    { title: 'New booking confirmed', body: 'James Oliver booked a 30min discovery call with you.', time: 'Just now' },
    { title: 'Meeting starts in 15 mins', body: 'Your next meeting is starting in 15 mins', time: '15 mins' }
  ];

  const currentState = states[index % states.length];

  return (
    <div style={{ width: '100%', height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentState.title}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 320 }}
        >
          {/* Active Notification */}
          <div style={{
            background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: '16px 20px',
            display: 'flex', gap: 14, alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
          }}>
            <div style={{ width: 44, height: 44, background: '#111827', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>Cal</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#111827', marginBottom: 2 }}>{currentState.title}</div>
              <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.4 }} className="truncate">{currentState.body}</div>
            </div>
            <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, whiteSpace: 'nowrap' }}>{currentState.time}</div>
          </div>

          {/* 3D Stack Underlays */}
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              position: 'absolute', left: `${i * 2}%`, right: `${i * 2}%`, top: i * 8, zIndex: -i,
              height: 72, background: '#fff', border: '1px solid #F3F4F6', borderRadius: 16,
              opacity: 1 - (i * 0.25), boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
            }} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function Features() {
  const [checked, setChecked] = useState([false, false, false]);
  const [benefitIndex, setBenefitIndex] = useState(0);
  const [appQueue, setAppQueue] = useState(integrationApps.slice(0, 6).map((app, i) => ({ ...app, uid: `init-${i}` })));
  const [nextAppIdx, setNextAppIdx] = useState(6);
  const sliderRef = useRef(null);
  const [sliderConstraints, setSliderConstraints] = useState({ left: 0, right: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setAppQueue(prev => {
        const nextApp = integrationApps[nextAppIdx % integrationApps.length];
        setNextAppIdx(curr => curr + 1);
        // Robustly ensure exactly 6 items: 1 new + 5 old
        const updated = [{ ...nextApp, uid: Date.now() }, ...prev];
        return updated.slice(0, 6);
      });
    }, 3500);
    return () => clearInterval(timer);
  }, [nextAppIdx]);

  useEffect(() => {
    if (sliderRef.current) {
      const scrollWidth = sliderRef.current.scrollWidth;
      const clientWidth = sliderRef.current.offsetWidth;
      setSliderConstraints({ left: -(scrollWidth - clientWidth + 128), right: 0 });
    }
  }, []);

  // Cycle 01: Availability Toggles (Cards 02-03)
  useEffect(() => {
    const cycle = async () => {
      await new Promise(r => setTimeout(r, 1000));
      for (let i = 0; i < 3; i++) {
        setChecked(prev => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
        await new Promise(r => setTimeout(r, 600));
      }
      await new Promise(r => setTimeout(r, 2000));
      setChecked([false, false, false]);
      setTimeout(cycle, 2000);
    };
    cycle();
  }, []);

  // Cycle 02: Benefits Showcase (Every 5s)
  useEffect(() => {
    const timer = setInterval(() => {
      setBenefitIndex(prev => (prev + 1) % PROFILES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const isAllChecked = checked.every(c => c);
  const currentProfile = PROFILES[benefitIndex];

  return (
    <div style={{ background: '#EBEBEB', padding: '0 24px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ─────────────── HOW IT WORKS ─────────────── */}
        <AnimateOnScroll>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <SectionTag icon="🔗" label="How it works" />
              <h2 style={{ fontFamily: '"Cal Sans", sans-serif', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: '#111827', margin: '0 0 12px', letterSpacing: '-1.5px' }}>
                With us, appointment scheduling is easy
              </h2>
              <p style={{ fontSize: 17, color: '#6B7280', margin: '0 0 28px', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
                Effortless scheduling for business and individuals, powerful solutions for fast-growing modern companies.
              </p>
              <CTAButtons />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <StepCard num="01" title="Connect your calendar"
                desc="We'll handle all the cross-referencing, so you don't have to worry about double bookings.">
                <CalendarOrbit />
              </StepCard>

              <StepCard num="02" title="Set your availability"
                desc="Want to block off weekends? Set up any buffers? We make that easy.">
                <AvailabilityMock checked={checked} />
              </StepCard>

              <StepCard num="03" title="Choose how to meet"
                desc="It could be a video chat, phone call, or a walk in the park!">
                <VideoMeetingMock isAllChecked={isAllChecked} />
              </StepCard>
            </div>
          </Card>
        </AnimateOnScroll>

        {/* ─────────────── BENEFITS ─────────────── */}
        <AnimateOnScroll>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <SectionTag icon="🎒" label="Benefits" />
              <h2 style={{ fontFamily: '"Cal Sans", sans-serif', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: '#111827', margin: '0 0 12px', letterSpacing: '-1.5px' }}>
                Your all-purpose scheduling app
              </h2>
              <p style={{ fontSize: 17, color: '#6B7280', margin: '0 0 28px', lineHeight: 1.6 }}>
                Discover a variety of our advanced features. Unlimited and free for individuals.
              </p>
              <CTAButtons />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
              <BenefitCard
                title="Avoid meeting overload"
                desc="Only get booked when you want to. Set daily, weekly or monthly limits and add buffers around your events."
              >
                <NoticeAndBuffersMock profile={currentProfile} />
              </BenefitCard>

              <BenefitCard
                title="Stand out with a custom booking link"
                desc="Customize your booking link so it's short and easy to remember for your bookers."
              >
                <BookingLinkMock profile={currentProfile} />
              </BenefitCard>

              <BenefitCard
                title="Streamline booking experience"
                desc="Let your bookers overlay their calendar, receive confirmations, and allow them to reschedule with ease."
              >
                <BookerExperienceMock profile={currentProfile} />
              </BenefitCard>

              <BenefitCard
                title="Reduce no-shows"
                desc="Easily send sms or meeting reminder emails about bookings, and send automated follow-ups."
              >
                <MeetingRemindersMock profile={currentProfile} index={benefitIndex} />
              </BenefitCard>
            </div>
          </Card>
        </AnimateOnScroll>

        {/* ─────────────── AND SO MUCH MORE ─────────────── */}
        <AnimateOnScroll>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <h2 style={{ fontFamily: '"Cal Sans", sans-serif', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: '#111827', margin: '0 0 8px', letterSpacing: '-1.5px' }}>
                …and so much more!
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              <FeatureIconCard icon={CardIcon} label="Accept payments" desc="You can monetize your bookings through our Stripe integration." />
              <FeatureIconCard icon={CameraIcon} label="Built-in video conferencing" desc="Cal Video is our in-house video conferencing platform." />
              <FeatureIconCard icon={LinkIcon} label="Short booking links" desc="Each booking link can be short which makes it easy to remember." />
              <FeatureIconCard icon={ShieldIcon} label="Privacy first" desc="Our solution has been designed to keep your information private." />
              <FeatureIconCard icon={GlobeIcon} label="65+ languages" desc="Cal.com is available in over 65 languages to serve users worldwide." />
              <FeatureIconCard icon={EmbedIcon} label="Easy embeds" desc="Add your booking page to your website with just a few lines of code." />
              <FeatureIconCard icon={AppsIcon} label="All your favorite apps" desc="Connect with all the tools you use, from Zoom to HubSpot." />
              <FeatureIconCard icon={PaintIcon} label="Simple customization" desc="Personalize your profile and booking pages to match your brand." />
            </div>
          </Card>
        </AnimateOnScroll>

        {/* ─────────────── TESTIMONIALS ─────────────── */}
        <AnimateOnScroll>
          <div style={{ position: 'relative', background: '#F9FAFB', borderRadius: 32, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
            {/* Blueprint Grid Overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'linear-gradient(#E5E7EB 1px, transparent 1px), linear-gradient(90deg, #E5E7EB 1px, transparent 1px)',
              backgroundSize: '100px 100px', opacity: 0.4, pointerEvents: 'none'
            }} />

            {/* Plus Signs at Intersections */}
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                top: (Math.floor(i / 10) * 100) - 6,
                left: ((i % 10) * 100) - 6,
                fontSize: 12, color: '#D1D5DB', fontWeight: 300, pointerEvents: 'none', opacity: 0.6
              }}>+</div>
            ))}

            <div style={{ position: 'relative', zIndex: 5, padding: '80px 0 100px' }}>
              <div style={{ textAlign: 'center', marginBottom: 60, padding: '0 64px' }}>
                <SectionTag icon="👤" label="Testimonials" />
                <h2 style={{ fontFamily: '"Cal Sans", sans-serif', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: '#111827', margin: '0 10px 12px', letterSpacing: '-1.5px' }}>
                  Don't just take our word for it
                </h2>
                <p style={{ fontSize: 18, color: '#6B7280', margin: '0 0 28px', lineHeight: 1.6, fontWeight: 500 }}>
                  Our users are our best ambassadors. Discover why we're the top choice for scheduling meetings.
                </p>
              </div>

              <motion.div
                style={{ padding: '0 100px', cursor: 'grab' }}
                whileTap={{ cursor: 'grabbing' }}
                ref={sliderRef}
              >
                <motion.div
                  drag="x"
                  dragConstraints={sliderConstraints}
                  dragElastic={0.15}
                  style={{ display: 'flex', gap: 32, padding: '10px 0' }}
                >
                  {testimonials.map((t, i) => (
                    <div key={i} style={{ flex: '0 0 auto', width: 440 }}>
                      <TestimonialCard {...t} />
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </AnimateOnScroll>


        {/* ─────────────── INTEGRATIONS ─────────────── */}
        <AnimateOnScroll>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'stretch', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 420px', padding: '64px', borderRight: '1px solid #E5E7EB' }}>
                <SectionTag icon="🔲" label="App store" />
                <h2 style={{ fontFamily: '"Cal Sans", sans-serif', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: '#111827', margin: '0 0 12px', letterSpacing: '-1px', lineHeight: 1.1 }}>
                  All your key tools in-sync with your meetings
                </h2>
                <p style={{ fontSize: 16, color: '#6B7280', margin: '0 0 32px', lineHeight: 1.6, fontWeight: 500 }}>
                  Cal.com works with all apps already in your flow ensuring everything works perfectly together.
                </p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <a href="#" style={{
                    background: '#111827', color: '#fff', padding: '12px 24px', borderRadius: 100,
                    fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8
                  }}>
                    Get started <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6" /></svg>
                  </a>
                  <a href="#" style={{
                    background: '#F3F4F6', color: '#111827', padding: '12px 24px', borderRadius: 100,
                    fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
                    border: '1px solid #E5E7EB'
                  }}>
                    Explore apps <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6" /></svg>
                  </a>
                </div>
              </div>

              <div style={{ flex: '1.2 1 500px', position: 'relative', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 480 }}>
                {/* Blueprint Grid Overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: 'linear-gradient(#E5E7EB 1px, transparent 1px), linear-gradient(90deg, #E5E7EB 1px, transparent 1px)',
                  backgroundSize: '160px 120px', opacity: 0.5, pointerEvents: 'none'
                }} />

                {/* Plus Intersections */}
                {[0, 1, 2, 3, 4, 5].map(x => [0, 1, 2, 3, 4].map(y => (
                  <div key={`${x}-${y}`} style={{
                    position: 'absolute', left: (x * 160) - 6, top: (y * 120) - 6,
                    fontSize: 12, color: '#D1D5DB', fontWeight: 300, pointerEvents: 'none'
                  }}>+</div>
                )))}

                <div style={{
                  position: 'relative', height: 240, padding: '0 20px',
                  display: 'grid', gridTemplateColumns: 'repeat(3, 160px)', gridTemplateRows: 'repeat(2, 120px)',
                  alignContent: 'center', justifyContent: 'center', gap: 0, overflow: 'hidden'
                }}>
                  <AnimatePresence mode="popLayout" initial={false}>
                    {appQueue.map((app) => (
                      <motion.div
                        key={app.uid}
                        layout
                        initial={{ opacity: 0, scale: 0.8, x: -20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                        transition={{
                          layout: { type: 'spring', stiffness: 180, damping: 22 },
                          opacity: { duration: 0.4 },
                          scale: { duration: 0.4 }
                        }}
                        style={{
                          width: 160, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: 10
                        }}
                      >
                        <div style={{
                          width: '100%', height: '100%', background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                          padding: 14, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', textAlign: 'center'
                        }}>
                          <img src={app.img} alt={app.name} style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#111827', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {app.name}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </Card>
        </AnimateOnScroll>

        {/* ─────────────── FINAL CTA ─────────────── */}
        <AnimateOnScroll>
          <Card style={{ textAlign: 'center', padding: '80px 64px', position: 'relative', overflow: 'hidden' }}>
            {/* Background squares decoration */}
            <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: 4, opacity: 0.3, pointerEvents: 'none', padding: 4 }}>
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} style={{ background: '#E5E7EB', borderRadius: 8 }} />
              ))}
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontFamily: '"Cal Sans", sans-serif', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, color: '#111827', margin: '0 0 28px', letterSpacing: '-2px' }}>
                Smarter, simpler scheduling
              </h2>
              <CTAButtons primary="Get started" secondary="Talk to sales" />
              {/* Awards */}
              <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', marginTop: 40, alignItems: 'center' }}>
                {[
                  { label: 'Product of the day', rank: '1st' },
                  { label: 'Product of the week', rank: '1st' },
                  { label: 'Product of the month', rank: '1st' },
                ].map(award => (
                  <div key={award.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600, letterSpacing: '0.3px', marginBottom: 2 }}>{award.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#111827' }}>{award.rank}</div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map(i => <span key={i} style={{ color: '#F59E0B', fontSize: 18 }}>★</span>)}
                  <img src="/images/FPY0hlgHbL6TgsHwVHWWJ2pcP6g.svg" alt="ProductHunt" style={{ width: 24, height: 24, marginLeft: 6 }} />
                </div>
              </div>
            </div>
          </Card>
        </AnimateOnScroll>
        {/* ─────────────── WALL OF LOVE ─────────────── */}
        <div style={{ background: '#F9FAFB', padding: '80px 0', borderTop: '1px solid #E5E7EB' }}>
          <AnimateOnScroll>
            <div style={{ textAlign: 'center', marginBottom: 60, padding: '0 24px' }}>
               <SectionTag icon="🗣️" label="Wall of love" />
               <h2 style={{ fontFamily: '"Cal Sans", sans-serif', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, color: '#111827', margin: '0 0 20px', letterSpacing: '-2.5px', lineHeight: 1 }}>
                 See why our users love Cal.com
               </h2>
               <p style={{ fontSize: 18, color: '#6B7280', margin: '0 auto 40px', lineHeight: 1.6, maxWidth: 600 }}>
                 Read the impact we've had from those who matter most - our customers.
               </p>
               <div style={{ marginBottom: 60 }}>
                  <CTAButtons />
               </div>

               <div style={{ 
                 columnCount: 3, columnGap: 16, maxWidth: 1200, margin: '0 auto', textAlign: 'left',
                 padding: '0 20px'
               }}>
                 {WALL_OF_LOVE_DATA.map((t, i) => (
                   <WallOfLoveCard key={i} {...t} />
                 ))}
               </div>

               <button style={{ 
                 marginTop: 40, background: '#fff', border: '1px solid #E5E7EB', padding: '10px 24px', 
                 borderRadius: 8, fontWeight: 700, color: '#111827', cursor: 'pointer',
                 boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
               }}>
                 Show more
               </button>
            </div>
          </AnimateOnScroll>
        </div>

      </div>
    </div>
  );
}
