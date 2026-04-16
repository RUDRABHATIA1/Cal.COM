import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Check, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Globe, 
  User,
  ArrowRight
} from 'lucide-react';

const StepIndicator = ({ currentStep }) => (
  <div className="flex items-center gap-2 mb-8">
    {[1, 2, 3].map((step) => (
      <React.Fragment key={step}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
          currentStep >= step ? 'bg-[#111827] text-white' : 'bg-[#F3F4F6] text-[#6B7280]'
        }`}>
          {currentStep > step ? <Check className="w-4 h-4" /> : step}
        </div>
        {step < 3 && <div className={`h-[2px] w-8 ${currentStep > step ? 'bg-[#111827]' : 'bg-[#F3F4F6]'}`} />}
      </React.Fragment>
    ))}
  </div>
);

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State for onboarding data
  const [username, setUsername] = useState(user?.username || '');
  const [timezone, setTimezone] = useState('Asia/Kolkata');

  const handleComplete = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-20 px-4">
      <div className="w-full max-w-[480px]">
        <StepIndicator currentStep={step} />

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold text-[#111827] font-cal mb-2">Welcome to Cal.com!</h1>
            <p className="text-[#6B7280] mb-8 text-lg">Let's get your profile set up so people can start booking time with you.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-2">Check your username</label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-[#F3F4F6] border border-r-0 border-[#E5E7EB] rounded-l-lg text-[#6B7280] text-sm font-medium">cal.com/</span>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-r-lg focus:ring-2 focus:ring-[#111827] outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-2">Confirm your timezone</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                  <select 
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#111827] outline-none transition-all text-sm font-medium appearance-none"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
                    <option value="UTC">UTC (GMT+0:00)</option>
                    <option value="America/New_York">America/New_York (GMT-5:00)</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                className="w-full py-3 bg-[#111827] text-white rounded-lg font-bold hover:bg-[#1F2937] transition-all flex items-center justify-center gap-2 group"
              >
                Next
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-3xl font-bold text-[#111827] font-cal mb-2">Connect your calendar</h1>
            <p className="text-[#6B7280] mb-8 text-lg">We'll use this to prevent double bookings and automatically add new events.</p>
            
            <div className="space-y-3">
              {[
                { name: 'Google Calendar', icon: 'Google' },
                { name: 'Office 365', icon: 'Microsoft' },
                { name: 'Apple iCloud', icon: 'Apple' },
                { name: 'CalDAV', icon: 'Generic' }
              ].map((provider) => (
                <button 
                  key={provider.name}
                  className="w-full p-4 border border-[#E5E7EB] rounded-xl flex items-center justify-between hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#F3F4F6] rounded-lg flex items-center justify-center text-[#111827] font-bold">
                      {provider.name.charAt(0)}
                    </div>
                    <span className="font-semibold text-[#111827]">{provider.name}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#9CA3AF] transition-transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
              <button 
                onClick={() => setStep(3)}
                className="text-sm font-semibold text-[#6B7280] hover:text-[#111827]"
              >
                Connect later
              </button>
              <button 
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-[#111827] text-white rounded-lg font-bold hover:bg-[#1F2937] transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-3xl font-bold text-[#111827] font-cal mb-2">Set your availability</h1>
            <p className="text-[#6B7280] mb-8 text-lg">Define when you're typically available for meetings.</p>
            
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white border border-[#E5E7EB] rounded-lg">
                    <Clock className="w-5 h-5 text-[#111827]" />
                  </div>
                  <div className="text-sm font-bold text-[#111827]">Working Hours</div>
                </div>
                <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Mon - Fri</div>
              </div>

              <div className="flex items-center gap-4 justify-center">
                <input 
                  type="text" 
                  value="09:00" 
                  readOnly
                  className="w-24 px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm text-center font-bold text-[#111827]"
                />
                <span className="text-[#9CA3AF]">—</span>
                <input 
                  type="text" 
                  value="17:00" 
                  readOnly
                  className="w-24 px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm text-center font-bold text-[#111827]"
                />
              </div>
            </div>

            <p className="mt-6 text-sm text-[#6B7280] text-center">
              Don't worry, you can always change these settings later in your dashboard.
            </p>

            <button 
              onClick={handleComplete}
              className="w-full mt-10 py-3 bg-[#111827] text-white rounded-lg font-bold hover:bg-[#1F2937] transition-all"
            >
              Finish Setup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
