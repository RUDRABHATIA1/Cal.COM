import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

export default function UpgradeModal({ isOpen, onClose }) {
  const [billingCycle, setBillingCycle] = useState('monthly');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between bg-white relative z-10">
            <h2 className="text-xl font-bold text-[#111827] font-cal">Upgrade your plan</h2>
            <button onClick={onClose} className="p-2 text-[#6B7280] hover:bg-[#F3F4F6] rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8 overflow-y-auto bg-gray-50 flex-1 relative">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold font-cal text-gray-900 mb-4">Unlock advanced routing</h3>
              <p className="text-gray-500 max-w-lg mx-auto">Get access to routing forms, team scheduling, and more by upgrading to a premium plan.</p>
              
              <div className="mt-8 flex items-center justify-center gap-3">
                <span className={`text-sm font-semibold ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
                <button 
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                  className="w-12 h-6 bg-gray-900 rounded-full relative transition-colors"
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${billingCycle === 'annual' ? 'left-7' : 'left-1'}`} />
                </button>
                <span className={`text-sm font-semibold flex items-center gap-2 ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
                  Annually <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">Save 20%</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Team Plan */}
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-gray-300 transition-colors shadow-sm">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Team</h4>
                <p className="text-sm text-gray-500 mb-6">For small teams getting started.</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-cal font-bold text-gray-900">
                    ${billingCycle === 'monthly' ? '15' : '12'}
                  </span>
                  <span className="text-gray-500 font-medium">/user/mo</span>
                </div>
                <button className="w-full py-3 bg-white border-2 border-gray-200 text-gray-900 rounded-xl font-bold hover:bg-gray-50 transition-colors mb-8">
                  Upgrade to Team
                </button>
                <div className="space-y-4">
                  {['Routing Forms', 'Round-robin scheduling', 'Collective events', 'Remove Cal.com branding'].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 p-1 bg-gray-100 rounded-full text-gray-900">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organization Plan */}
              <div className="bg-gray-900 rounded-2xl p-8 border-2 border-gray-900 shadow-xl relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                  Recommended
                </div>
                <h4 className="text-lg font-bold mb-2">Organization</h4>
                <p className="text-sm text-gray-400 mb-6">Advanced controls and SAML SSO.</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-cal font-bold">
                    ${billingCycle === 'monthly' ? '35' : '28'}
                  </span>
                  <span className="text-gray-400 font-medium">/user/mo</span>
                </div>
                <button className="w-full py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-colors mb-8">
                  Upgrade to Org
                </button>
                <div className="space-y-4">
                  {['Everything in Team', 'SAML SSO integration', 'SCIM provisioning', 'Dedicated account manager'].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 p-1 bg-white/10 rounded-full text-white">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-sm text-gray-300 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
