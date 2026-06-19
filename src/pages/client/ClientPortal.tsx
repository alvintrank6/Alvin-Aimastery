import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { useToast } from '@/components/common/ToastContext';
import { Project } from '@/utils/db';
import { ProjectsAPI, LeadsAPI } from '@/utils/api';
import { io } from 'socket.io-client';

export default function ClientPortal() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Feedback form states
  const [feedbackSubject, setFeedbackSubject] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [sendingFeedback, setSendingFeedback] = useState<boolean>(false);

  const isVi = i18n.language === 'vi';

  const checkAuth = useCallback(() => {
    const isLoggedIn = sessionStorage.getItem('user_logged_in') === 'true';
    const role = sessionStorage.getItem('user_role');
    const email = sessionStorage.getItem('user_email');
    const name = sessionStorage.getItem('user_name');

    if (!isLoggedIn || role !== 'client') {
      navigate('/login');
      return false;
    }
    if (email) {
      setClientEmail(email);
      setClientName(name || 'Client');
      return true;
    }
    return false;
  }, [navigate]);

  const loadProjects = useCallback(async (email: string) => {
    try {
      setLoading(true);
      const allProjects = await ProjectsAPI.getAll() || [];
      // Filter projects belonging to this client
      const myProjs = allProjects.filter((p: any) => p.clientEmail?.toLowerCase() === email.toLowerCase());
      setProjects(myProjs);
    } catch (err) {
      console.error('Failed to load client projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const authorized = checkAuth();
    if (authorized && sessionStorage.getItem('user_email')) {
      const email = sessionStorage.getItem('user_email')!;
      loadProjects(email);
    }
  }, [checkAuth, loadProjects]);

  // WebSocket live updates sync
  useEffect(() => {
    const email = sessionStorage.getItem('user_email');
    if (!email) return;

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001');

    socket.on('projects-updated', () => {
      console.log('WS Event: Projects updated, syncing client view...');
      loadProjects(email);
    });

    return () => {
      socket.disconnect();
    };
  }, [loadProjects]);

  const handleLogout = () => {
    sessionStorage.removeItem('user_logged_in');
    sessionStorage.removeItem('user_role');
    sessionStorage.removeItem('user_email');
    sessionStorage.removeItem('user_name');
    sessionStorage.removeItem('user_id');
    navigate('/login');
  };

  const handleApproveProject = async (proj: Project) => {
    try {
      // Approve deliverables and mark status as Completed
      const updated = {
        ...proj,
        status: 'Completed' as const,
        progress: 100
      };
      await ProjectsAPI.update(proj.id, updated);
      showToast(
        isVi ? 'Đã duyệt nghiệm thu sản phẩm thành công!' : 'Project deliverables approved successfully!',
        'success'
      );
      if (clientEmail) {
        await loadProjects(clientEmail);
      }
    } catch (err) {
      showToast(isVi ? 'Nghiệm thu thất bại. Vui lòng thử lại.' : 'Approval failed. Please try again.', 'error');
    }
  };

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;

    setSendingFeedback(true);
    try {
      // Send client feedback by creating a Lead in the CRM as a query
      await LeadsAPI.create({
        name: clientName,
        email: clientEmail,
        phone: 'N/A',
        company: 'Client Portal Feedback',
        service: 'feedback',
        message: `[Phản hồi từ Client Portal - Chủ đề: ${feedbackSubject || 'Chung'}]\n${feedbackMessage}`
      });

      showToast(
        isVi ? 'Gửi yêu cầu phản hồi thành công! Admin sẽ liên hệ lại sớm.' : 'Feedback sent! Admin will contact you shortly.',
        'success'
      );
      setFeedbackSubject('');
      setFeedbackMessage('');
    } catch (err) {
      showToast(isVi ? 'Gửi thất bại. Vui lòng thử lại.' : 'Sending failed. Please try again.', 'error');
    } finally {
      setSendingFeedback(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: '#F8F6F2' }}>
      <Navbar />

      <main className="pt-24 pb-16 flex-grow">
        <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-8">
          
          {/* Header section */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#9B2A4C] to-[#2C3E50] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                {clientName[0]?.toUpperCase() || 'C'}
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#9B2A4C] uppercase tracking-wider">
                  {isVi ? 'Cổng Khách Hàng' : 'Client Portal'}
                </span>
                <h1 className="text-xl font-black text-[#1C2526] mt-0.5">
                  {isVi ? `Chào bạn, ${clientName}` : `Welcome, ${clientName}`}
                </h1>
                <p className="text-xs text-[#5A6A72]">{clientEmail}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 px-4 py-2 border border-red-200 text-red-500 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors cursor-pointer self-start sm:self-center"
            >
              <i className="ri-logout-box-r-line" />
              {isVi ? 'Đăng xuất' : 'Sign Out'}
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <i className="ri-loader-4-line animate-spin text-4xl text-[#9B2A4C]" />
              <p className="text-xs text-[#8A97A0] mt-2">
                {isVi ? 'Đang tải thông tin dự án...' : 'Loading project information...'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Projects List */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-[#1C2526] font-bold text-lg flex items-center gap-2">
                  <i className="ri-dashboard-3-line text-[#9B2A4C]" />
                  {isVi ? `Dự án của bạn (${projects.length})` : `Your Projects (${projects.length})`}
                </h2>

                {projects.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
                    <i className="ri-folder-open-line text-4xl text-gray-300 block" />
                    <p className="text-sm font-semibold text-gray-400">
                      {isVi ? 'Chưa có dự án nào đang chạy' : 'No active projects found'}
                    </p>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto">
                      {isVi
                        ? 'Khi bạn đăng ký dịch vụ và được Admin phê duyệt giao việc, dự án của bạn sẽ xuất hiện tại đây.'
                        : 'Once your service request is approved and assigned by Admin, your project will appear here.'}
                    </p>
                  </div>
                ) : (
                  projects.map((proj) => {
                    let subTasksList: any[] = [];
                    try {
                      subTasksList = JSON.parse(proj.subTasks || '[]');
                    } catch {
                      subTasksList = [];
                    }

                    return (
                      <div
                        key={proj.id}
                        className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 animate-fadeIn"
                      >
                        {/* Project Heading */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-gray-100">
                          <div>
                            <span className="text-[10px] font-extrabold text-[#9B2A4C] uppercase tracking-wider bg-[#9B2A4C]/5 px-2 py-0.5 rounded">
                              {proj.service.toUpperCase()}
                            </span>
                            <h3 className="text-md font-bold text-[#1C2526] mt-1.5">{proj.name}</h3>
                          </div>
                          <div>
                            <span
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                                proj.status === 'Completed'
                                  ? 'bg-green-50 text-green-600 border border-green-100'
                                  : proj.status === 'Client Review'
                                  ? 'bg-[#9B2A4C]/10 text-[#9B2A4C] border border-[#9B2A4C]/15'
                                  : 'bg-blue-50 text-blue-600 border border-blue-100'
                              }`}
                            >
                              {proj.status === 'New' && (isVi ? 'Mới khởi tạo' : 'New')}
                              {proj.status === 'In Progress' && (isVi ? 'Đang triển khai' : 'In Progress')}
                              {proj.status === 'Client Review' && (isVi ? 'Chờ bạn duyệt' : 'Client Review')}
                              {proj.status === 'Completed' && (isVi ? 'Đã hoàn thành' : 'Completed')}
                            </span>
                          </div>
                        </div>

                        {/* Brief Info */}
                        <div className="pl-4 border-l-2 border-gray-200 text-xs">
                          <h4 className="font-extrabold text-[#2C3E50] mb-1 uppercase tracking-wide text-[9px]">
                            {isVi ? 'YÊU CẦU DỰ ÁN' : 'PROJECT BRIEF'}
                          </h4>
                          <p className="text-[#5A6A72] leading-relaxed whitespace-pre-line">{proj.brief}</p>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                            <span>{isVi ? 'Tiến độ hoàn thành' : 'Overall Progress'}</span>
                            <span className="text-[#9B2A4C]">{proj.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${proj.progress}%`,
                                background: proj.progress === 100 ? '#10B981' : 'linear-gradient(90deg, #9B2A4C, #2C3E50)'
                              }}
                            />
                          </div>
                        </div>

                        {/* Sub-tasks Details */}
                        {subTasksList.length > 0 && (
                          <div className="pt-4 border-t border-gray-100 space-y-3">
                            <h4 className="text-xs font-bold text-[#1C2526] uppercase tracking-wider flex items-center gap-1.5">
                              <i className="ri-git-commit-line text-[#9B2A4C]" />
                              {isVi ? 'Chi tiết đầu việc & Tiến độ' : 'Milestones & Tasks Detail'}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
                              {subTasksList.map((st: any) => (
                                <div
                                  key={st.id}
                                  className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-[#F8F6F2]/30 text-xs gap-2"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <i
                                      className={`text-sm ${
                                        st.completed
                                          ? 'ri-checkbox-circle-fill text-green-500'
                                          : 'ri-checkbox-blank-circle-line text-gray-300'
                                      }`}
                                    />
                                    <span
                                      className={`truncate font-semibold ${
                                        st.completed ? 'line-through text-gray-400' : 'text-gray-700'
                                      }`}
                                    >
                                      {st.title}
                                    </span>
                                  </div>
                                  <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded shrink-0">
                                    {st.deadline}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Deliverables section & Approval buttons */}
                        <div className="pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="text-xs">
                            <span className="font-bold text-gray-400 uppercase tracking-wide">
                              {isVi ? 'Hạn chót bàn giao: ' : 'Target Deadline: '}
                            </span>
                            <span className="font-bold text-[#1C2526]">{proj.deadline}</span>
                          </div>

                          <div className="flex flex-wrap gap-2 justify-end">
                            {/* Product Link download */}
                            {proj.deliverablesUrl ? (
                              <a
                                href={proj.deliverablesUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-2 border border-[#9B2A4C]/20 text-[#9B2A4C] font-bold text-xs rounded-xl hover:bg-[#9B2A4C]/5 transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <i className="ri-external-link-line" />
                                {isVi ? 'Xem sản phẩm bàn giao' : 'Access Deliverables'}
                              </a>
                            ) : (
                              <span className="px-3 py-2 bg-gray-50 text-gray-400 font-bold text-[11px] rounded-xl border border-gray-100 flex items-center gap-1 select-none">
                                <i className="ri-time-line" />
                                {isVi ? 'Chưa có link sản phẩm' : 'No deliverables uploaded'}
                              </span>
                            )}

                            {/* Approve Button */}
                            {proj.status === 'Client Review' && (
                              <button
                                onClick={() => handleApproveProject(proj)}
                                className="px-4 py-2 gradient-bg text-white font-bold text-xs rounded-xl hover:opacity-95 shadow transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <i className="ri-checkbox-circle-line" />
                                {isVi ? 'Duyệt & Nghiệm thu' : 'Approve & Complete'}
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

              {/* Feedback Form Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                  <h2 className="text-[#1C2526] font-bold text-md flex items-center gap-2">
                    <i className="ri-mail-send-line text-[#9B2A4C] text-lg" />
                    {isVi ? 'Phản hồi & Hỗ trợ' : 'Feedback & Support'}
                  </h2>
                  <p className="text-xs text-[#5A6A72] leading-relaxed">
                    {isVi
                      ? 'Gửi yêu cầu chỉnh sửa, brief bổ sung hoặc các thắc mắc trực tiếp đến người quản lý của bạn.'
                      : 'Send revision requests, additional brief instructions, or queries directly to your account manager.'}
                  </p>

                  <div className="h-px bg-gray-100" />

                  <form onSubmit={handleSendFeedback} className="space-y-4 pt-2">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-[#1C2526] uppercase">
                        {isVi ? 'Chủ đề' : 'Subject'}
                      </label>
                      <input
                        type="text"
                        placeholder={isVi ? 'Ví dụ: Sửa lỗi giao diện, Câu hỏi thù lao...' : 'e.g. Design edits request, Timeline query...'}
                        value={feedbackSubject}
                        onChange={(e) => setFeedbackSubject(e.target.value)}
                        className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C] text-[#1C2526] placeholder-gray-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-[#1C2526] uppercase">
                        {isVi ? 'Nội dung tin nhắn *' : 'Message Content *'}
                      </label>
                      <textarea
                        required
                        rows={5}
                        placeholder={isVi ? 'Nhập chi tiết yêu cầu của bạn tại đây...' : 'Describe your request details here...'}
                        value={feedbackMessage}
                        onChange={(e) => setFeedbackMessage(e.target.value)}
                        className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C] text-[#1C2526] placeholder-gray-400 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={sendingFeedback || !feedbackMessage.trim()}
                      className="w-full py-3 rounded-xl gradient-bg text-white font-bold text-xs shadow hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {sendingFeedback ? (
                        <>
                          <i className="ri-loader-4-line animate-spin" />
                          {isVi ? 'Đang gửi...' : 'Sending...'}
                        </>
                      ) : (
                        <>
                          <i className="ri-send-plane-fill" />
                          {isVi ? 'Gửi phản hồi' : 'Send Message'}
                        </>
                      )}
                    </button>
                  </form>
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
