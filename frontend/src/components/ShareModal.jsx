import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, ExternalLink, Code, Layout, Smartphone, Globe } from 'lucide-react';

export default function ShareModal({ isOpen, onClose, event }) {
  const [activeTab, setActiveTab] = useState('link');
  const [copied, setCopied] = useState(false);
  const [embedType, setEmbedType] = useState('inline');

  const eventUrl = `${window.location.origin}/${event?.userId?.username || 'user'}/${event?.slug}`;
  
  const embedCodes = {
    inline: `<div style="width:100%;height:100%;overflow:scroll" id="my-cal-inline"></div>
<script type="text/javascript">
  (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let a = arguments; p(C.Cal, a); }; d.head.appendChild(d.createElement("script")).src = L; C.Cal("init", { origin: "https://app.cal.com" }); C.Cal("inline", { elementOrSelector: "#my-cal-inline", calLink: "${event?.userId?.username}/${event?.slug}" }); })(window, "cal", "https://app.cal.com/embed/embed.js");
</script>`,
    popup: `<button data-cal-link="${event?.userId?.username}/${event?.slug}" style="cursor:pointer">Book me</button>
<script type="text/javascript">
  (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let a = arguments; p(C.Cal, a); }; d.head.appendChild(d.createElement("script")).src = L; C.Cal("init", { origin: "https://app.cal.com" }); C.Cal("ui", { styles: { branding: { brandColor: "#000000" } } }); })(window, "cal", "https://app.cal.com/embed/embed.js");
</script>`
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#111827] font-cal">Share this event type</h2>
          <button onClick={onClose} className="p-2 text-[#6B7280] hover:bg-[#F3F4F6] rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-[#E5E7EB] bg-[#F9FAFB]">
          <button 
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'link' ? 'border-[#111827] text-[#111827] bg-white' : 'border-transparent text-[#6B7280]'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Globe className="w-4 h-4" />
              Share a link
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('embed')}
            className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'embed' ? 'border-[#111827] text-[#111827] bg-white' : 'border-transparent text-[#6B7280]'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Code className="w-4 h-4" />
              Embed on your site
            </div>
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          {activeTab === 'link' ? (
            <div className="animate-in fade-in duration-300">
              <div className="mb-8">
                <label className="block text-sm font-bold text-[#374151] mb-2 uppercase tracking-wider">Public Link</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={eventUrl}
                    className="flex-1 px-4 py-3 bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl text-sm font-medium text-[#111827] outline-none"
                  />
                  <button 
                    onClick={() => handleCopy(eventUrl)}
                    className="px-6 py-3 bg-[#111827] text-white rounded-xl text-sm font-bold hover:bg-[#1F2937] transition-all flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-[#E5E7EB] rounded-xl hover:border-[#111827] transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                    <Smartphone className="w-5 h-5 text-[#6B7280] group-hover:text-[#111827]" />
                    <ArrowRight className="w-4 h-4 text-[#E5E7EB] group-hover:text-[#111827]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#111827]">Text personal link</h3>
                  <p className="text-xs text-[#6B7280]">Share via SMS or WhatsApp</p>
                </div>
                <div className="p-4 border border-[#E5E7EB] rounded-xl hover:border-[#111827] transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                    <Mail className="w-5 h-5 text-[#6B7280] group-hover:text-[#111827]" />
                    <ArrowRight className="w-4 h-4 text-[#E5E7EB] group-hover:text-[#111827]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#111827]">Email invitation</h3>
                  <p className="text-xs text-[#6B7280]">Send a calendar invite link</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              <div className="flex gap-4 mb-8">
                <button 
                  onClick={() => setEmbedType('inline')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all text-left ${
                    embedType === 'inline' ? 'border-[#111827] bg-[#F9FAFB]' : 'border-[#E5E7EB]'
                  }`}
                >
                  <Layout className="w-6 h-6 mb-3 text-[#111827]" />
                  <h3 className="text-sm font-bold text-[#111827]">Inline Embed</h3>
                  <p className="text-xs text-[#6B7280]">Embed directly on your page</p>
                </button>
                <button 
                  onClick={() => setEmbedType('popup')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all text-left ${
                    embedType === 'popup' ? 'border-[#111827] bg-[#F9FAFB]' : 'border-[#E5E7EB]'
                  }`}
                >
                  <Smartphone className="w-6 h-6 mb-3 text-[#111827]" />
                  <h3 className="text-sm font-bold text-[#111827]">Popup Widget</h3>
                  <p className="text-xs text-[#6B7280]">Floating button or click trigger</p>
                </button>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-[#374151] uppercase tracking-wider">Embed Code</label>
                  <button 
                    onClick={() => handleCopy(embedCodes[embedType])}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#6B7280] hover:text-[#111827] transition-colors"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    Copy code
                  </button>
                </div>
                <div className="bg-[#111827] rounded-xl p-4 overflow-hidden">
                  <pre className="text-[11px] text-[#9CA3AF] font-mono whitespace-pre-wrap leading-relaxed max-h-[150px] overflow-y-auto custom-scrollbar">
                    {embedCodes[embedType]}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-[#F9FAFB] border-t border-[#E5E7EB] flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-[#E5E7EB] text-[#374151] rounded-xl text-sm font-bold hover:bg-white/50 transition-all"
          >
            Close
          </button>
        </div>
      </motion.div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
      `}</style>
    </div>
  );
}

const ArrowRight = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
  </svg>
);
