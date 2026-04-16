import { motion, AnimatePresence } from 'framer-motion';

// ── Page-level transition ──────────────────────────────────────────────────
export const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
};

// ── Fade-in wrapper ────────────────────────────────────────────────────────
export const FadeIn = ({ children, delay = 0, duration = 0.5, className = '' }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

// ── Slide up on mount ──────────────────────────────────────────────────────
export const SlideUp = ({ children, delay = 0, duration = 0.5, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    className={className}
  >
    {children}
  </motion.div>
);

// ── Scale in ───────────────────────────────────────────────────────────────
export const ScaleIn = ({ children, delay = 0, duration = 0.4, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    className={className}
  >
    {children}
  </motion.div>
);

// ── Stagger container + child ──────────────────────────────────────────────
export const StaggerContainer = ({
  children,
  staggerDelay = 0.06,
  className = '',
}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: {},
      visible: { transition: { staggerChildren: staggerDelay } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = '' }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 16 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// ── Hover-lift card wrapper ────────────────────────────────────────────────
export const HoverCard = ({ children, className = '', onClick }) => (
  <motion.div
    whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    className={className}
    onClick={onClick}
  >
    {children}
  </motion.div>
);

// ── Animated counter ───────────────────────────────────────────────────────
export const AnimatedNumber = ({ value, className = '' }) => (
  <motion.span
    key={value}
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={className}
  >
    {value}
  </motion.span>
);

// ── Layout animation wrapper ──────────────────────────────────────────────
export const AnimatedLayout = ({ children, className = '' }) => (
  <motion.div
    layout
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    className={className}
  >
    {children}
  </motion.div>
);
