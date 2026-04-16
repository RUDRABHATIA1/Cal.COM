import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Users, Plus, UserPlus, Shield, ExternalLink, MoreHorizontal, Settings, Loader2 } from 'lucide-react';
import api from '../../utils/api';

const TeamCard = ({ team }) => (
  <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 hover:shadow-md transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl flex items-center justify-center text-[#111827] font-bold text-xl uppercase">
          {team.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-base font-bold text-[#111827]">{team.name}</h3>
          <p className="text-sm text-[#6B7280]">cal.com/team/{team.slug}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="p-2 text-[#6B7280] hover:bg-[#F3F4F6] rounded-lg transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>

    <div className="flex items-center justify-between py-4 border-t border-[#E5E7EB]">
      <div className="flex -space-x-2">
        {team.members.slice(0, 4).map((member, i) => (
          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-[#111827] flex items-center justify-center text-[10px] font-bold text-white uppercase" title={member.user.name}>
            {member.user.name.charAt(0)}
          </div>
        ))}
        {team.members.length > 4 && (
          <div className="w-8 h-8 rounded-full border-2 border-white bg-[#F3F4F6] flex items-center justify-center text-[10px] font-bold text-[#6B7280]">
            +{team.members.length - 4}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">{team.members.length} Members</span>
        <button className="p-2 bg-[#F3F4F6] text-[#374151] rounded-lg hover:bg-[#E5E7EB] transition-colors">
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
          className="flex items-center gap-2 px-4 py-2.5 bg-[#111827] text-white rounded-lg text-sm font-semibold hover:bg-[#1F2937] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Team</span>
        </button>
      )}
    >
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#111827]" />
        </div>
      ) : teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map(team => (
            <TeamCard key={team._id} team={team} />
          ))}

          <button 
            onClick={() => setIsModalOpen(true)}
            className="h-[210px] border-2 border-dashed border-[#E5E7EB] rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-[#D1D5DB] hover:bg-[#F9FAFB] transition-all group"
          >
            <div className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center text-[#9CA3AF] group-hover:text-[#111827] transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-[#6B7280] group-hover:text-[#111827]">Create a new team</span>
          </button>
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-[#E5E7EB] rounded-2xl p-16 text-center">
          <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-6 text-[#111827]">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[#111827] mb-2 font-cal">Scale scheduling with Teams</h3>
          <p className="text-[#6B7280] mb-8 max-w-sm mx-auto">Create a team to manage member schedules, collective bookings, and round-robin routing.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-[#111827] text-white rounded-lg font-bold hover:bg-[#1F2937] transition-all"
          >
            Create your first team
          </button>
        </div>
      )}

      {/* Create Team Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-[#111827] font-cal mb-2">Create a team</h2>
              <p className="text-[#6B7280] text-sm mb-6">Setup a new team for your organization.</p>
              
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#374151] mb-1.5">Team Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Acme Engineering"
                    className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#111827] outline-none transition-all text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#374151] mb-1.5">URL Slug</label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 bg-[#F3F4F6] border border-r-0 border-[#E5E7EB] rounded-l-lg text-[#6B7280] text-sm font-medium">cal.com/team/</span>
                    <input 
                      type="text" 
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="acme-eng"
                      className="flex-1 px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-r-lg focus:ring-2 focus:ring-[#111827] outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-8">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 bg-white border border-[#E5E7EB] text-[#374151] rounded-lg text-sm font-semibold hover:bg-[#F9FAFB] transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-[#111827] text-white rounded-lg text-sm font-semibold hover:bg-[#1F2937] transition-colors disabled:opacity-50"
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
