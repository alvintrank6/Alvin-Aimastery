import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { MockDB, Project } from '@/utils/db';

interface ClientAccount {
  name: string;
  email: string;
}

const CLIENT_ACCOUNTS: ClientAccount[] = [
  { name: 'Nguyen Van A (TechCorp)', email: 'vana@techcorp.vn' },
  { name: 'Le Thi B (An Nhien Spa)', email: 'lethib@spa.vn' },
];

export default function ClientPortal() {
  const { t } = useTranslation();
  const [selectedClient, setSelectedClient] = useState<ClientAccount | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSent, setSupportSent] = useState(false);

  useEffect(() => {
    if (selectedClient) {
      const allProjects = MockDB.getProjects();
      const clientProjs = allProjects.filter(
        (p) =>
          p.clientEmail.toLowerCase() === selectedClient.email.toLowerCase() ||
          p.clientName.toLowerCase() === selectedClient.name.split(' (')[0].toLowerCase()
      );
      setProjects(clientProjs);
    } else {
      setProjects([]);
    }
    setSupportSent(false);
    setSupportMessage('');
  }, [selectedClient]);

  const handleLogout = () => {
    setSelectedClient(null);
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;

    // Simulate sending a support ticket by adding a mock contact lead in DB
    MockDB.addLead({
      name: selectedClient?.name || 'Client Support',
      email: selectedClient?.email || 'support@client.com',
      phone: 'N/A',
      company: 'Client Portal Support Request',
      service: 'Support Ticket',
      message: `[SUPPORT TICKET] ${supportMessage}`,
    });

    setSupportSent(true);
    setSupportMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: '#F8F6F2' }}>
      <Navbar />

      <main className="pt-24 pb-16 flex-grow">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {!selectedClient ? (
            /* Login Simulation Card */
            <div className="max-w-md mx-auto my-10 bg-white rounded-3xl p-6 md:p-8 border border-[#2C3E50]/5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 gradient-bg" />
              <div className="text-center space-y-2 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#9B2A4C]/10 flex items-center justify-center text-[#9B2A4C] mx-auto text-xl">
                  <i className="ri-user-shared-line" />
                </div>
                <h1 className="text-2xl font-black text-[#1C2526]">{t('client.title')}</h1>
                <p className="text-xs text-[#5A6A72]">{t('client.subtitle')}</p>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-bold text-[#1C2526] uppercase">
                  {t('portals.loginAs')}
                </label>
                <div className="space-y-2">
                  {CLIENT_ACCOUNTS.map((client) => (
                    <button
                      key={client.email}
                      onClick={() => setSelectedClient(client)}
                      className="w-full text-left p-4 rounded-2xl border border-gray-200 hover:border-[#9B2A4C] hover:bg-[#9B2A4C]/5 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <p className="text-sm font-bold text-[#1C2526] group-hover:text-[#9B2A4C]">
                          {client.name}
                        </p>
                        <p className="text-xs text-[#8A97A0]">{client.email}</p>
                      </div>
                      <i className="ri-arrow-right-line text-[#8A97A0] group-hover:text-[#9B2A4C] transition-colors" />
                    </button>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-[#5A6A72] leading-relaxed">
                  <span className="font-bold text-[#1C2526]">Note:</span> This login is simulated. Choosing an account will load that specific client\'s contract, tracking metrics, and files from our mock database.
                </div>
              </div>
            </div>
          ) : (
            /* Dashboard View */
            <div className="space-y-8 animate-fadeIn">
              {/* Header card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-[#1C2526]">
                    {t('client.title')} &ndash; {selectedClient.name.split(' (')[0]}
                  </h1>
                  <p className="text-xs text-[#5A6A72]">{selectedClient.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="self-start sm:self-center flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-500 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <i className="ri-logout-box-r-line" />
                  {t('portals.logout')}
                </button>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Projects Column */}
                <div className="lg:col-span-2 space-y-6">
                  <h2 className="text-[#1C2526] font-bold text-lg flex items-center gap-2">
                    <i className="ri-folders-line text-[#9B2A4C]" />
                    {t('client.activeProjects')} ({projects.length})
                  </h2>

                  {projects.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                      <i className="ri-folder-open-line text-4xl text-gray-300 block mb-3" />
                      <p className="text-sm font-semibold text-gray-400">No active projects registered for this account.</p>
                      <p className="text-xs text-gray-400 mt-1">Submit a request on our service pages to start a new project.</p>
                    </div>
                  ) : (
                    projects.map((proj) => {
                      const stages = ['New', 'In Progress', 'Client Review', 'Completed'];
                      const currentStageIdx = stages.indexOf(proj.status);

                      return (
                        <div
                          key={proj.id}
                          className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-100">
                            <div>
                              <span className="text-xs font-semibold text-[#9B2A4C] uppercase tracking-wider">
                                {proj.service}
                              </span>
                              <h3 className="text-lg font-bold text-[#1C2526] mt-0.5">{proj.name}</h3>
                            </div>
                            <div className="text-right sm:text-right">
                              <p className="text-[10px] uppercase font-bold text-gray-400">
                                {t('client.deadline')}
                              </p>
                              <p className="text-xs font-bold text-[#1C2526]">{proj.deadline}</p>
                            </div>
                          </div>

                          {/* Progress Tracker bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-[#5A6A72]">{t('client.progress')}</span>
                              <span className="font-bold text-[#9B2A4C]">{proj.progress}%</span>
                            </div>
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full gradient-bg transition-all duration-500 rounded-full"
                                style={{ width: `${proj.progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Stage timeline dots */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold text-[#5A6A72] uppercase tracking-wider">
                              {t('client.status')}
                            </h4>
                            <div className="grid grid-cols-4 gap-2 text-center pt-2 relative">
                              {stages.map((stage, idx) => {
                                const active = idx <= currentStageIdx;
                                const isCurrent = idx === currentStageIdx;
                                return (
                                  <div key={stage} className="space-y-2 flex flex-col items-center">
                                    <div
                                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                                        isCurrent
                                          ? 'gradient-bg text-white border-transparent ring-4 ring-[#9B2A4C]/10'
                                          : active
                                          ? 'bg-[#9B2A4C]/15 border-[#9B2A4C] text-[#9B2A4C]'
                                          : 'bg-white border-gray-200 text-gray-400'
                                      }`}
                                    >
                                      {isCurrent ? (
                                        <i className="ri-focus-2-line animate-pulse" />
                                      ) : active ? (
                                        <i className="ri-check-line" />
                                      ) : (
                                        idx + 1
                                      )}
                                    </div>
                                    <p
                                      className={`text-[10px] font-bold tracking-tight ${
                                        isCurrent
                                          ? 'text-[#9B2A4C]'
                                          : active
                                          ? 'text-[#2C3E50]'
                                          : 'text-gray-400'
                                      }`}
                                    >
                                      {stage === 'New'
                                        ? 'Khởi Tạo'
                                        : stage === 'In Progress'
                                        ? 'Đang Làm'
                                        : stage === 'Client Review'
                                        ? 'Khách Duyệt'
                                        : 'Hoàn Thành'}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Deliverables Section */}
                          <div className="bg-[#F8F6F2]/70 rounded-2xl p-4 border border-gray-100 space-y-3">
                            <h4 className="text-xs font-bold text-[#1C2526] uppercase">
                              {t('client.deliverables')}
                            </h4>
                            {proj.deliverablesUrl ? (
                              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-2">
                                  <i className="ri-file-code-line text-lg text-[#9B2A4C]" />
                                  <span className="text-xs font-semibold text-gray-600 truncate max-w-xs md:max-w-sm">
                                    {proj.deliverablesUrl}
                                  </span>
                                </div>
                                <a
                                  href={proj.deliverablesUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-bold text-[#9B2A4C] hover:underline flex items-center gap-1 shrink-0"
                                >
                                  {t('client.viewDeliverable')}
                                  <i className="ri-external-link-line" />
                                </a>
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400 italic">
                                {t('client.noDeliverables')}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Support and FAQ sidebar */}
                <div className="space-y-6">
                  {/* Support ticketing card */}
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                    <h2 className="text-[#1C2526] font-bold text-lg flex items-center gap-2">
                      <i className="ri-customer-service-2-line text-[#9B2A4C]" />
                      {t('client.contactSupport')}
                    </h2>
                    <p className="text-xs text-[#5A6A72] leading-relaxed">
                      Need custom changes or support? Post your message below and Alvin will respond within 24 hours.
                    </p>

                    {supportSent ? (
                      <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 text-xs font-semibold text-center space-y-1">
                        <i className="ri-checkbox-circle-fill text-lg block" />
                        <p>Ticket successfully submitted!</p>
                        <button
                          onClick={() => setSupportSent(false)}
                          className="text-[#9B2A4C] hover:underline font-bold mt-1 block w-full"
                        >
                          Send another query
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSupportSubmit} className="space-y-3">
                        <textarea
                          rows={4}
                          required
                          value={supportMessage}
                          onChange={(e) => setSupportMessage(e.target.value)}
                          placeholder="Detail your request or support query here..."
                          className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C] transition-colors resize-none"
                        />
                        <button
                          type="submit"
                          className="w-full bg-[#2C3E50] text-white font-bold py-2.5 rounded-xl hover:bg-[#2C3E50]/90 transition-colors text-xs cursor-pointer"
                        >
                          Submit Ticket
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Portal Guidelines Card */}
                  <div className="bg-[#2C3E50] text-white rounded-3xl p-6 space-y-4">
                    <h3 className="font-bold text-sm">Professional Portal Guard</h3>
                    <p className="text-[11px] text-gray-300 leading-relaxed">
                      This Client Portal is engineered to provide absolute transparent visibility into work timelines. All project milestones are updated directly by the assignees.
                    </p>
                    <div className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1 animate-ping" />
                      <span className="text-[10px] text-gray-300">Sync is secured & active</span>
                    </div>
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
