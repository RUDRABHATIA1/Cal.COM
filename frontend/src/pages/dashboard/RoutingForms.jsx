import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import UpgradeModal from '../../components/UpgradeModal';
import { Network, GitMerge, Settings2, ShieldAlert } from 'lucide-react';

export default function RoutingForms() {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  return (
    <DashboardLayout 
      title="Routing Forms" 
      subtitle="Ask screening questions to connect people with the right scheduling link."
    >
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden relative">
        {/* Upsell Banner Area */}
        <div className="bg-[#111827] text-white p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent blur-2xl"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
              <Network className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-cal mb-4">Route bookings to the right team member automatically</h2>
            <p className="text-gray-400 text-lg mb-8">
              Build custom forms that ask qualifying questions before someone books. Send highly-qualified leads to your senior team, and route support questions to help docs.
            </p>
            <button 
              onClick={() => setIsUpgradeModalOpen(true)}
              className="px-8 py-3.5 bg-white text-[#111827] rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Try it for free
            </button>
          </div>
        </div>

        {/* Feature Mockup Area */}
        <div className="p-8 md:p-12 bg-gray-50 border-t border-[#E5E7EB]">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-[#111827] mb-8 text-center">How Routing Forms work</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector lines (Desktop only) */}
              <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-[#D1D5DB] to-transparent z-0"></div>

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm flex items-center justify-center mb-4 text-[#111827]">
                  <Settings2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[#111827] mb-2">1. Ask Questions</h4>
                <p className="text-sm text-[#6B7280] text-center">Collect company size, budget, or support context upfront.</p>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm flex items-center justify-center mb-4 text-blue-600">
                  <GitMerge className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[#111827] mb-2">2. Set Rules</h4>
                <p className="text-sm text-[#6B7280] text-center">"If budget &gt; $50k, route to Enterprise Sales Team."</p>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm flex items-center justify-center mb-4 text-green-600">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[#111827] mb-2">3. Book Meeting</h4>
                <p className="text-sm text-[#6B7280] text-center">The prospect lands on the exact right calendar automatically.</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      <UpgradeModal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)} 
      />
    </DashboardLayout>
  );
}
