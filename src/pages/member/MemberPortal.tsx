import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { Project, Developer } from '@/utils/db';
import { api, DevelopersAPI, ProjectsAPI, PayoutsAPI, SettingsAPI } from '@/utils/api';
import { io } from 'socket.io-client';

export default function MemberPortal() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [taxRate, setTaxRate] = useState(10);

  // Form states for active editing project
  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  const [tempProgress, setTempProgress] = useState<number>(0);
  const [tempDeliverables, setTempDeliverables] = useState<string>('');
  const [isUnapproved, setIsUnapproved] = useState<boolean>(false);

  // Sub-task states
  const [activeSubTaskProjId, setActiveSubTaskProjId] = useState<string | null>(null);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  const [newSubTaskDesc, setNewSubTaskDesc] = useState('');
  const [newSubTaskDeadline, setNewSubTaskDeadline] = useState('');

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('user_logged_in') === 'true';
    const role = sessionStorage.getItem('user_role');
    const email = sessionStorage.getItem('user_email');

    if (!isLoggedIn || role !== 'developer') {
      navigate('/login');
      return;
    }

    if (email) {
      const fetchInit = async () => {
        const allList = await DevelopersAPI.getAll() || [];
        const list = allList.filter((f: any) => f.status === 'Approved');
        setDevelopers(list);
        setTaxRate(await SettingsAPI.get('taxRate') || 10);

        const matched = list.find((f: any) => f.email.toLowerCase() === email.toLowerCase());
        if (matched) {
          setSelectedDeveloper(matched);
          setIsUnapproved(false);
        } else {
          setIsUnapproved(true);
        }
      };
      fetchInit();
    }
  }, [navigate]);

  const loadProjects = useCallback(async () => {
    if (!selectedDeveloper) return;
    const allProjects = await ProjectsAPI.getAll() || [];
    const myProjs = allProjects.filter((p: any) => p.assigneeId === selectedDeveloper.id);
    setProjects(myProjs);
  }, [selectedDeveloper]);

  useEffect(() => {
    if (selectedDeveloper) {
      loadProjects();
    } else {
      setProjects([]);
    }
  }, [selectedDeveloper, loadProjects]);

  useEffect(() => {
    if (!selectedDeveloper) return;

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001');

    socket.on('projects-updated', () => {
      console.log('WS Event: Projects updated, refetching...');
      loadProjects();
    });

    socket.on('payouts-updated', () => {
      console.log('WS Event: Payouts updated, refetching...');
      loadProjects();
    });

    socket.on('settings-updated', async () => {
      console.log('WS Event: Settings updated, refetching...');
      setTaxRate(await SettingsAPI.get('taxRate') || 10);
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedDeveloper, loadProjects]);

  const handleLogout = () => {
    sessionStorage.removeItem('user_logged_in');
    sessionStorage.removeItem('user_role');
    sessionStorage.removeItem('user_email');
    sessionStorage.removeItem('user_name');
    sessionStorage.removeItem('user_id');
    setSelectedDeveloper(null);
    setEditingProjId(null);
    navigate('/login');
  };

  const handleStartEdit = (proj: Project) => {
    setEditingProjId(proj.id);
    setTempProgress(proj.progress);
    setTempDeliverables(proj.deliverablesUrl || '');
  };

  const handleSaveProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeveloper || !editingProjId) return;

    const allProjects = await ProjectsAPI.getAll() || [];
    const projIndex = allProjects.findIndex((p: any) => p.id === editingProjId);
    if (projIndex !== -1) {
      const proj = allProjects[projIndex];
      proj.deliverablesUrl = tempDeliverables;

      await ProjectsAPI.update(proj.id, proj);
      await loadProjects();
      setEditingProjId(null);
    }
  };

  const handleToggleSubTask = async (projId: string, subTaskId: string) => {
    const allProjects = await ProjectsAPI.getAll() || [];
    const proj = allProjects.find((p: any) => p.id === projId);
    if (!proj) return;

    let subTasksList: any[] = [];
    try {
      subTasksList = JSON.parse(proj.subTasks || '[]');
    } catch {
      subTasksList = [];
    }

    subTasksList = subTasksList.map((st: any) =>
      st.id === subTaskId ? { ...st, completed: !st.completed } : st
    );

    const completedCount = subTasksList.filter((st: any) => st.completed).length;
    const totalCount = subTasksList.length;
    const nextProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    proj.subTasks = JSON.stringify(subTasksList);
    proj.progress = nextProgress;

    if (nextProgress === 100 && proj.status !== 'Completed') {
      proj.status = 'Client Review';
    } else if (nextProgress < 100 && proj.status === 'Client Review') {
      proj.status = 'In Progress';
    }

    await ProjectsAPI.update(proj.id, proj);
    await loadProjects();
  };

  const handleAddSubTask = async (e: React.FormEvent, projId: string) => {
    e.preventDefault();
    if (!newSubTaskTitle.trim()) return;

    const allProjects = await ProjectsAPI.getAll() || [];
    const proj = allProjects.find((p: any) => p.id === projId);
    if (!proj) return;

    let subTasksList: any[] = [];
    try {
      subTasksList = JSON.parse(proj.subTasks || '[]');
    } catch {
      subTasksList = [];
    }

    const newSub: any = {
      id: `sub-${Date.now()}`,
      title: newSubTaskTitle,
      description: newSubTaskDesc,
      deadline: newSubTaskDeadline || proj.deadline,
      completed: false,
    };

    subTasksList.push(newSub);

    const completedCount = subTasksList.filter((st: any) => st.completed).length;
    const totalCount = subTasksList.length;
    const nextProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    proj.subTasks = JSON.stringify(subTasksList);
    proj.progress = nextProgress;

    if (nextProgress === 100 && proj.status !== 'Completed') {
      proj.status = 'Client Review';
    } else if (nextProgress < 100 && proj.status === 'Client Review') {
      proj.status = 'In Progress';
    }

    await ProjectsAPI.update(proj.id, proj);
    await loadProjects();

    // Reset form states
    setNewSubTaskTitle('');
    setNewSubTaskDesc('');
    setNewSubTaskDeadline('');
    setActiveSubTaskProjId(null);
  };

  const handleDeleteSubTask = async (projId: string, subTaskId: string) => {
    const allProjects = await ProjectsAPI.getAll() || [];
    const proj = allProjects.find((p: any) => p.id === projId);
    if (!proj) return;

    let subTasksList: any[] = [];
    try {
      subTasksList = JSON.parse(proj.subTasks || '[]');
    } catch {
      subTasksList = [];
    }

    subTasksList = subTasksList.filter((st: any) => st.id !== subTaskId);

    const completedCount = subTasksList.filter((st: any) => st.completed).length;
    const totalCount = subTasksList.length;
    const nextProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    proj.subTasks = JSON.stringify(subTasksList);
    proj.progress = nextProgress;

    if (nextProgress === 100 && proj.status !== 'Completed') {
      proj.status = 'Client Review';
    } else if (nextProgress < 100 && proj.status === 'Client Review') {
      proj.status = 'In Progress';
    }

    await ProjectsAPI.update(proj.id, proj);
    await loadProjects();
  };

  const handleRequestPayment = async (proj: Project) => {
    if (!selectedDeveloper) return;
    await PayoutsAPI.create({ projectId: proj.id, amount: proj.outsourceFee });
    await loadProjects();
  };

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: '#F8F6F2' }}>
      <Navbar />

      <main className="pt-24 pb-16 flex-grow">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {isUnapproved ? (
            <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-yellow-100 shadow-xl text-center space-y-6 animate-fadeIn mt-10">
              <div className="w-16 h-16 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <i className="ri-error-warning-fill text-3xl" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-black text-[#1C2526]">{t('portals.memberPortal')}</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {t('member.noDevelopersFound')}
                </p>
              </div>
              <div className="pt-2">
                <a
                  href="http://localhost:3000/developer/register"
                  className="inline-block w-full py-3 rounded-xl gradient-bg text-white font-bold text-xs shadow hover:opacity-95 transition-opacity"
                >
                  {t('portals.outsourceRegister')}
                </a>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-[#8A97A0] hover:text-[#2C3E50] font-bold cursor-pointer"
              >
                {t('portals.logout')}
              </button>
            </div>
          ) : !selectedDeveloper ? (
            <div className="flex flex-col items-center justify-center py-20">
              <i className="ri-loader-4-line animate-spin text-4xl text-[#9B2A4C]" />
              <p className="text-xs text-[#8A97A0] mt-2">Loading workspace...</p>
            </div>
          ) : (
            /* Dashboard View */
            <div className="space-y-8 animate-fadeIn">
              {/* Header card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm">
                    {selectedDeveloper.name[0]}
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-[#1C2526]">{selectedDeveloper.name}</h1>
                    <p className="text-xs text-[#5A6A72]">{selectedDeveloper.email}</p>
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
                      <p className="text-sm font-semibold text-gray-400">{t('member.noTasks')}</p>
                      <p className="text-xs text-gray-400 mt-1">{t('member.noTasksDesc')}</p>
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
                              {i18n.exists(`services.list.${proj.service}.title`) ? t(`services.list.${proj.service}.title` as any) : proj.service}
                            </span>
                            <h3 className="text-md font-bold text-[#1C2526] mt-0.5">{proj.name}</h3>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-[10px] uppercase font-bold text-gray-400">Client</p>
                            <p className="text-xs font-bold text-gray-600">{proj.clientName}</p>
                          </div>
                        </div>

                        {/* Brief */}
                        <div className="pl-4 border-l-2 border-gray-200 text-xs">
                          <h4 className="font-extrabold text-[#2C3E50] mb-1 uppercase tracking-wide text-[10px]">
                            {t('member.brief')}
                          </h4>
                          <p className="text-[#5A6A72] leading-relaxed whitespace-pre-line">{proj.brief}</p>
                        </div>

                        {/* Progress and Work URL */}
                        <div className="flex justify-between items-center text-xs pt-1">
                          <div>
                            <span className="font-bold text-gray-400 uppercase tracking-wide">{t('member.progressLabel')}: </span>
                            <span className="font-bold text-[#9B2A4C]">{proj.progress}%</span>
                          </div>
                          {proj.deliverablesUrl && (
                            <div className="truncate max-w-xs text-gray-400 font-medium">
                              {t('member.linkLabel')}: <span className="text-gray-600 underline">{proj.deliverablesUrl}</span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        {/* Sub-tasks Timeline & Checklist */}
                        <div className="pt-4 border-t border-gray-100 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-[#1C2526] uppercase tracking-wider flex items-center gap-1.5">
                              <i className="ri-git-commit-line text-[#9B2A4C]" />
                              {i18n.language === 'vi' ? 'Kế hoạch & Đầu việc phụ (Sub-tasks)' : 'Plan & Sub-tasks'}
                            </h4>
                            <button
                              onClick={() => {
                                if (activeSubTaskProjId === proj.id) {
                                  setActiveSubTaskProjId(null);
                                } else {
                                  setActiveSubTaskProjId(proj.id);
                                  setNewSubTaskTitle('');
                                  setNewSubTaskDesc('');
                                  setNewSubTaskDeadline(proj.deadline);
                                }
                              }}
                              className="text-[10px] font-bold text-[#9B2A4C] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <i className="ri-add-line" />
                              {activeSubTaskProjId === proj.id ? (i18n.language === 'vi' ? 'Hủy' : 'Cancel') : (i18n.language === 'vi' ? 'Thêm đầu việc' : 'Add Sub-task')}
                            </button>
                          </div>

                          {/* Sub-tasks List */}
                          {(() => {
                            let subTasksList: any[] = [];
                            try {
                              subTasksList = JSON.parse(proj.subTasks || '[]');
                            } catch {
                              subTasksList = [];
                            }

                            return (
                              <div className="space-y-2.5">
                                {subTasksList.length === 0 ? (
                                  <p className="text-xs text-gray-400 italic py-4 text-center">
                                    {i18n.language === 'vi' ? 'Chưa có kế hoạch chi tiết. Hãy thêm các đầu việc phụ để bắt đầu!' : 'No detailed plan yet. Please add sub-tasks to get started!'}
                                  </p>
                                ) : (
                                  subTasksList.map((st: any) => (
                                    <div
                                      key={st.id}
                                      className="flex items-start justify-between py-3 border-b border-gray-100 last:border-b-0 gap-3 transition-colors"
                                    >
                                      <div className="flex items-start gap-2.5 min-w-0">
                                        <button
                                          type="button"
                                          onClick={() => handleToggleSubTask(proj.id, st.id)}
                                          className={`mt-0.5 w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${st.completed
                                              ? 'bg-green-500 border-transparent text-white'
                                              : 'bg-white border-gray-300 hover:border-[#9B2A4C]'
                                            }`}
                                        >
                                          {st.completed && <i className="ri-check-line text-xs font-bold" />}
                                        </button>
                                        <div className="space-y-0.5">
                                          <p className={`text-xs font-bold text-[#2C3E50] leading-normal ${st.completed ? 'line-through text-gray-400' : ''}`}>
                                            {st.title}
                                          </p>
                                          {st.description && (
                                            <p className={`text-[10px] text-gray-500 leading-relaxed whitespace-pre-line ${st.completed ? 'line-through text-gray-400' : ''}`}>
                                              {st.description}
                                            </p>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                                          <i className="ri-calendar-line text-[10px]" />
                                          {st.deadline}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteSubTask(proj.id, st.id)}
                                          className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                                          title={i18n.language === 'vi' ? 'Xóa đầu việc' : 'Delete sub-task'}
                                        >
                                          <i className="ri-delete-bin-line text-xs" />
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            );
                          })()}

                          {/* Add Sub-task Form */}
                          {activeSubTaskProjId === proj.id && (
                            <form
                              onSubmit={(e) => handleAddSubTask(e, proj.id)}
                              className="pt-4 border-t border-dashed border-gray-200 space-y-3 animate-fadeIn"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-[#5A6A72] uppercase">
                                    {i18n.language === 'vi' ? 'Tên đầu việc *' : 'Sub-task title *'}
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={newSubTaskTitle}
                                    onChange={(e) => setNewSubTaskTitle(e.target.value)}
                                    placeholder={i18n.language === 'vi' ? 'Ví dụ: Thiết kế giao diện' : 'e.g. Design UI'}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-[#5A6A72] uppercase">
                                    {i18n.language === 'vi' ? 'Hạn chót *' : 'Deadline *'}
                                  </label>
                                  <input
                                    type="date"
                                    required
                                    value={newSubTaskDeadline}
                                    onChange={(e) => setNewSubTaskDeadline(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-[#5A6A72] uppercase">
                                  {i18n.language === 'vi' ? 'Chi tiết công việc / Mô tả' : 'Task description'}
                                </label>
                                <textarea
                                  rows={2}
                                  value={newSubTaskDesc}
                                  onChange={(e) => setNewSubTaskDesc(e.target.value)}
                                  placeholder={i18n.language === 'vi' ? 'Mô tả cụ thể nhiệm vụ cần thực hiện...' : 'Specific description of the task...'}
                                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#9B2A4C] resize-none"
                                />
                              </div>
                              <div className="flex gap-2 justify-end">
                                <button
                                  type="button"
                                  onClick={() => setActiveSubTaskProjId(null)}
                                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 font-semibold text-xs hover:bg-gray-50 transition-colors"
                                >
                                  {i18n.language === 'vi' ? 'Hủy' : 'Cancel'}
                                </button>
                                <button
                                  type="submit"
                                  className="px-3 py-1.5 rounded-lg gradient-bg text-white font-bold text-xs shadow hover:opacity-95 transition-opacity"
                                >
                                  {i18n.language === 'vi' ? 'Thêm đầu việc' : 'Add sub-task'}
                                </button>
                              </div>
                            </form>
                          )}
                        </div>

                        {editingProjId === proj.id ? (
                          <form onSubmit={handleSaveProgress} className="space-y-4 pt-4 border-t border-gray-100">
                            <h4 className="text-xs font-bold text-[#1C2526] uppercase">
                              {i18n.language === 'vi' ? 'Cập nhật liên kết sản phẩm bàn giao' : 'Update deliverables link'}
                            </h4>
                            <div className="space-y-3">
                              {/* Work deliverables url */}
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-[#5A6A72] uppercase">
                                  {t('member.uploadDeliverables')}
                                </label>
                                <input
                                  type="url"
                                  value={tempDeliverables}
                                  onChange={(e) => setTempDeliverables(e.target.value)}
                                  placeholder={t('member.deliverablesPlaceholder')}
                                  className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C] transition-colors"
                                />
                              </div>

                              <div className="flex gap-2 justify-end">
                                <button
                                  type="button"
                                  onClick={() => setEditingProjId(null)}
                                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 font-semibold text-xs hover:bg-gray-50 transition-colors"
                                >
                                  {t('common.cancel')}
                                </button>
                                <button
                                  type="submit"
                                  className="px-4 py-2 rounded-xl gradient-bg text-white font-bold text-xs shadow hover:opacity-95 transition-opacity"
                                >
                                  {i18n.language === 'vi' ? 'Lưu liên kết' : 'Save link'}
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
                              {i18n.language === 'vi' ? 'Cập nhật link sản phẩm' : 'Update product link'}
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
                      {t('member.financeDesc')}
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
                            <span className="text-[10px] uppercase font-bold text-gray-400">{t('common.status')}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${proj.payoutStatus === 'Paid'
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
                      <p className="text-xs text-gray-400 italic text-center py-4">{t('member.noFinance')}</p>
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
