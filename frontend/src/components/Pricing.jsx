import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Shield, Rocket, Sparkles } from 'lucide-react';

const PLANS = [
  {
    name: 'Free',
    desc: 'For individuals starting out.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: Sparkles,
    features: ['Unlimited event types', '1 Calendar connection', 'Cal Video included', 'Standard features'],
    button: 'Get started for free',
    color: 'white'
  },
  {
    name: 'Essentials',
    desc: 'Power users & small teams.',
    monthlyPrice: 15,
    yearlyPrice: 12,
    icon: Zap,
    features: ['Everything in Free', 'Unlimited connections', 'Remove branding', 'Advanced routing'],
    button: 'Upgrade to Essentials',
    color: '#3B82F6',
    popular: true
  },
  {
    name: 'Pro',
    desc: 'Advanced controls & scale.',
    monthlyPrice: 25,
    yearlyPrice: 20,
    icon: Rocket,
    features: ['Everything in Essentials', 'Workflows automations', 'Round Robin logic', 'Premium support'],
    button: 'Upgrade to Pro',
    color: '#8B5CF6'
  }
];

export default function Pricing() {
  const [billing, setBilling] = useState('monthly'); // 'monthly' | 'yearly'

  return (
    <section id="pricing" className="py-24 px-6 bg-[#0E0E0E] relative overflow-hidden">
      {/* ── Background Gradients ────────────────────────── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-blue-500/[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] bg-purple-500/[0.03] blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[11px] font-bold uppercase tracking-widest mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Transparent Pricing
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mb-6 font-cal tracking-tight"
          >
            The last scheduling tool<br />you'll ever need.
          </motion.h2>
        </div>

        {/* ── Billing Toggle ─────────────────────────────── */}
        <div className="flex justify-center mb-16">
          <div className="relative p-1 bg-white/5 border border-white/10 rounded-2xl flex">
            <motion.div 
              layout
              className="absolute inset-y-1 bg-white rounded-xl shadow-lg"
              initial={false}
              animate={{ 
                x: billing === 'monthly' ? 0 : 100,
                width: billing === 'monthly' ? 100 : 120 
              }}
              transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
            />
            <button 
              onClick={() => setBilling('monthly')}
              className={`relative z-10 px-6 py-2.5 text-[13px] font-bold transition-colors w-[100px] ${billing === 'monthly' ? 'text-black' : 'text-white/40 hover:text-white/60'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBilling('yearly')}
              className={`relative z-10 px-6 py-2.5 text-[13px] font-bold transition-colors w-[120px] ${billing === 'yearly' ? 'text-black' : 'text-white/40 hover:text-white/60'}`}
            >
              Yearly <span className="ml-1 text-[10px] opacity-60">-20%</span>
            </button>
          </div>
        </div>

        {/* ── Pricing Grid ───────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan, idx) => (
            <PricingCard key={plan.name} plan={plan} billing={billing} idx={idx} />
          ))}
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-white/20 text-sm font-medium"
        >
          All prices in USD. Need something custom? <span className="text-white/40 underline cursor-pointer hover:text-white transition-colors">Contact Enterprise</span>
        </motion.p>
      </div>
    </section>
  );
}

function PricingCard({ plan, billing, idx }) {
  const price = billing === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 + 0.2 }}
      whileHover={{ y: -8 }}
      className={`relative p-8 rounded-[32px] border flex flex-col h-full transition-shadow duration-500 ${
        plan.popular 
          ? 'bg-white/[0.03] border-white/20 shadow-[0_20px_80px_rgba(255,255,255,0.05)]' 
          : 'bg-white/[0.01] border-white/5'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_0_30px_rgba(59,130,246,0.3)]">
          Most Popular
        </div>
      )}

      <div className="mb-8">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
          <plan.icon className="w-6 h-6" style={{ color: plan.color }} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2 font-cal">{plan.name}</h3>
        <p className="text-white/40 text-sm font-medium leading-relaxed">{plan.desc}</p>
      </div>

      <div className="mb-8 flex items-baseline gap-1.5">
        <AnimatePresence mode="wait">
          <motion.span 
            key={price}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-5xl font-black text-white tracking-tighter"
          >
            ${price}
          </motion.span>
        </AnimatePresence>
        <span className="text-white/20 text-sm font-bold uppercase tracking-widest">/mo</span>
      </div>

      <div className="space-y-4 mb-10 flex-1">
        {plan.features.map(feat => (
          <div key={feat} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-white/40" />
            </div>
            <span className="text-[14px] text-white/60 font-medium">{feat}</span>
          </div>
        ))}
      </div>

      <button className={`w-full py-4 rounded-2xl font-black text-sm tracking-wide transition-all ${
        plan.popular
          ? 'bg-white text-black hover:scale-[1.02] shadow-[0_10px_40px_rgba(255,255,255,0.1)]'
          : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
      }`}>
        {plan.button}
      </button>
    </motion.div>
  );
}
