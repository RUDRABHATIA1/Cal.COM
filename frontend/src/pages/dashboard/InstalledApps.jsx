import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Package } from 'lucide-react';

export default function InstalledApps() {
  return (
    <DashboardLayout
      title="App store"
      subtitle="Connecting people, technology and the workplace."
    >
      <div className="max-w-3xl">
        <div className="flex flex-col items-center justify-center py-24 border border-[#2B2B2B] rounded-xl bg-[#141414] text-center">
          <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#2B2B2B] flex items-center justify-center mb-6">
            <Package className="w-7 h-7 text-[#71717A]" />
          </div>
          <h3 className="text-[16px] font-bold text-white mb-2">No installed apps</h3>
          <p className="text-[13px] text-[#71717A] max-w-xs">
            Apps you install from the App Store will appear here.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
