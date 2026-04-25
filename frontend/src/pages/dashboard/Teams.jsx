import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Users, Plus, UserPlus, Shield, ExternalLink, MoreHorizontal, Settings, Loader2 } from 'lucide-react';
import api from '../../utils/api';

const TeamCard = ({ team }) => (
  <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl p-6 hover:border-[#3F3F46] transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl flex items-center justify-center text-white font-bold text-xl uppercase">
          {team.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-white truncate">{team.name}</h3>
          <p className="text-sm text-[#71717A] truncate">cal.com/team/{team.slug}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="p-2 text-[#71717A] hover:bg-[#2B2B2B] hover:text-white rounded-lg transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>

    <div className="flex items-center justify-between py-4 border-t border-[#2B2B2B]">
      <div className="flex -space-x-2">
        {team.members.slice(0, 4).map((member, i) => (
          <div key={i} className="w-8 h-8 rounded-full border-2 border-[#141414] bg-[#2B2B2B] flex items-center justify-center text-[10px] font-bold text-white uppercase" title={member.user.name}>
            {member.user.name.charAt(0)}
          </div>
        ))}
        {team.members.length > 4 && (
          <div className="w-8 h-8 rounded-full border-2 border-[#141414] bg-[#1A1A1A] flex items-center justify-center text-[10px] font-bold text-[#71717A]">
            +{team.members.length - 4}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-[#71717A] uppercase tracking-wider">{team.members.length} Members</span>
        <button className="p-2 bg-[#1A1A1A] border border-[#2B2B2B] text-white rounded-lg hover:bg-[#2B2B2B] transition-colors">
          <UserPlus className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Create state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await api.get('/teams');
      setTeams(res.data);
    } catch (err) {
      console.error('Failed to fetch teams', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/teams', {
        name,
        slug: slug || name.toLowerCase().replace(/ /g, '-'),
      });
      setIsModalOpen(false);
      setName('');
      setSlug('');
      fetchTeams();
    } catch (err) {
      alert('Failed to create team');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout 
      title="Teams" 
      subtitle="Collaborate with your team members and manage organization-level scheduling."
      actions={(
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 h-9 px-4 bg-white text-[#111827] rounded-lg text-[13px] font-semibold hover:bg-[#F4F4F5] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Team</span>
        </button>
      )}
    >
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#52525B]" />
        </div>
      ) : teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map(team => (
            <TeamCard key={team._id} team={team} />
          ))}

          <button 
            onClick={() => setIsModalOpen(true)}
            className="h-[180px] border-2 border-dashed border-[#2B2B2B] rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-[#3F3F46] hover:bg-[#141414]/50 transition-all group"
          >
            <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center text-[#52525B] group-hover:text-white transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-[#71717A] group-hover:text-white">Create a new team</span>
          </button>
        </div>
      ) : (
        <div className="bg-[#141414] border-2 border-dashed border-[#2B2B2B] rounded-2xl p-8 sm:p-16 text-center">
          <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-6 text-white">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-cal">Scale scheduling with Teams</h3>
          <p className="text-[#71717A] mb-8 max-w-sm mx-auto text-sm sm:text-base">Create a team to manage member schedules, collective bookings, and round-robin routing.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-white text-[#111827] rounded-lg font-bold hover:bg-[#F4F4F5] transition-all"
          >
            Create your first team
          </button>
        </div>
      )}

      {/* Create Team Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1A1A1A] border border-[#3F3F46] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-white font-cal mb-2">Create a team</h2>
              <p className="text-[#71717A] text-sm mb-6">Setup a new team for your organization.</p>
              
              <form onSubmit={handleCreate} className="space-y-5">
                <div>
                  <label className="block text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">Team Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Acme Engineering"
                    className="w-full px-3 py-2 bg-[#101010] border border-[#3F3F46] rounded-lg focus:border-[#71717A] outline-none transition-all text-[14px] text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider mb-2">URL Slug</label>
                  <div className="flex items-center bg-[#101010] border border-[#3F3F46] rounded-lg overflow-hidden focus-within:border-[#71717A] transition-all">
                    <span className="px-3 py-2 border-r border-[#3F3F46] text-[#52525B] text-sm font-medium whitespace-nowrap">cal.com/team/</span>
                    <input 
                      type="text" 
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="acme-eng"
                      className="flex-1 px-3 py-2 bg-transparent outline-none text-[14px] text-white"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-8">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 bg-transparent border border-[#3F3F46] text-[#A1A1AA] rounded-lg text-sm font-semibold hover:border-[#71717A] hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-white text-[#111827] rounded-lg text-sm font-semibold hover:bg-[#F4F4F5] transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating...' : 'Continue'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
);
}
