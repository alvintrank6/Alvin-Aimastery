import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { MockDB, Project, Freelancer } from '@/utils/db';

export default function MemberPortal() {
  const { t } = useTranslation();
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [taxRate, setTaxRate] = useState(10);

  // Form states for active editing project
  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  const [tempProgress, setTempProgress] = useState<number>(0);
  const [tempDeliverables, setTempDeliverables] = useState<string>('');

  useEffect(() => {
    // Get list of approved freelancers for login simulator
    const list = MockDB.getFreelancers().filter((f) => f.status === 'Approved');
    setFreelancers(list);
    setTaxRate(MockDB.getTaxRate());
  }, []);

  useEffect(() => {
    if (selectedFreelancer) {
      loadProjects();
    } else {
      setProjects([]);
    }
  }, [selectedFreelancer]);

  const loadProjects = () => {
    if (!selectedFreelancer) return;
    const allProjects = MockDB.getProjects();
    const myProjs = allProjects.filter((p) => p.assigneeId === selectedFreelancer.id);
    setProjects(myProjs);
  };

  const handleLogout = () => {
    setSelectedFreelancer(null);
    setEditingProjId(null);
  };

  const handleStartEdit = (proj: Project) => {
    setEditingProjId(proj.id);
    setTempProgress(proj.progress);
    setTempDeliverables(proj.deliverablesUrl || '');
  };

  const handleSaveProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFreelancer || !editingProjId) return;

    const allProjects = MockDB.getProjects();
    const projIndex = allProjects.findIndex((p) => p.id === editingProjId);
    if (projIndex !== -1) {
      const proj = allProjects[projIndex];
      proj.progress = tempProgress;
      proj.deliverablesUrl = tempDeliverables;

      // Auto update status if progress is 100% and it is in progress
      if (tempProgress === 100 && proj.status !== 'Completed') {
        proj.status = 'Client Review';
      }

      MockDB.updateProject(proj);
      loadProjects();
      setEditingProjId(null);
    }
  };

  const handleRequestPayment = (proj: Project) => {
    if (!selectedFreelancer) return;
    MockDB.addPayoutRequest(proj.id, proj.outsourceFee);
    loadProjects();
  };

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: '#F8F6F2' }}>
      <Navbar />

      <main className="pt-24 pb-16 flex-grow">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {!selectedFreelancer ? (
            /* Login Simulation Card */
            <div className="max-w-md mx-auto my-10 bg-white rounded-3xl p-6 md:p-8 border border-[#2C3E50]/5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 gradient-bg" />
              <div className="text-center space-y-2 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#9B2A4C]/10 flex items-center justify-center text-[#9B2A4C] mx-auto text-xl">
                  <i className="ri-code-box-line" />
                </div>
                <h1 className="text-2xl font-black text-[#1C2526]">{t('member.title')}</h1>
                <p className="text-xs text-[#5A6A72]">{t('member.subtitle')}</p>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-bold text-[#1C2526] uppercase">
                  {t('portals.loginAs')}
                </label>
                <div className="space-y-2">
                  {freelancers.length === 0 ? (
                    <p className="text-xs text-red-500 italic text-center py-2">
                      No approved freelancer accounts found. Please register in the Outsource Portal first!
                    </p>
                  ) : (
                    freelancers.map((free) => (
                      <button
                        key={free.email}
                        onClick={() => setSelectedFreelancer(free)}
                        className="w-full text-left p-4 rounded-2xl border border-gray-200 hover:border-[#9B2A4C] hover:bg-[#9B2A4C]/5 transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <p className="text-sm font-bold text-[#1C2526] group-hover:text-[#9B2A4C]">
                            {free.name}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">
                            Skills: {free.skills.join(', ')}
                          </p>
                        </div>
                        <i className="ri-arrow-right-line text-[#8A97A0] group-hover:text-[#9B2A4C] transition-colors" />
                      </button>
                    ))
                  )}
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-[#5A6A72] leading-relaxed">
                  <span className="font-bold text-[#1C2526]">RBAC Policy Warning:</span> Logs are strictly filtered. Freelancers can only view their own projects and calculations, preventing unauthorized information access.
                </div>
              </div>
            </div>
          ) : (
            /* Dashboard View */
            <div className="space-y-8 animate-fadeIn">
              {/* Header card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm">
                    {selectedFreelancer.name[0]}
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-[#1C2526]">{selectedFreelancer.name}</h1>
                    <p className="text-xs text-[#5A6A72]">{selectedFreelancer.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-500 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <i className="ri-logout-box-r-line" />
                    {t('portals.logout')}
                  </button>
                </div>
              </div>

              {/* Tasks Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Task assignments */}
                <div className="lg:col-span-2 space-y-6">
                  <h2 className="text-[#1C2526] font-bold text-lg flex items-center gap-2">
                    <i className="ri-task-line text-[#9B2A4C]" />
                    {t('member.assignedTasks')} ({projects.length})
                  </h2>

                  {projects.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                      <i className="ri-inbox-line text-4xl text-gray-300 block mb-3" />
                      <p className="text-sm font-semibold text-gray-400">No active projects assigned to you.</p>
                      <p className="text-xs text-gray-400 mt-1">Please wait for the Admin to link you to a client campaign.</p>
                    </div>
                  ) : (
                    projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-gray-100">
                          <div>
                            <span className="text-xs font-bold text-[#9B2A4C] uppercase tracking-wider">
                              {proj.service}
                            </span>
                            <h3 className="text-md font-bold text-[#1C2526] mt-0.5">{proj.name}</h3>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-[10px] uppercase font-bold text-gray-400">Client</p>
                            <p className="text-xs font-bold text-gray-600">{proj.clientName}</p>
                          </div>
                        </div>

                        {/* Brief */}
                        <div className="bg-[#F8F6F2]/70 rounded-2xl p-4 border border-gray-100 text-xs">
                          <h4 className="font-bold text-[#2C3E50] mb-1.5 uppercase tracking-wide">
                            {t('member.brief')}
                          </h4>
                          <p className="text-[#5A6A72] leading-relaxed whitespace-pre-line">{proj.brief}</p>
                        </div>

                        {/* Progress and Work URL */}
                        <div className="flex justify-between items-center text-xs pt-1">
                          <div>
                            <span className="font-bold text-gray-400 uppercase tracking-wide">Progress: </span>
                            <span className="font-bold text-[#9B2A4C]">{proj.progress}%</span>
                          </div>
                          {proj.deliverablesUrl && (
                            <div className="truncate max-w-xs text-gray-400 font-medium">
                              Link: <span className="text-gray-600 underline">{proj.deliverablesUrl}</span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        {editingProjId === proj.id ? (
                          <form onSubmit={handleSaveProgress} className="space-y-4 pt-4 border-t border-gray-100">
                            <h4 className="text-xs font-bold text-[#1C2526] uppercase">
                              {t('member.updateProgress')}
                            </h4>
                            <div className="space-y-3">
                              {/* Slider */}
                              <div className="flex items-center gap-4">
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={tempProgress}
                                  onChange={(e) => setTempProgress(parseInt(e.target.value))}
                                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#9B2A4C]"
                                />
                                <span className="text-sm font-bold text-[#9B2A4C] w-10 text-right">
                                  {tempProgress}%
                                </span>
                              </div>

                              {/* Work deliverables url */}
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-[#5A6A72] uppercase">
                                  {t('member.uploadDeliverables')}
                                </label>
                                <input
                                  type="url"
                                  value={tempDeliverables}
                                  onChange={(e) => setTempDeliverables(e.target.value)}
                                  placeholder="https://github.com/... or staging deployment URL"
                                  className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C] transition-colors"
                                />
                              </div>

                              <div className="flex gap-2 justify-end">
                                <button
                                  type="button"
                                  onClick={() => setEditingProjId(null)}
                                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 font-semibold text-xs hover:bg-gray-50 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="px-4 py-2 rounded-xl gradient-bg text-white font-bold text-xs shadow hover:opacity-95 transition-opacity"
                                >
                                  {t('member.saveProgress')}
                                </button>
                              </div>
                            </div>
                          </form>
                        ) : (
                          <div className="flex gap-2 justify-end pt-2">
                            <button
                              onClick={() => handleStartEdit(proj)}
                              className="px-4 py-2 border border-[#2C3E50]/20 text-[#2C3E50] font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              Update Progress & Files
                            </button>

                            {/* Payout actions */}
                            {proj.payoutStatus === 'None' && proj.status === 'Completed' ? (
                              <button
                                onClick={() => handleRequestPayment(proj)}
                                className="px-4 py-2 gradient-bg text-white font-bold text-xs rounded-xl hover:opacity-95 shadow transition-colors cursor-pointer"
                              >
                                {t('member.requestPayment')}
                              </button>
                            ) : proj.payoutStatus === 'Requested' ? (
                              <span className="px-4 py-2 bg-yellow-50 text-yellow-600 font-bold text-xs rounded-xl border border-yellow-100 flex items-center gap-1">
                                <i className="ri-time-line" />
                                {t('member.paymentRequested')}
                              </span>
                            ) : proj.payoutStatus === 'Approved' ? (
                              <span className="px-4 py-2 bg-blue-50 text-blue-600 font-bold text-xs rounded-xl border border-blue-100 flex items-center gap-1">
                                <i className="ri-check-line" />
                                {t('member.statusApproved')}
                              </span>
                            ) : proj.payoutStatus === 'Paid' ? (
                              <span className="px-4 py-2 bg-green-50 text-green-600 font-bold text-xs rounded-xl border border-green-100 flex items-center gap-1">
                                <i className="ri-checkbox-circle-line" />
                                {t('member.statusPaid')}
                              </span>
                            ) : null}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Personal Finance sidebar */}
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
                    <h2 className="text-[#1C2526] font-bold text-lg flex items-center gap-2">
                      <i className="ri-money-dollar-box-line text-[#9B2A4C]" />
                      {t('member.personalFinance')}
                    </h2>
                    <p className="text-xs text-[#5A6A72]">
                      Thù lao payments automatically deduct tax and are pending review in the Admin billing queue.
                    </p>

                    <div className="h-px bg-gray-100" />

                    {/* Totals calculations */}
                    {projects.map((proj) => {
                      const taxDeducted = Math.round((proj.outsourceFee * taxRate) / 100);
                      const netPayout = proj.outsourceFee - taxDeducted;

                      return (
                        <div key={proj.id} className="p-4 rounded-2xl bg-[#F8F6F2]/50 border border-gray-200 space-y-3">
                          <h4 className="text-xs font-bold text-[#1C2526] truncate">{proj.name}</h4>
                          <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-500">{t('member.grossRevenue')}</span>
                              <span className="font-semibold text-gray-700">${proj.contractValue}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">{t('member.outsourceFee')}</span>
                              <span className="font-bold text-[#2C3E50]">${proj.outsourceFee}</span>
                            </div>
                            <div className="flex justify-between text-red-500">
                              <span>
                                {t('member.businessTax')} ({taxRate}%)
                              </span>
                              <span>-${taxDeducted}</span>
                            </div>
                            <div className="h-px bg-gray-200 my-1" />
                            <div className="flex justify-between font-bold text-[#9B2A4C]">
                              <span>{t('member.netPayout')}</span>
                              <span>${netPayout}</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-1">
                            <span className="text-[10px] uppercase font-bold text-gray-400">Status</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                proj.payoutStatus === 'Paid'
                                  ? 'bg-green-50 text-green-600'
                                  : proj.payoutStatus === 'Approved'
                                  ? 'bg-blue-50 text-blue-600'
                                  : proj.payoutStatus === 'Requested'
                                  ? 'bg-yellow-50 text-yellow-600'
                                  : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {proj.payoutStatus === 'Paid'
                                ? t('member.statusPaid')
                                : proj.payoutStatus === 'Approved'
                                ? t('member.statusApproved')
                                : proj.payoutStatus === 'Requested'
                                ? t('member.statusRequested')
                                : t('member.statusNone')}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {projects.length === 0 && (
                      <p className="text-xs text-gray-400 italic text-center py-4">No finance statements available.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
