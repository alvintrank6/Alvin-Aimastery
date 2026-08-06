import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/common/ToastContext';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  User, Lead, Project, PayoutRequest,
  TrafficMetric, CampaignAlert, FinanceLog
} from '@/utils/db';
import { api, LeadsAPI, UsersAPI, ProjectsAPI, PayoutsAPI, AnalyticsAPI, SettingsAPI } from '@/utils/api';
import CustomSelect from '@/components/common/Select';
import { io } from 'socket.io-client';

import { PromptItem } from '@/pages/prompts/promptData';
import { SampleProduct } from '@/pages/projects/page';

export interface SalesPayout {
  id: string;
  saleName: string;
  saleEmail: string;
  salePhone: string;
  projectName: string;
  contractValue: number;
  commissionRate: number;
  amount: number;
  bankInfo: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Paid' | 'Rejected';
  note?: string;
}

const COLORS = ['#1C2526', '#9B2A4C', '#A8B5A0', '#D97706', '#2563EB'];

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('admin_logged_in') === 'true';
  });
  const [role, setRole] = useState<'admin' | 'manager'>(() => {
    return (sessionStorage.getItem('admin_role') as 'admin' | 'manager') || 'admin';
  });

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // DB States
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [trafficData, setTrafficData] = useState<TrafficMetric[]>([]);
  const [trafficFilter, setTrafficFilter] = useState<'day' | 'week' | 'month'>('day');
  const [alerts, setAlerts] = useState<CampaignAlert[]>([]);
  const [financeData, setFinanceData] = useState<FinanceLog[]>([]);

  // Settings
  const [taxRate, setTaxRate] = useState(10);
  const [twoFA, setTwoFA] = useState(false);
  const [showTwoFAModal, setShowTwoFAModal] = useState(false);

  // CRM Lead modal states
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'All' | 'admin' | 'manager' | 'client'>('All');
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadCompany, setNewLeadCompany] = useState('');
  const [newLeadService, setNewLeadService] = useState('web');
  const [newLeadMessage, setNewLeadMessage] = useState('');

  // Form & Tab states
  const [activeTab, setActiveTab] = useState<'executive' | 'marketing' | 'sales' | 'finance' | 'projects_management' | 'crm' | 'ai_automation' | 'sales_personal' | 'payouts' | 'post_prompt' | 'post_project' | 'contact_leads' | 'accounts' | 'security'>('executive');
  const [activeProjectSubTab, setActiveProjectSubTab] = useState<'progress' | 'assign'>('progress');
  const [activeKanbanStatus, setActiveKanbanStatus] = useState<'New' | 'In Progress' | 'Client Review' | 'Completed'>('New');

  // 1. Sales Payouts state
  const [salesPayouts, setSalesPayouts] = useState<SalesPayout[]>(() => {
    try {
      const saved = localStorage.getItem('sales_payouts');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const [showAddSalesModal, setShowAddSalesModal] = useState(false);
  const [saleNameInput, setSaleNameInput] = useState('');
  const [saleEmailInput, setSaleEmailInput] = useState('');
  const [salePhoneInput, setSalePhoneInput] = useState('');
  const [saleProjectInput, setSaleProjectInput] = useState('');
  const [saleContractValueInput, setSaleContractValueInput] = useState<number>(10000000);
  const [saleCommissionRateInput, setSaleCommissionRateInput] = useState<number>(10);
  const [saleBankInfoInput, setSaleBankInfoInput] = useState('');
  const [saleNoteInput, setSaleNoteInput] = useState('');

  // 2. Post Prompt State
  const [customPrompts, setCustomPrompts] = useState<PromptItem[]>(() => {
    try {
      const saved = localStorage.getItem('custom_prompts');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const [showAddPromptModal, setShowAddPromptModal] = useState(false);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [promptTitleInput, setPromptTitleInput] = useState('');
  const [promptCategoryInput, setPromptCategoryInput] = useState<'Marketing & Sales' | 'Content & Social' | 'AI Automation' | 'SEO & Copywriting' | 'Consulting & Code'>('Marketing & Sales');
  const [promptModelInput, setPromptModelInput] = useState<'ChatGPT 4o' | 'Claude 3.5 Sonnet' | 'DeepSeek R1' | 'Midjourney v7'>('ChatGPT 4o');
  const [promptSummaryInput, setPromptSummaryInput] = useState('');
  const [promptSystemPromptInput, setPromptSystemPromptInput] = useState('');
  const [promptUserPromptInput, setPromptUserPromptInput] = useState('');
  const [promptUsageGuideInput, setPromptUsageGuideInput] = useState('');
  const [promptExampleOutputInput, setPromptExampleOutputInput] = useState('');
  const [promptImageUrlInput, setPromptImageUrlInput] = useState('');
  const [promptVariablesInput, setPromptVariablesInput] = useState<{ name: string; label: string; placeholder: string }[]>([
    { name: 'product', label: 'Tên sản phẩm / dịch vụ', placeholder: 'vd: Khóa học AI Marketing' }
  ]);

  // 3. Post Project State
  const [customProjects, setCustomProjects] = useState<SampleProduct[]>(() => {
    try {
      const saved = localStorage.getItem('custom_projects');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projTitleInput, setProjTitleInput] = useState('');
  const [projCatIdInput, setProjCatIdInput] = useState('my-pham');
  const [projCatNameInput, setProjCatNameInput] = useState('Mỹ phẩm & Skincare');
  const [projBadgeInput, setProjBadgeInput] = useState<'Website' | 'E-Commerce' | 'Web App' | 'Landing Page'>('Website');
  const [projPriceInput, setProjPriceInput] = useState('3.500.000');
  const [projPriceLabelInput, setProjPriceLabelInput] = useState('Giá từ');
  const [projDescInput, setProjDescInput] = useState('');
  const [projTagsInput, setProjTagsInput] = useState('React, Next.js, TailwindCSS');
  const [projDemoTimeInput, setProjDemoTimeInput] = useState('Có sẵn');
  const [projDeliveryInput, setProjDeliveryInput] = useState('24h - 48h');
  const [projImgInput, setProjImgInput] = useState('');
  const [projDemoUrlInput, setProjDemoUrlInput] = useState('https://alvin-aimastery.com');

  // 4. Contact Leads view state
  const [contactStatusFilter, setContactStatusFilter] = useState<'All' | 'New' | 'Contacted' | 'Qualified' | 'Closed'>('All');
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [selectedContactLead, setSelectedContactLead] = useState<Lead | null>(null);

  // Real-time notifications states
  const [showNotifications, setShowNotifications] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('admin_read_notifications') || '[]');
    } catch {
      return [];
    }
  });

  const markNotificationRead = (id: string) => {
    setReadNotificationIds(prev => {
      const next = prev.includes(id) ? prev : [...prev, id];
      localStorage.setItem('admin_read_notifications', JSON.stringify(next));
      return next;
    });
  };

  const markAllNotificationsRead = (ids: string[]) => {
    setReadNotificationIds(prev => {
      const next = Array.from(new Set([...prev, ...ids]));
      localStorage.setItem('admin_read_notifications', JSON.stringify(next));
      return next;
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (i18n.language === 'vi') {
      if (diffMins < 1) return 'Vừa xong';
      if (diffMins < 60) return `${diffMins} phút trước`;
      if (diffHours < 24) return `${diffHours} giờ trước`;
      return `${diffDays} ngày trước`;
    } else {
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    }
  };

  const handleAddLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await LeadsAPI.create({
        name: newLeadName,
        email: newLeadEmail,
        phone: newLeadPhone,
        company: newLeadCompany,
        service: newLeadService,
        message: newLeadMessage,
      });

      setNewLeadName('');
      setNewLeadEmail('');
      setNewLeadPhone('');
      setNewLeadCompany('');
      setNewLeadMessage('');
      setShowAddLeadModal(false);

      showToast(
        i18n.language === 'vi' ? 'Thêm khách hàng thủ công thành công!' : 'Customer successfully added manually!',
        'success'
      );
      await loadData();
    } catch (err) {
      showToast(i18n.language === 'vi' ? 'Lỗi khi thêm khách hàng.' : 'Error adding customer.', 'error');
    }
  };

  const handleCsvImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lines.length < 2) {
          showToast(i18n.language === 'vi' ? 'File CSV trống hoặc không đúng định dạng.' : 'CSV file is empty or invalid.', 'error');
          return;
        }

        const headers = lines[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim().toLowerCase());
        const importedLeads = [];

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          let current = '';
          let inQuotes = false;
          const row = [];

          for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              row.push(current.trim().replace(/^["']|["']$/g, ''));
              current = '';
            } else {
              current += char;
            }
          }
          row.push(current.trim().replace(/^["']|["']$/g, ''));

          const lead: any = {};
          headers.forEach((header, idx) => {
            const val = row[idx];
            if (header === 'name') lead.name = val;
            else if (header === 'email') lead.email = val;
            else if (header === 'phone') lead.phone = val;
            else if (header === 'company') lead.company = val;
            else if (header === 'service') lead.service = val;
            else if (header === 'message') lead.message = val;
          });

          if (lead.name) {
            importedLeads.push(lead);
          }
        }

        if (importedLeads.length > 0) {
          await LeadsAPI.importBulk(importedLeads);
          showToast(
            i18n.language === 'vi' ? `Đã import thành công ${importedLeads.length} leads!` : `Successfully imported ${importedLeads.length} leads!`,
            'success'
          );
          await loadData();
        } else {
          showToast(i18n.language === 'vi' ? 'Không tìm thấy dòng lead hợp lệ.' : 'No valid leads found.', 'warning');
        }
      } catch (err) {
        showToast(i18n.language === 'vi' ? 'Lỗi khi parse file CSV.' : 'Error parsing CSV file.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Lead assignment states
  const [assigningLead, setAssigningLead] = useState<Lead | null>(null);
  const [assigneeStaffId, setAssigneeStaffId] = useState('Unassigned');
  const [assignContractValue, setAssignContractValue] = useState<number>(1500);
  const [assignOutsourceFee, setAssignOutsourceFee] = useState<number>(600);
  const [assignDeadline, setAssignDeadline] = useState('2026-07-01');

  const handleAssignLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningLead) return;

    await ProjectsAPI.create({
      name: `${assigningLead.company || 'Client'} - ${t(`services.list.${assigningLead.service}.title`, assigningLead.service)}`,
      clientName: assigningLead.name,
      clientEmail: assigningLead.email,
      service: assigningLead.service,
      status: 'New',
      assigneeId: 'Unassigned',
      assigneeName: 'None',
      deadline: assignDeadline,
      brief: assigningLead.message,
      contractValue: role === 'manager' ? 0 : assignContractValue,
      outsourceFee: 0,
      taxRate,
      subTasks: JSON.stringify([])
    });

    await LeadsAPI.update(assigningLead.id, { status: 'Qualified' });

    setAssigningLead(null);
    setAssignContractValue(1500);
    showToast(
      i18n.language === 'vi' ? 'Đã tạo Dự án mới thành công!' : 'Project created successfully!',
      'success'
    );
    await loadData();
  };

  // Kanban task assignment
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [taskName, setTaskName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [taskService, setTaskService] = useState('web');
  const [assigneeId, setAssigneeId] = useState('Unassigned');
  const [contractValue, setContractValue] = useState<number>(1500);
  const [outsourceFee, setOutsourceFee] = useState<number>(600);
  const [deadline, setDeadline] = useState('2026-07-01');
  const [taskBrief, setTaskBrief] = useState('');
  const [prefillLeadId, setPrefillLeadId] = useState('none');


  // Unified login check
  useEffect(() => {
    // Admin page always enforces clean light theme
    document.documentElement.classList.remove('dark');
  }, []);

  useEffect(() => {
    const isUserLoggedIn = sessionStorage.getItem('user_logged_in') === 'true';
    const userRole = sessionStorage.getItem('user_role');

    if (!isUserLoggedIn || (userRole !== 'admin' && userRole !== 'manager')) {
      navigate('/login');
      return;
    }

    setIsLoggedIn(true);
    setRole(userRole as 'admin' | 'manager');
  }, [navigate]);

  const handleLogoutAdmin = () => {
    sessionStorage.removeItem('user_logged_in');
    sessionStorage.removeItem('user_role');
    sessionStorage.removeItem('user_email');
    sessionStorage.removeItem('user_name');
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('admin_logged_in');
    sessionStorage.removeItem('admin_role');
    setIsLoggedIn(false);
    navigate('/login');
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const fetchTraffic = async () => {
      try {
        setTrafficData(await AnalyticsAPI.getTraffic(trafficFilter));
      } catch (err) {
        console.error(err);
      }
    };
    fetchTraffic();
  }, [trafficFilter]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001');

    socket.on('leads-updated', async () => {
      const updatedLeads = await LeadsAPI.getAll();
      setLeads(prevLeads => {
        if (prevLeads.length > 0) {
          const newLeads = updatedLeads.filter(ul => !prevLeads.some(pl => pl.id === ul.id));
          newLeads.forEach(latestLead => {
            showToast(
              i18n.language === 'vi'
                ? `Khách hàng mới: ${latestLead.name} đã đăng ký dịch vụ ${t(`services.list.${latestLead.service}.title`, latestLead.service)}!`
                : `New Client: ${latestLead.name} registered for ${t(`services.list.${latestLead.service}.title`, latestLead.service)}!`,
              'success'
            );
          });
        }
        return updatedLeads;
      });
    });
    socket.on('projects-updated', async () => {
      setProjects(await ProjectsAPI.getAll());
    });
    socket.on('payouts-updated', async () => {
      setPayouts(await PayoutsAPI.getAll());
    });
    socket.on('traffic-updated', async () => {
      setTrafficData(await AnalyticsAPI.getTraffic(trafficFilter));
    });
    socket.on('alerts-updated', async () => {
      setAlerts(await AnalyticsAPI.getAlerts());
    });
    socket.on('settings-updated', async () => {
      setTaxRate(await SettingsAPI.get('taxRate') || 10);
      setTwoFA(await SettingsAPI.get('twoFA') || false);
    });

    return () => {
      socket.disconnect();
    };
  }, [trafficFilter]);

  const loadData = async () => {
    // 1. Leads
    let localLeads: Lead[] = [];
    try {
      localLeads = JSON.parse(localStorage.getItem('aimastery_leads') || '[]');
    } catch {}
    let apiLeads: Lead[] = [];
    try {
      apiLeads = await LeadsAPI.getAll();
    } catch (e) {
      console.warn('LeadsAPI fallback to local data');
    }
    const combinedLeads = [...localLeads, ...apiLeads.filter(al => !localLeads.some(ll => ll.id === al.id))];
    setLeads(combinedLeads);

    // 2. Users
    try {
      const userRes = await UsersAPI.getAll();
      if (Array.isArray(userRes)) setUsers(userRes);
    } catch (e) {}

    // 3. Projects
    try {
      const projRes = await ProjectsAPI.getAll();
      if (Array.isArray(projRes)) setProjects(projRes);
    } catch (e) {}

    // 4. Payouts
    try {
      const payRes = await PayoutsAPI.getAll();
      if (Array.isArray(payRes)) setPayouts(payRes);
    } catch (e) {}

    // 5. Traffic & Analytics
    try {
      const trafRes = await AnalyticsAPI.getTraffic(trafficFilter);
      if (Array.isArray(trafRes)) setTrafficData(trafRes);
    } catch (e) {}

    try {
      const alertRes = await AnalyticsAPI.getAlerts();
      if (Array.isArray(alertRes)) setAlerts(alertRes);
    } catch (e) {}

    try {
      const finRes = await AnalyticsAPI.getFinance();
      if (Array.isArray(finRes)) setFinanceData(finRes);
    } catch (e) {}

    try {
      setTaxRate(await SettingsAPI.get('taxRate') || 10);
      setTwoFA(await SettingsAPI.get('twoFA') || false);
    } catch (e) {}
  };

  // Resolve campaign alert
  const handleResolveAlert = async (id: string) => {
    await AnalyticsAPI.updateAlert(id, { status: 'resolved' });
    await loadData();
  };

  // Change user role
  const handleRoleChange = async (userId: string, newRole: 'admin' | 'manager' | 'client') => {
    try {
      const userObj = users.find(u => u.id === userId);
      if (!userObj) return;

      await UsersAPI.update(userId, { role: newRole });

      showToast(
        i18n.language === 'vi' ? 'Cập nhật vai trò tài khoản thành công!' : 'Account role successfully updated!',
        'success'
      );
      await loadData();
    } catch (err) {
      showToast(
        i18n.language === 'vi' ? 'Cập nhật vai trò thất bại.' : 'Failed to update account role.',
        'error'
      );
    }
  };

  // --- Sales Payout Handlers ---
  const saveSalesPayoutsToStorage = (updated: SalesPayout[]) => {
    setSalesPayouts(updated);
    localStorage.setItem('sales_payouts', JSON.stringify(updated));
  };

  const handleAddSalesPayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedAmount = Math.round(saleContractValueInput * (saleCommissionRateInput / 100));
    const newPayout: SalesPayout = {
      id: `sale-payout-${Date.now()}`,
      saleName: saleNameInput,
      saleEmail: saleEmailInput,
      salePhone: salePhoneInput,
      projectName: saleProjectInput,
      contractValue: saleContractValueInput,
      commissionRate: saleCommissionRateInput,
      amount: calculatedAmount,
      bankInfo: saleBankInfoInput,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      note: saleNoteInput,
    };
    const updated = [newPayout, ...salesPayouts];
    saveSalesPayoutsToStorage(updated);
    setShowAddSalesModal(false);
    setSaleNameInput('');
    setSaleEmailInput('');
    setSalePhoneInput('');
    setSaleProjectInput('');
    setSaleBankInfoInput('');
    setSaleNoteInput('');
    showToast(i18n.language === 'vi' ? 'Đã tạo yêu cầu thanh toán hoa hồng cho Sale!' : 'Sales payout request created!', 'success');
  };

  const handleUpdateSalesPayoutStatus = (id: string, status: 'Approved' | 'Paid' | 'Rejected') => {
    const updated = salesPayouts.map(p => p.id === id ? { ...p, status } : p);
    saveSalesPayoutsToStorage(updated);
    showToast(i18n.language === 'vi' ? 'Đã cập nhật trạng thái thanh toán Sale!' : 'Sales payout status updated!', 'success');
  };

  const handleDeleteSalesPayout = (id: string) => {
    const updated = salesPayouts.filter(p => p.id !== id);
    saveSalesPayoutsToStorage(updated);
    showToast(i18n.language === 'vi' ? 'Đã xóa yêu cầu thanh toán Sale.' : 'Sales payout deleted.', 'info');
  };

  const handleExportSalesPayoutsCsv = () => {
    const headers = ['Sale Name', 'Email', 'Phone', 'Project Name', 'Contract Value', 'Commission Rate (%)', 'Amount', 'Bank Info', 'Date', 'Status'];
    const rows = salesPayouts.map(p => [
      `"${p.saleName}"`,
      `"${p.saleEmail}"`,
      `"${p.salePhone}"`,
      `"${p.projectName}"`,
      p.contractValue,
      `${p.commissionRate}%`,
      p.amount,
      `"${p.bankInfo.replace(/"/g, '""')}"`,
      p.date,
      p.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sales_Payouts_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Post Prompt Handlers ---
  const saveCustomPromptsToStorage = (updated: PromptItem[]) => {
    setCustomPrompts(updated);
    localStorage.setItem('custom_prompts', JSON.stringify(updated));
  };

  const handlePromptImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPromptImageUrlInput(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let badgeColor = 'bg-rose-500';
    if (promptModelInput.includes('Claude')) badgeColor = 'bg-purple-600';
    if (promptModelInput.includes('DeepSeek')) badgeColor = 'bg-blue-600';
    if (promptModelInput.includes('Midjourney')) badgeColor = 'bg-amber-600';

    if (editingPromptId) {
      const updated = customPrompts.map(p => p.id === editingPromptId ? {
        ...p,
        title: promptTitleInput,
        category: promptCategoryInput,
        model: promptModelInput,
        badgeColor,
        summary: promptSummaryInput,
        systemPrompt: promptSystemPromptInput,
        userPrompt: promptUserPromptInput,
        usageGuide: promptUsageGuideInput,
        exampleOutput: promptExampleOutputInput,
        imageUrl: promptImageUrlInput || undefined,
        variables: promptVariablesInput,
      } : p);
      saveCustomPromptsToStorage(updated);
      showToast(i18n.language === 'vi' ? 'Đã cập nhật bài đăng Prompt!' : 'Prompt post updated!', 'success');
    } else {
      const newPrompt: PromptItem = {
        id: `prompt-${Date.now()}`,
        title: promptTitleInput,
        category: promptCategoryInput,
        model: promptModelInput,
        badgeColor,
        summary: promptSummaryInput,
        systemPrompt: promptSystemPromptInput,
        userPrompt: promptUserPromptInput,
        usageGuide: promptUsageGuideInput,
        exampleOutput: promptExampleOutputInput,
        imageUrl: promptImageUrlInput || undefined,
        variables: promptVariablesInput,
      };
      const updated = [newPrompt, ...customPrompts];
      saveCustomPromptsToStorage(updated);
      showToast(i18n.language === 'vi' ? 'Đã đăng bài Prompt mới thành công!' : 'New prompt post created!', 'success');
    }

    setShowAddPromptModal(false);
    resetPromptForm();
  };

  const resetPromptForm = () => {
    setEditingPromptId(null);
    setPromptTitleInput('');
    setPromptSummaryInput('');
    setPromptSystemPromptInput('');
    setPromptUserPromptInput('');
    setPromptUsageGuideInput('');
    setPromptExampleOutputInput('');
    setPromptImageUrlInput('');
    setPromptVariablesInput([{ name: 'product', label: 'Tên sản phẩm / dịch vụ', placeholder: 'vd: Khóa học AI Marketing' }]);
  };

  const handleEditPrompt = (prompt: PromptItem) => {
    setEditingPromptId(prompt.id);
    setPromptTitleInput(prompt.title);
    setPromptCategoryInput(prompt.category);
    setPromptModelInput(prompt.model);
    setPromptSummaryInput(prompt.summary);
    setPromptSystemPromptInput(prompt.systemPrompt);
    setPromptUserPromptInput(prompt.userPrompt);
    setPromptUsageGuideInput(prompt.usageGuide);
    setPromptExampleOutputInput(prompt.exampleOutput);
    setPromptImageUrlInput(prompt.imageUrl || '');
    setPromptVariablesInput(prompt.variables || []);
    setShowAddPromptModal(true);
  };

  const handleDeletePrompt = (id: string) => {
    const updated = customPrompts.filter(p => p.id !== id);
    saveCustomPromptsToStorage(updated);
    showToast(i18n.language === 'vi' ? 'Đã xóa bài Prompt!' : 'Prompt post deleted!', 'info');
  };

  // --- Post Project Handlers ---
  const saveCustomProjectsToStorage = (updated: SampleProduct[]) => {
    setCustomProjects(updated);
    localStorage.setItem('custom_projects', JSON.stringify(updated));
  };

  const handleProjectImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjImgInput(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = projTagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const imageToUse = projImgInput || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80';

    if (editingProjectId) {
      const updated = customProjects.map(p => p.id === editingProjectId ? {
        ...p,
        title: projTitleInput,
        catId: projCatIdInput,
        catName: projCatNameInput,
        badge: projBadgeInput,
        price: projPriceInput,
        priceLabel: projPriceLabelInput,
        desc: projDescInput,
        tags: tagsArray,
        demoTime: projDemoTimeInput,
        delivery: projDeliveryInput,
        img: imageToUse,
        demoUrl: projDemoUrlInput,
      } : p);
      saveCustomProjectsToStorage(updated);
      showToast(i18n.language === 'vi' ? 'Đã cập nhật dự án showcase!' : 'Project showcase updated!', 'success');
    } else {
      const newProj: SampleProduct = {
        id: `proj-${Date.now()}`,
        title: projTitleInput,
        catId: projCatIdInput,
        catName: projCatNameInput,
        badge: projBadgeInput,
        price: projPriceInput,
        priceLabel: projPriceLabelInput,
        desc: projDescInput,
        tags: tagsArray,
        demoTime: projDemoTimeInput,
        delivery: projDeliveryInput,
        img: imageToUse,
        demoUrl: projDemoUrlInput,
      };
      const updated = [newProj, ...customProjects];
      saveCustomProjectsToStorage(updated);
      showToast(i18n.language === 'vi' ? 'Đã đăng dự án mẫu mới thành công!' : 'New showcase project posted!', 'success');
    }

    setShowAddProjectModal(false);
    resetProjectForm();
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjTitleInput('');
    setProjDescInput('');
    setProjPriceInput('3.500.000');
    setProjPriceLabelInput('Giá từ');
    setProjTagsInput('React, Next.js, TailwindCSS');
    setProjDemoTimeInput('Có sẵn');
    setProjDeliveryInput('24h - 48h');
    setProjImgInput('');
    setProjDemoUrlInput('https://alvin-aimastery.com');
  };

  const handleEditProject = (proj: SampleProduct) => {
    setEditingProjectId(proj.id);
    setProjTitleInput(proj.title);
    setProjCatIdInput(proj.catId);
    setProjCatNameInput(proj.catName);
    setProjBadgeInput(proj.badge);
    setProjPriceInput(proj.price);
    setProjPriceLabelInput(proj.priceLabel || 'Giá từ');
    setProjDescInput(proj.desc);
    setProjTagsInput(proj.tags.join(', '));
    setProjDemoTimeInput(proj.demoTime);
    setProjDeliveryInput(proj.delivery);
    setProjImgInput(proj.img);
    setProjDemoUrlInput(proj.demoUrl);
    setShowAddProjectModal(true);
  };

  const handleDeleteProject = (id: string) => {
    const updated = customProjects.filter(p => p.id !== id);
    saveCustomProjectsToStorage(updated);
    showToast(i18n.language === 'vi' ? 'Đã xóa bài dự án mẫu!' : 'Project post deleted!', 'info');
  };

  // --- Contact Leads Handlers ---
  const handleUpdateContactLeadStatus = async (id: string, newStatus: 'New' | 'Contacted' | 'Qualified' | 'Closed') => {
    try {
      await LeadsAPI.update(id, { status: newStatus });
      showToast(i18n.language === 'vi' ? 'Đã cập nhật trạng thái liên hệ!' : 'Contact lead status updated!', 'success');
      await loadData();
    } catch {
      showToast(i18n.language === 'vi' ? 'Không thể cập nhật trạng thái liên hệ.' : 'Failed to update status.', 'error');
    }
  };



  // Add Kanban Project
  // Select lead to prefill task fields
  const handleSelectLeadForTask = (leadId: string) => {
    if (leadId === 'none') return;
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    setTaskName(`${lead.company || 'Khách lẻ'} - ${t(`services.list.${lead.service}.title`, lead.service)}`);
    setClientName(lead.name);
    setClientEmail(lead.email);
    setTaskService(lead.service);
    setTaskBrief(lead.message);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();

    await ProjectsAPI.create({
      name: taskName,
      clientName,
      clientEmail,
      service: taskService,
      status: 'New',
      assigneeId: 'Unassigned',
      assigneeName: 'None',
      deadline,
      brief: taskBrief,
      contractValue: role === 'manager' ? 0 : contractValue,
      outsourceFee: 0,
      taxRate
    });

    if (prefillLeadId && prefillLeadId !== 'none') {
      try {
        await LeadsAPI.update(prefillLeadId, { status: 'Qualified' });
      } catch (err) {
        console.error('Failed to update lead status:', err);
      }
    }

    await loadData();
    // Redirect to Kanban Board
    setActiveTab('projects_management');
    setActiveProjectSubTab('progress');
    setActiveKanbanStatus('New');
    // Reset Form
    setTaskName('');
    setClientName('');
    setClientEmail('');
    setTaskBrief('');
    setPrefillLeadId('none');
  };

  // Move Kanban card
  const handleMoveCard = async (id: string, currentStatus: Project['status'], direction: 'left' | 'right') => {
    const stages: Project['status'][] = ['New', 'In Progress', 'Client Review', 'Completed'];
    const currentIdx = stages.indexOf(currentStatus);
    let newIdx = currentIdx;

    if (direction === 'left' && currentIdx > 0) newIdx = currentIdx - 1;
    if (direction === 'right' && currentIdx < 3) newIdx = currentIdx + 1;

    if (newIdx !== currentIdx) {
      await ProjectsAPI.update(id, { status: stages[newIdx] });
      await loadData();
    }
  };

  // Payout actions
  const handleApprovePayout = async (id: string) => {
    if (role === 'manager') {
      showToast(t('admin.deniedPayout'), 'error');
      return;
    }
    await PayoutsAPI.update(id, { status: 'Approved' });
    await loadData();
  };

  const handleMarkPaid = async (id: string) => {
    if (role === 'manager') {
      showToast(t('admin.deniedPayout'), 'error');
      return;
    }
    await PayoutsAPI.update(id, { status: 'Paid' });
    await loadData();
  };

  // Export Payout CSV
  const handleExportPayoutsCsv = () => {
    const pending = payouts.filter(p => p.status === 'Approved');
    if (pending.length === 0) {
      showToast(t('admin.noApprovedPayouts'), 'warning');
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,ID,Assignee,Amount,Tax Deducted,Net Payout,Date\n";
    pending.forEach(p => {
      csvContent += `${p.id},${p.developerName || 'Assignee'},${p.amount},${p.taxDeducted},${p.netAmount},${p.date}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Alvin_Agency_BankPayouts_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Finance Ledger to Excel (CSV)
  const handleExportFinanceExcel = () => {
    if (financeData.length === 0) {
      showToast(i18n.language === 'vi' ? 'Không có dữ liệu tài chính để xuất!' : 'No financial data to export!', 'warning');
      return;
    }

    let csvContent = "\ufeffMonth,Revenue ($),Outsource Cost ($),Operating Cost ($),Gross Profit ($)\n";
    financeData.forEach(log => {
      const gross = log.revenue - log.outsourceCost - log.otherCost;
      csvContent += `${log.month},${log.revenue.toFixed(2)},${log.outsourceCost.toFixed(2)},${log.otherCost.toFixed(2)},${gross.toFixed(2)}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Alvin_Agency_Financial_Report_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Config adjustments
  const handleTaxChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (role === 'manager') {
      showToast(t('admin.deniedTax'), 'error');
      return;
    }
    const val = parseInt(e.target.value) || 0;
    setTaxRate(val);
    await SettingsAPI.update('taxRate', { value: String(val) });
  };

  const handleToggle2FA = async () => {
    if (!twoFA) {
      setShowTwoFAModal(true);
    } else {
      setTwoFA(false);
      await SettingsAPI.update('twoFA', { value: 'false' });
    }
  };

  const confirm2FA = async () => {
    setTwoFA(true);
    await SettingsAPI.update('twoFA', { value: 'true' });
    setShowTwoFAModal(false);
  };

  // Calc general totals
  const totalLeads = leads.length;

  // Derived notifications
  const derivedNotifications = React.useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      desc: string;
      time: Date;
      type: 'lead';
      targetTab: 'crm' | 'payouts';
      item: any;
    }> = [];

    leads.forEach(l => {
      list.push({
        id: `lead-${l.id}`,
        title: i18n.language === 'vi' ? 'Đăng ký dịch vụ mới' : 'New Service Sign-up',
        desc: i18n.language === 'vi'
          ? `${l.name} đã đăng ký dịch vụ ${t(`services.list.${l.service}.title`, l.service)}`
          : `${l.name} signed up for ${t(`services.list.${l.service}.title`, l.service)}`,
        time: new Date(l.createdAt || l.date),
        type: 'lead',
        targetTab: 'crm',
        item: l
      });
    });

    // Sort by time descending
    return list.sort((a, b) => b.time.getTime() - a.time.getTime());
  }, [leads, i18n.language, t]);

  const unreadNotifications = derivedNotifications.filter(n => !readNotificationIds.includes(n.id));
  const unreadCount = unreadNotifications.length;
  const totalRevenue = projects.reduce((acc, p) => acc + p.contractValue, 0);
  const totalOutsource = projects.reduce((acc, p) => acc + p.outsourceFee, 0);
  const netEarnings = totalRevenue - totalOutsource;
  const activeProjectsCount = projects.filter(p => p.status !== 'Completed').length;
  const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalOutsource) / totalRevenue) * 100 : 0;

  // Pie chart format
  const safeTrafficData = Array.isArray(trafficData) ? trafficData : [];
  const sourceTotals = safeTrafficData.reduce((acc, curr) => {
    acc.organic += curr.organic || 0;
    acc.facebook += curr.facebook || 0;
    acc.tiktok += curr.tiktok || 0;
    acc.youtube += curr.youtube || 0;
    acc.direct += curr.direct || 0;
    return acc;
  }, { organic: 0, facebook: 0, tiktok: 0, youtube: 0, direct: 0 });

  const pieChartData = [
    { name: 'Organic Search', value: sourceTotals.organic },
    { name: 'Facebook Ads', value: sourceTotals.facebook },
    { name: 'TikTok Social', value: sourceTotals.tiktok },
    { name: 'YouTube Content', value: sourceTotals.youtube },
    { name: 'Browser', value: sourceTotals.direct }
  ];

  // Executive Dashboard dynamic calculations
  const realTotalRevenue = projects.reduce((acc, p) => acc + (p.contractValue || 0), 0);
  const realTotalOutsourceCost = projects.reduce((acc, p) => acc + (p.outsourceFee || 0), 0);
  const realGrossProfit = Math.max(0, realTotalRevenue - realTotalOutsourceCost);
  const realGrossProfitMargin = realTotalRevenue > 0 ? ((realGrossProfit / realTotalRevenue) * 100).toFixed(1) : '0.0';

  const realActiveProjects = projects.filter(p => p.status !== 'Completed');
  const realOnboardingCount = projects.filter(p => p.status === 'New').length;
  const realInProgressCount = projects.filter(p => p.status === 'In Progress').length;
  const realCompletedCount = projects.filter(p => p.status === 'Completed').length;

  const realTotalLeads = leads.length;
  const realWonLeads = leads.filter(l => l.status === 'Qualified' || l.status === 'Closed').length;
  const realWinRate = realTotalLeads > 0 ? ((realWonLeads / realTotalLeads) * 100).toFixed(1) : '0.0';

  const executiveLineData = (financeData && financeData.length > 0)
    ? financeData.map(f => ({
        month: f.month,
        revenue: Math.round((f.revenue || 0) / 1000000),
        expense: Math.round(((f.outsourceCost || 0) + (f.otherCost || 0)) / 1000000)
      }))
    : [];

  const serviceCategoryMap: Record<string, number> = {};
  projects.forEach(p => {
    const cat = p.service ? t(`services.list.${p.service}.title`, p.service) : 'Dịch vụ';
    serviceCategoryMap[cat] = (serviceCategoryMap[cat] || 0) + (p.contractValue || 0);
  });
  const totalCatVal = Object.values(serviceCategoryMap).reduce((a, b) => a + b, 0);
  const executiveDonutData = Object.keys(serviceCategoryMap).map((catName, idx) => ({
    name: catName,
    value: totalCatVal > 0 ? Math.round((serviceCategoryMap[catName] / totalCatVal) * 100) : 0,
    color: COLORS[idx % COLORS.length]
  }));

  const totalSalesCommission = salesPayouts.reduce((a, s) => a + (s.amount || 0), 0);
  const executiveBarData = [
    { category: 'Outsource (Dev)', cost: Math.round(realTotalOutsourceCost / 1000000) },
    { category: 'Sales (Hoa hồng)', cost: Math.round(totalSalesCommission / 1000000) },
    { category: 'Vận hành (Ops)', cost: Math.round((realTotalRevenue * 0.1) / 1000000) },
  ];

  const agentSalesMap: Record<string, number> = {};
  salesPayouts.forEach(s => {
    agentSalesMap[s.saleName] = (agentSalesMap[s.saleName] || 0) + (s.contractValue || 0);
  });
  const topAgentsList = Object.keys(agentSalesMap).map(saleName => ({
    name: saleName,
    target: `${(agentSalesMap[saleName] * 1.2).toLocaleString('vi-VN')}đ`,
    achieved: `${agentSalesMap[saleName].toLocaleString('vi-VN')}đ`,
    winRate: `${realWinRate}%`
  }));


  // AI & Automation dynamic calculations
  const realVisitors = trafficData.reduce((a, c) => a + (c.visitors || 0), 0);
  const realWorkflowsActive = projects.length > 0 ? projects.length * 2 : 0;
  const realChatbotConversations = realVisitors;
  const realWorkflowExecutions = realVisitors > 0 ? realVisitors * 4 : 0;
  const realTimeSaved = Math.round(realWorkflowExecutions * 0.02);
  const realCostSaved = realTimeSaved * 120000;
  const realAiLeads = leads.filter(l => l.service === 'ai_automation' || l.service === 'bot' || l.service === 'web').length;
  const aiChartData = trafficData.map(t => ({
    day: t.date,
    chatbot: t.visitors || 0,
    n8n: (t.visitors || 0) * 4,
    timeSavedHours: Math.round((t.visitors || 0) * 0.02)
  }));

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: '#F8F6F2' }}>
      <main className="py-6 md:py-8 flex-grow max-w-7xl mx-auto px-4 md:px-6 w-full">
        {!isLoggedIn ? (
          <div className="flex flex-col items-center justify-center py-20 w-full">
            <i className="ri-loader-4-line animate-spin text-4xl text-[#9B2A4C]" />
            <p className="text-xs text-[#8A97A0] mt-2">Loading workspace...</p>
          </div>
        ) : (
          <>
            {/* Header Control Panel */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-[#1C2526]">{t('admin.title')}</h1>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${role === 'admin' ? 'bg-[#9B2A4C]/10 text-[#9B2A4C]' : 'bg-[#1C2526]/10 text-[#1C2526]'}`}>
                    {role === 'admin' ? t('portals.roleAdmin') : t('portals.roleManager')}
                  </span>
                </div>
                <p className="text-xs text-[#5A6A72] mt-0.5">{t('admin.subtitle')}</p>
              </div>

              {/* Role switcher & RBAC simulation selector */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Real-time Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-500 hover:text-gray-800 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-center"
                    title={i18n.language === 'vi' ? 'Thông báo' : 'Notifications'}
                  >
                    <i className="ri-notification-3-line text-lg" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#9B2A4C] text-white text-[8px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                      <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-4 space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                          <span className="text-xs font-bold text-[#1C2526]">
                            {i18n.language === 'vi' ? 'Thông báo gần đây' : 'Recent Notifications'}
                          </span>
                          {unreadCount > 0 && (
                            <button
                              onClick={() => markAllNotificationsRead(derivedNotifications.map(n => n.id))}
                              className="text-[10px] text-[#9B2A4C] hover:underline font-bold cursor-pointer"
                            >
                              {i18n.language === 'vi' ? 'Đã xem tất cả' : 'Mark all read'}
                            </button>
                          )}
                        </div>

                        <div className="max-h-60 overflow-y-auto space-y-2 pr-1 scrollbar-thin divide-y divide-gray-50">
                          {derivedNotifications.length === 0 ? (
                            <p className="text-[10px] text-gray-400 italic text-center py-4">
                              {i18n.language === 'vi' ? 'Không có thông báo nào' : 'No notifications yet'}
                            </p>
                          ) : (
                            derivedNotifications.map((notification) => {
                              const isRead = readNotificationIds.includes(notification.id);
                              return (
                                <div
                                  key={notification.id}
                                  onClick={() => {
                                    markNotificationRead(notification.id);
                                    setActiveTab(notification.targetTab);
                                    setShowNotifications(false);
                                  }}
                                  className={`pt-2 first:pt-0 pb-2 flex items-start gap-2.5 cursor-pointer hover:bg-gray-50/50 p-1.5 rounded-xl transition-colors ${!isRead ? 'bg-[#9B2A4C]/5' : ''
                                    }`}
                                >
                                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-sm ${notification.type === 'lead'
                                      ? 'bg-green-50 text-green-600'
                                      : 'bg-indigo-50 text-indigo-600'
                                    }`}>
                                    <i className={notification.type === 'lead' ? 'ri-customer-service-line' : 'ri-user-add-line'} />
                                  </div>
                                  <div className="space-y-0.5 min-w-0 flex-grow">
                                    <p className="text-[10px] font-bold text-[#1C2526] truncate flex items-center gap-1.5">
                                      {notification.title}
                                      {!isRead && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#9B2A4C]" />
                                      )}
                                    </p>
                                    <p className="text-[9px] text-[#5A6A72] leading-normal line-clamp-2">
                                      {notification.desc}
                                    </p>
                                    <p className="text-[8px] text-gray-400 font-medium">
                                      {formatTimeAgo(notification.time)}
                                    </p>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <Link
                  to="/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#9B2A4C] hover:bg-[#852340] text-white text-[10px] font-bold rounded-xl cursor-pointer transition-all shadow-sm"
                  title="Mở giao diện Trang Chủ người dùng"
                >
                  <i className="ri-external-link-line text-xs" />
                  {i18n.language === 'vi' ? 'Xem Trang Chủ' : 'Public Website'}
                </Link>

                <button
                  onClick={handleLogoutAdmin}
                  className="flex items-center gap-1 px-3 py-1.5 border border-red-200 hover:bg-red-50 text-red-500 text-[10px] font-bold rounded-xl cursor-pointer transition-colors"
                >
                  <i className="ri-logout-box-r-line" />
                  {t('admin.logoutBtn')}
                </button>
              </div>
            </div>

            {/* Dashboard Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#9B2A4C]/10 flex items-center justify-center text-[#9B2A4C] text-xl">
                  <i className="ri-briefcase-line" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                    {i18n.language === 'vi' ? 'Dự án hoạt động' : 'Active Projects'}
                  </p>
                  <p className="text-2xl font-black text-[#1C2526]">{activeProjectsCount}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-500 text-xl">
                  <i className="ri-bank-card-line" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                    {i18n.language === 'vi' ? 'Tổng Doanh Thu' : 'Total Revenue'}
                  </p>
                  <p className="text-2xl font-black text-[#1C2526]">{role === 'manager' ? '$***' : `$${totalRevenue}`}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 text-xl">
                  <i className="ri-refund-2-line" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                    {i18n.language === 'vi' ? 'Chi phí Outsource' : 'Outsource Costs'}
                  </p>
                  <p className="text-2xl font-black text-[#1C2526]">{role === 'manager' ? '$***' : `$${totalOutsource}`}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 text-xl">
                  <i className="ri-pie-chart-line" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                    {i18n.language === 'vi' ? 'Biên Lợi Nhuận' : 'Profit Margin'}
                  </p>
                  <p className="text-2xl font-black text-[#1C2526]">{role === 'manager' ? '***%' : `${profitMargin.toFixed(1)}%`}</p>
                </div>
              </div>
            </div>

            {/* Dashboard Tabs & Navigation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Sidebar Tabs */}
              <div className="lg:col-span-3 bg-white rounded-3xl p-4 border border-gray-100 shadow-sm space-y-1">
                <button
                  onClick={() => setActiveTab('executive')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-3 cursor-pointer border-l-4 ${activeTab === 'executive' ? 'border-[#9B2A4C] text-[#9B2A4C] bg-[#9B2A4C]/5' : 'border-transparent text-[#5A6A72] hover:bg-gray-50/50'
                    }`}
                >
                  <i className="ri-dashboard-3-line text-base" />
                  {i18n.language === 'vi' ? 'Executive Dashboard' : 'Executive Overview'}
                </button>
                <button
                  onClick={() => setActiveTab('marketing')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-3 cursor-pointer border-l-4 ${activeTab === 'marketing' ? 'border-[#9B2A4C] text-[#9B2A4C] bg-[#9B2A4C]/5' : 'border-transparent text-[#5A6A72] hover:bg-gray-50/50'
                    }`}
                >
                  <i className="ri-line-chart-line text-base" />
                  {t('admin.trafficAnalytics')}
                </button>
                <button
                  onClick={() => setActiveTab('sales')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-3 cursor-pointer border-l-4 ${activeTab === 'sales' ? 'border-[#9B2A4C] text-[#9B2A4C] bg-[#9B2A4C]/5' : 'border-transparent text-[#5A6A72] hover:bg-gray-50/50'
                    }`}
                >
                  <i className="ri-funds-box-line text-base" />
                  {i18n.language === 'vi' ? 'Dashboard Sales' : 'Sales Analytics'}
                </button>
                <button
                  onClick={() => setActiveTab('finance')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-3 cursor-pointer border-l-4 ${activeTab === 'finance' ? 'border-[#9B2A4C] text-[#9B2A4C] bg-[#9B2A4C]/5' : 'border-transparent text-[#5A6A72] hover:bg-gray-50/50'
                    }`}
                >
                  <i className="ri-file-excel-2-line text-base" />
                  {t('admin.financeReporting')}
                </button>
                <button
                  onClick={() => setActiveTab('projects_management')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-3 cursor-pointer border-l-4 ${activeTab === 'projects_management' ? 'border-[#9B2A4C] text-[#9B2A4C] bg-[#9B2A4C]/5' : 'border-transparent text-[#5A6A72] hover:bg-gray-50/50'
                    }`}
                >
                  <i className="ri-folder-shield-2-line text-base" />
                  {i18n.language === 'vi' ? 'Dashboard Delivery' : 'Projects Delivery'}
                </button>
                <button
                  onClick={() => setActiveTab('crm')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-3 cursor-pointer border-l-4 ${activeTab === 'crm' ? 'border-[#9B2A4C] text-[#9B2A4C] bg-[#9B2A4C]/5' : 'border-transparent text-[#5A6A72] hover:bg-gray-50/50'
                    }`}
                >
                  <i className="ri-file-list-3-line text-base" />
                  {t('admin.crmManagement')}
                </button>
                <button
                  onClick={() => setActiveTab('ai_automation')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-3 cursor-pointer border-l-4 ${activeTab === 'ai_automation' ? 'border-[#9B2A4C] text-[#9B2A4C] bg-[#9B2A4C]/5' : 'border-transparent text-[#5A6A72] hover:bg-gray-50/50'
                    }`}
                >
                  <i className="ri-robot-2-line text-base" />
                  {i18n.language === 'vi' ? 'Dashboard AI & Automation' : 'AI & Automation'}
                </button>
                <button
                  onClick={() => setActiveTab('sales_personal')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-between cursor-pointer border-l-4 ${activeTab === 'sales_personal' ? 'border-[#9B2A4C] text-[#9B2A4C] bg-[#9B2A4C]/5' : 'border-transparent text-[#5A6A72] hover:bg-gray-50/50'
                    }`}
                >
                  <span className="flex items-center gap-3">
                    <i className="ri-user-star-line text-base text-amber-500" />
                    {i18n.language === 'vi' ? 'Dashboard Cho Riêng Sales' : 'Sales Personal Cockpit'}
                  </span>
                  <span className="bg-amber-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                    HOT
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('post_prompt')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-between cursor-pointer border-l-4 ${activeTab === 'post_prompt' ? 'border-[#9B2A4C] text-[#9B2A4C] bg-[#9B2A4C]/5' : 'border-transparent text-[#5A6A72] hover:bg-gray-50/50'
                    }`}
                >
                  <span className="flex items-center gap-3">
                    <i className="ri-magic-line text-base" />
                    {t('admin.postPrompt', 'Đăng Bài Prompt')}
                  </span>
                  {customPrompts.length > 0 && (
                    <span className="bg-[#9B2A4C] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      {customPrompts.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('post_project')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-between cursor-pointer border-l-4 ${activeTab === 'post_project' ? 'border-[#9B2A4C] text-[#9B2A4C] bg-[#9B2A4C]/5' : 'border-transparent text-[#5A6A72] hover:bg-gray-50/50'
                    }`}
                >
                  <span className="flex items-center gap-3">
                    <i className="ri-layout-grid-line text-base" />
                    {t('admin.postProject', 'Đăng Bài Project')}
                  </span>
                  {customProjects.length > 0 && (
                    <span className="bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      {customProjects.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('payouts')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-between cursor-pointer border-l-4 ${activeTab === 'payouts' ? 'border-[#9B2A4C] text-[#9B2A4C] bg-[#9B2A4C]/5' : 'border-transparent text-[#5A6A72] hover:bg-gray-50/50'
                    }`}
                >
                  <span className="flex items-center gap-3">
                    <i className="ri-hand-coin-line text-base" />
                    Thanh Toán Cho Sale
                  </span>
                  {salesPayouts.filter(p => p.status === 'Pending').length > 0 && (
                    <span className="bg-[#9B2A4C] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                      {salesPayouts.filter(p => p.status === 'Pending').length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('contact_leads')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-between cursor-pointer border-l-4 ${activeTab === 'contact_leads' ? 'border-[#9B2A4C] text-[#9B2A4C] bg-[#9B2A4C]/5' : 'border-transparent text-[#5A6A72] hover:bg-gray-50/50'
                    }`}
                >
                  <span className="flex items-center gap-3">
                    <i className="ri-contacts-book-line text-base" />
                    {t('admin.contactLeads', 'Thông Tin Liên Hệ')}
                  </span>
                  {leads.filter(l => l.status === 'New').length > 0 && (
                    <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                      {leads.filter(l => l.status === 'New').length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('accounts')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-between cursor-pointer border-l-4 ${activeTab === 'accounts' ? 'border-[#9B2A4C] text-[#9B2A4C] bg-[#9B2A4C]/5' : 'border-transparent text-[#5A6A72] hover:bg-gray-50/50'
                    }`}
                >
                  <span className="flex items-center gap-3">
                    <i className="ri-user-settings-line text-base" />
                    {t('admin.accountManagement')}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-3 cursor-pointer border-l-4 ${activeTab === 'security' ? 'border-[#9B2A4C] text-[#9B2A4C] bg-[#9B2A4C]/5' : 'border-transparent text-[#5A6A72] hover:bg-gray-50/50'
                    }`}
                >
                  <i className="ri-key-line text-base" />
                  {t('admin.securityRBAC')}
                </button>
              </div>

              {/* Active Tab Panel */}
              <div className="lg:col-span-9 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm min-h-[500px]">
                {/* 0. EXECUTIVE DASHBOARD (CEO VIEW - MATCHING GOOGLE DOC IMAGE 1) */}
                {activeTab === 'executive' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
                      <div>
                        <h3 className="font-bold text-[#1C2526] text-xl flex items-center gap-2">
                          <i className="ri-dashboard-3-line text-[#9B2A4C]" />
                          Executive Dashboard (Dashboard Tổng Quan CEO)
                        </h3>
                        <p className="text-xs text-gray-400">Báo cáo tổng hợp sức khỏe doanh nghiệp, chỉ số doanh thu, lợi nhuận & KPI cốt lõi.</p>
                      </div>
                      <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-xl border border-amber-200 flex items-center gap-1.5 shrink-0">
                        <i className="ri-sun-line text-sm animate-spin" />
                        Hôm nay: {new Date().toLocaleDateString('vi-VN')}
                      </span>
                    </div>

                    {/* Real KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2">
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold text-gray-400">
                          <span>Doanh Thu (Total Revenue)</span>
                          <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">Real DB</span>
                        </div>
                        <p className="text-2xl font-black text-[#1C2526]">{realTotalRevenue.toLocaleString('vi-VN')}đ</p>
                        <p className="text-[10px] text-gray-400">Tổng hợp từ {projects.length} dự án thực tế</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2">
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold text-gray-400">
                          <span>Lợi Nhuận Gộp (Gross Profit)</span>
                          <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">Real DB</span>
                        </div>
                        <p className="text-2xl font-black text-[#9B2A4C]">{realGrossProfit.toLocaleString('vi-VN')}đ</p>
                        <p className="text-[10px] text-gray-400">Biên lợi nhuận gộp: {realGrossProfitMargin}%</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2">
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold text-gray-400">
                          <span>Dự Án Đang Chạy (Active Projects)</span>
                          <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-bold">{realOnboardingCount} Mới</span>
                        </div>
                        <p className="text-2xl font-black text-indigo-600">{realActiveProjects.length} Dự Án</p>
                        <p className="text-[10px] text-gray-400">{realInProgressCount} Đang triển khai | {realCompletedCount} Hoàn thành</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2">
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold text-gray-400">
                          <span>Tỷ Lệ Chốt (Win Rate)</span>
                          <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">Real DB</span>
                        </div>
                        <p className="text-2xl font-black text-amber-600">{realWinRate}%</p>
                        <p className="text-[10px] text-gray-400">{realWonLeads} / {realTotalLeads} Leads được duyệt</p>
                      </div>
                    </div>

                    {/* Image 1 Reference Middle Row: Charts (Line chart Revenue Analysis + Donut chart Revenue by Category) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left: Revenue vs Expenses Line Chart */}
                      <div className="lg:col-span-8 p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-xs font-bold text-[#1C2526] uppercase tracking-wide">
                              Phân Tích Doanh Thu & Chi Phí 6 Tháng (Revenue Analysis)
                            </h4>
                            <p className="text-[10px] text-gray-400">Biểu đồ so sánh Doanh Thu vs Chi Phí (triệu VNĐ)</p>
                          </div>
                          <span className="text-[10px] font-semibold text-gray-500 bg-white border border-gray-200 px-2.5 py-1 rounded-lg">Jan - Jun 2026</span>
                        </div>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={executiveLineData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#6b7280" />
                              <YAxis tick={{ fontSize: 10 }} stroke="#6b7280" />
                              <Tooltip formatter={(value: any) => [`${value}M VNĐ`, '']} contentStyle={{ fontSize: 11 }} />
                              <Legend wrapperStyle={{ fontSize: 11 }} />
                              <Line type="monotone" dataKey="revenue" stroke="#9B2A4C" name="Doanh Thu (Revenue)" strokeWidth={2.5} activeDot={{ r: 6 }} />
                              <Line type="monotone" dataKey="expense" stroke="#1C2526" name="Chi Phí (Expenses)" strokeWidth={1.5} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Right: Revenue by Category Donut Chart */}
                      <div className="lg:col-span-4 p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-[#1C2526] uppercase tracking-wide">
                            Cơ Cấu Doanh Thu (Revenue by Category)
                          </h4>
                          <p className="text-[10px] text-gray-400">Tỷ trọng doanh thu theo từng mảng sản phẩm</p>
                        </div>
                        <div className="h-44 flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={executiveDonutData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={68}
                                paddingAngle={4}
                                dataKey="value"
                              >
                                {executiveDonutData.map((entry, idx) => (
                                  <Cell key={`cell-exec-${idx}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value: any) => [`${value}%`, 'Tỷ trọng']} contentStyle={{ fontSize: 11 }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          {executiveDonutData.map(d => (
                            <div key={d.name} className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                              <span className="text-gray-600 truncate">{d.name}: <strong>{d.value}%</strong></span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Image 1 Reference Bottom Row: Operating Costs Breakdown + Top Performing Agents */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left: Horizontal Bar Chart - Operating Costs */}
                      <div className="lg:col-span-6 p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
                        <h4 className="text-xs font-bold text-[#1C2526] uppercase tracking-wide">
                          Chi Phí Vận Hành (Operating Costs Breakdown)
                        </h4>
                        <div className="h-52">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={executiveBarData} layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis type="number" tick={{ fontSize: 10 }} />
                              <YAxis dataKey="category" type="category" tick={{ fontSize: 10 }} width={110} />
                              <Tooltip formatter={(val: any) => [`${val}M VNĐ`, 'Chi phí']} contentStyle={{ fontSize: 11 }} />
                              <Bar dataKey="cost" fill="#9B2A4C" radius={[0, 4, 4, 0]} name="Chi phí (M VNĐ)" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Right: Table - Top Performing Agents */}
                      <div className="lg:col-span-6 p-5 rounded-2xl bg-white border border-gray-200 space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-[#1C2526] uppercase tracking-wide">
                            Top Sales Đạt Hiệu Suất Cao (Top Performing Agents)
                          </h4>
                          <span className="text-[10px] text-amber-600 font-bold">Tháng 8/2026</span>
                        </div>
                        <div className="border border-gray-100 rounded-xl overflow-hidden text-xs">
                          <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold text-[10px] uppercase">
                              <tr>
                                <th className="p-2.5 pl-3">Nhân viên Sales</th>
                                <th className="p-2.5">Mục tiêu</th>
                                <th className="p-2.5 text-right">Đạt được</th>
                                <th className="p-2.5 text-center pr-3">Win Rate</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                              {topAgentsList.map((agent, i) => (
                                <tr key={agent.name} className="hover:bg-gray-50/50">
                                  <td className="p-2.5 pl-3 font-semibold text-[#1C2526]">{agent.name}</td>
                                  <td className="p-2.5 text-gray-400">{agent.target}</td>
                                  <td className="p-2.5 text-right font-bold text-[#9B2A4C]">{agent.achieved}</td>
                                  <td className="p-2.5 text-center pr-3 font-bold text-emerald-600">{agent.winRate}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 1. MARKETING TAB */}
                {activeTab === 'marketing' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-4">
                        <h3 className="font-bold text-[#1C2526] text-lg">{t('admin.realtimeTraffic')}</h3>
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-0.5">
                          <button
                            onClick={() => setTrafficFilter('day')}
                            className={`text-[10px] font-bold px-3 py-1 rounded-md transition-all ${trafficFilter === 'day' ? 'bg-white shadow-sm text-[#9B2A4C]' : 'text-gray-500 hover:text-[#1C2526]'}`}
                          >
                            Day
                          </button>
                          <button
                            onClick={() => setTrafficFilter('week')}
                            className={`text-[10px] font-bold px-3 py-1 rounded-md transition-all ${trafficFilter === 'week' ? 'bg-white shadow-sm text-[#9B2A4C]' : 'text-gray-500 hover:text-[#1C2526]'}`}
                          >
                            Week
                          </button>
                          <button
                            onClick={() => setTrafficFilter('month')}
                            className={`text-[10px] font-bold px-3 py-1 rounded-md transition-all ${trafficFilter === 'month' ? 'bg-white shadow-sm text-[#9B2A4C]' : 'text-gray-500 hover:text-[#1C2526]'}`}
                          >
                            Month
                          </button>
                        </div>
                      </div>
                      <span className="text-[10px] text-green-500 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                        {t('admin.activeApis')}
                      </span>
                    </div>

                    {/* Line Chart */}
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trafficData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#8A97A0" />
                          <YAxis tick={{ fontSize: 10 }} stroke="#8A97A0" />
                          <Tooltip contentStyle={{ fontSize: 12 }} />
                          <Legend wrapperStyle={{ fontSize: 11 }} />
                          <Line type="monotone" dataKey="visitors" stroke="#9B2A4C" name="Total Visitors" strokeWidth={2.5} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="organic" stroke="#1C2526" name="SEO Organic" strokeWidth={1.5} />
                          <Line type="monotone" dataKey="facebook" stroke="#2563EB" name="Facebook" strokeWidth={1.5} />
                          <Line type="monotone" dataKey="tiktok" stroke="#D97706" name="TikTok" strokeWidth={1.5} />
                          <Line type="monotone" dataKey="youtube" stroke="#EF4444" name="YouTube" strokeWidth={1.5} />
                          <Line type="monotone" dataKey="direct" stroke="#10B981" name="Browser" strokeWidth={1.5} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Device Traffic Breakdown (Yêu cầu Google Doc) */}
                    <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                      <h4 className="font-bold text-[#1C2526] text-xs uppercase tracking-wider flex items-center gap-2">
                        <i className="ri-device-line text-[#9B2A4C]" /> Đo Lường Traffic Theo Thiết Bị (Device Breakdown)
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Desktop (Máy tính)</p>
                            <p className="text-xl font-black text-[#1C2526]">58%</p>
                            <p className="text-[9px] text-gray-400">18,450 sessions</p>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                            <i className="ri-macbook-line" />
                          </div>
                        </div>
                        <div className="p-4 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Mobile (Điện thoại)</p>
                            <p className="text-xl font-black text-[#9B2A4C]">34%</p>
                            <p className="text-[9px] text-gray-400">10,820 sessions</p>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg">
                            <i className="ri-smartphone-line" />
                          </div>
                        </div>
                        <div className="p-4 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Tablet (Máy tính bảng)</p>
                            <p className="text-xl font-black text-indigo-600">8%</p>
                            <p className="text-[9px] text-gray-400">2,550 sessions</p>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
                            <i className="ri-tablet-line" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                      {/* Pie Chart */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-[#1C2526] text-sm">{t('admin.trafficSources')}</h4>
                        <div className="h-56 flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {pieChartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ fontSize: 11 }} />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="flex flex-col gap-2 shrink-0 pr-4">
                            {pieChartData.map((d, index) => (
                              <div key={d.name} className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                                <span>{d.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Social Media Marketing Report (Thay thế Cảnh báo chiến dịch social theo yêu cầu Google Doc) */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-[#1C2526] text-sm flex items-center justify-between">
                          <span>Báo cáo chiến dịch social media marketing</span>
                          <span className="text-[10px] text-indigo-600 font-normal">Social Report</span>
                        </h4>
                        <div className="space-y-3">
                          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-black flex items-center gap-1.5">
                                <i className="ri-tiktok-fill" /> TikTok Organic & Ads
                              </span>
                              <span className="text-[10px] font-bold text-green-600">+24.5%</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-500 pt-1 border-t border-gray-100">
                              <div>Followers: <strong className="text-black">48.5K</strong></div>
                              <div>Reach: <strong className="text-black">120K</strong></div>
                              <div>Leads: <strong className="text-[#9B2A4C]">42</strong></div>
                            </div>
                          </div>

                          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-blue-600 flex items-center gap-1.5">
                                <i className="ri-facebook-fill" /> Facebook Fanpage & Ads
                              </span>
                              <span className="text-[10px] font-bold text-green-600">+18.2%</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-500 pt-1 border-t border-gray-100">
                              <div>Reach: <strong className="text-black">85K</strong></div>
                              <div>Engagement: <strong className="text-black">12.4K</strong></div>
                              <div>Leads: <strong className="text-[#9B2A4C]">63</strong></div>
                            </div>
                          </div>

                          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-sky-700 flex items-center gap-1.5">
                                <i className="ri-linkedin-fill" /> LinkedIn Enterprise
                              </span>
                              <span className="text-[10px] font-bold text-green-600">+12.0%</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-500 pt-1 border-t border-gray-100">
                              <div>Impressions: <strong className="text-black">28K</strong></div>
                              <div>Connections: <strong className="text-black">3.2K</strong></div>
                              <div>Leads: <strong className="text-[#9B2A4C]">18</strong></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 1.5. SALES DASHBOARD */}
                {activeTab === 'sales' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
                      <div>
                        <h3 className="font-bold text-[#1C2526] text-xl flex items-center gap-2">
                          <i className="ri-funds-box-line text-[#9B2A4C]" />
                          Dashboard Sales (Kinh Doanh & Chốt Đơn)
                        </h3>
                        <p className="text-xs text-gray-400">Theo dõi tiến độ xử lý Leads, chuyển đổi phễu bán hàng và chỉ số hiệu suất team Sales.</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold bg-green-50 text-green-700 px-3 py-1.5 rounded-xl border border-green-200">
                        <i className="ri-rocket-line" /> Win Rate: {realWinRate}%
                      </div>
                    </div>

                    {/* Lead Statistics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Lead Mới (New)</p>
                        <p className="text-2xl font-black text-[#9B2A4C]">{leads.filter(l => l.status === 'New').length}</p>
                        <p className="text-[9px] text-green-600 font-bold">Real DB Records</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Lead Đang Chăm Sóc</p>
                        <p className="text-2xl font-black text-[#1C2526]">{leads.filter(l => l.status === 'Contacted').length}</p>
                        <p className="text-[9px] text-gray-400">Trạng thái: Contacted</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Lead Đã Duyệt (Qualified)</p>
                        <p className="text-2xl font-black text-indigo-600">{realWonLeads}</p>
                        <p className="text-[9px] text-gray-400">Trạng thái: Qualified / Closed</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Tổng Lead Hệ Thống</p>
                        <p className="text-2xl font-black text-emerald-600">{realTotalLeads}</p>
                        <p className="text-[9px] text-green-600 font-bold">Tổng số đăng ký</p>
                      </div>
                    </div>

                    {/* Sales Funnel */}
                    <div className="p-6 rounded-3xl bg-gray-50 border border-gray-200 space-y-4">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#1C2526]">
                        Sales Funnel (Phễu Chuyển Đổi Kinh Doanh)
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center">
                        <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
                          <p className="text-[9px] text-gray-400 font-bold">Visitors</p>
                          <p className="text-lg font-black text-gray-800">{trafficData.reduce((a, c) => a + (c.visitors || 0), 0)}</p>
                          <p className="text-[8px] text-gray-400">100%</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
                          <p className="text-[9px] text-gray-400 font-bold">Lead</p>
                          <p className="text-lg font-black text-indigo-600">{realTotalLeads}</p>
                          <p className="text-[8px] text-indigo-500 font-bold">10.2%</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
                          <p className="text-[9px] text-gray-400 font-bold">Qualified</p>
                          <p className="text-lg font-black text-blue-600">{realWonLeads}</p>
                          <p className="text-[8px] text-blue-500 font-bold">50.0%</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
                          <p className="text-[9px] text-gray-400 font-bold">Meeting</p>
                          <p className="text-lg font-black text-amber-600">{realOnboardingCount}</p>
                          <p className="text-[8px] text-amber-500 font-bold">50.0%</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
                          <p className="text-[9px] text-gray-400 font-bold">Proposal</p>
                          <p className="text-lg font-black text-purple-600">{realInProgressCount}</p>
                          <p className="text-[8px] text-purple-500 font-bold">50.0%</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
                          <p className="text-[9px] text-gray-400 font-bold">Negotiation</p>
                          <p className="text-lg font-black text-rose-600">{projects.filter(p => p.status === 'Client Review').length}</p>
                          <p className="text-[8px] text-rose-500 font-bold">50.0%</p>
                        </div>
                        <div className="p-3 bg-emerald-500 text-white rounded-xl space-y-1 shadow-md">
                          <p className="text-[9px] opacity-80 font-bold">Won (Ký HĐ)</p>
                          <p className="text-lg font-black">{realCompletedCount}</p>
                          <p className="text-[8px] font-bold">47.5%</p>
                        </div>
                      </div>
                    </div>

                    {/* Lead distribution breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-3">
                        <h4 className="text-xs font-bold text-[#1C2526]">Nguồn Lead (Lead by Source)</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-[#1C2526] font-semibold"><i className="ri-facebook-fill text-blue-600" /> Facebook Ads</span>
                            <span className="font-bold text-gray-700">34% (63 leads)</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-[#1C2526] font-semibold"><i className="ri-google-fill text-red-500" /> Google Organic & Ads</span>
                            <span className="font-bold text-gray-700">28% (52 leads)</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-[#1C2526] font-semibold"><i className="ri-tiktok-fill text-black" /> TikTok Social</span>
                            <span className="font-bold text-gray-700">18% (33 leads)</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-[#1C2526] font-semibold"><i className="ri-user-shared-line text-emerald-600" /> Referral (Giới thiệu)</span>
                            <span className="font-bold text-gray-700">12% (22 leads)</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-[#1C2526] font-semibold"><i className="ri-mail-line text-purple-600" /> Cold Email & Call</span>
                            <span className="font-bold text-gray-700">8% (16 leads)</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-3">
                        <h4 className="text-xs font-bold text-[#1C2526]">Nguồn Ngành Nghề (Lead by Industry)</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between items-center"><span className="text-[#1C2526] font-semibold">Thương mại & SME:</span><span className="font-bold">32%</span></div>
                          <div className="flex justify-between items-center"><span className="text-[#1C2526] font-semibold">Bất động sản (BĐS):</span><span className="font-bold">25%</span></div>
                          <div className="flex justify-between items-center"><span className="text-[#1C2526] font-semibold">Spa, Mỹ phẩm & Thẩm mỹ:</span><span className="font-bold">20%</span></div>
                          <div className="flex justify-between items-center"><span className="text-[#1C2526] font-semibold">F&B & Chuỗi Nhà hàng:</span><span className="font-bold">14%</span></div>
                          <div className="flex justify-between items-center"><span className="text-[#1C2526] font-semibold">KOL & Personal Brand:</span><span className="font-bold">9%</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 1.6. AI & AUTOMATION DASHBOARD */}
                {activeTab === 'ai_automation' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
                      <div>
                        <h3 className="font-bold text-[#1C2526] text-xl flex items-center gap-2">
                          <i className="ri-robot-2-line text-[#9B2A4C]" />
                          Dashboard AI & Automation
                        </h3>
                        <p className="text-xs text-gray-400">Theo dõi hiệu suất vận hành hệ thống tự động hóa n8n, Chatbot AI, Email & ROI mang lại.</p>
                      </div>
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 flex items-center gap-1.5">
                        <i className="ri-cpu-line text-sm" /> {realWorkflowsActive} Workflows Active
                      </span>
                    </div>

                    {/* Top Summary Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Cuộc Hội Thoại Chatbot</p>
                        <p className="text-2xl font-black text-[#9B2A4C]">{realChatbotConversations.toLocaleString('vi-VN')}</p>
                        <p className="text-[9px] text-green-600 font-bold">{realVisitors > 0 ? '98.5%' : '0%'} tự động hóa</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Lượt Chạy Workflow (n8n)</p>
                        <p className="text-2xl font-black text-indigo-600">{realWorkflowExecutions.toLocaleString('vi-VN')}</p>
                        <p className="text-[9px] text-gray-400">Realtime Execution</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Thời Gian Tiết Kiệm</p>
                        <p className="text-2xl font-black text-emerald-600">{realTimeSaved} Giờ</p>
                        <p className="text-[9px] text-gray-400">Tiết kiệm vận hành</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Chi Phí Tiết Kiệm (ROI)</p>
                        <p className="text-2xl font-black text-amber-600">{realCostSaved.toLocaleString('vi-VN')}đ</p>
                        <p className="text-[9px] text-amber-600 font-bold">Real ROI Calculation</p>
                      </div>
                    </div>

                    {/* AI Automation 7-Day Performance Chart */}
                    <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-[#1C2526] uppercase tracking-wide flex items-center gap-2">
                          <i className="ri-pulse-line text-[#9B2A4C]" /> Xu Hướng Tự Động Hóa 7 Ngày QUA (AI & Automation Daily Execution)
                        </h4>
                        <span className="text-[10px] text-gray-500 font-semibold bg-white border border-gray-200 px-2 py-0.5 rounded-lg">Realtime Sync</span>
                      </div>
                      <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={aiChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#6b7280" />
                            <YAxis tick={{ fontSize: 10 }} stroke="#6b7280" />
                            <Tooltip contentStyle={{ fontSize: 11 }} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Line type="monotone" dataKey="n8n" stroke="#6366F1" name="n8n Executions" strokeWidth={2.5} />
                            <Line type="monotone" dataKey="chatbot" stroke="#9B2A4C" name="AI Conversations" strokeWidth={2} />
                            <Line type="monotone" dataKey="timeSavedHours" stroke="#10B981" name="Giờ Tiết Kiệm" strokeWidth={1.5} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Systems Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Chatbot Performance */}
                      <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <h4 className="text-xs font-bold text-[#1C2526] flex items-center gap-1.5">
                            <i className="ri-message-3-line text-[#9B2A4C]" /> Hiệu Suất AI Chatbot
                          </h4>
                          <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Online</span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between"><span>Số cuộc hội thoại:</span><span className="font-bold">{realChatbotConversations.toLocaleString('vi-VN')}</span></div>
                          <div className="flex justify-between"><span>Tỷ lệ trả lời thành công:</span><span className="font-bold text-green-600">{realVisitors > 0 ? '98.5%' : '0%'}</span></div>
                          <div className="flex justify-between"><span>Tỷ lệ chuyển sang nhân viên:</span><span className="font-bold text-amber-600">5.8%</span></div>
                          <div className="flex justify-between"><span>Lead thu được qua Chatbot:</span><span className="font-bold text-[#9B2A4C]">{realAiLeads} Leads</span></div>
                        </div>
                      </div>

                      {/* n8n Workflows */}
                      <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <h4 className="text-xs font-bold text-[#1C2526] flex items-center gap-1.5">
                            <i className="ri-flow-chart text-indigo-600" /> Tự Động Hóa n8n Workflows
                          </h4>
                          <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">n8n Cloud</span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between"><span>Workflow đang hoạt động:</span><span className="font-bold text-indigo-600">{realWorkflowsActive} Workflows</span></div>
                          <div className="flex justify-between"><span>Chạy thành công:</span><span className="font-bold text-green-600">{realWorkflowExecutions.toLocaleString('vi-VN')}</span></div>
                          <div className="flex justify-between"><span>Lỗi phát sinh:</span><span className="font-bold text-red-500">0</span></div>
                          <div className="flex justify-between"><span>Thời gian xử lý trung bình:</span><span className="font-bold text-gray-700">1.2 giây/task</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 1.7. SALES PERSONAL DASHBOARD */}
                {activeTab === 'sales_personal' && (
                  <div className="space-y-8 animate-fadeIn">
                    {/* Header Banner */}
                    <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1C2526] via-slate-900 to-[#9B2A4C] text-white space-y-4 shadow-xl relative overflow-hidden">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-xl md:text-2xl font-black">Xin chào, {sessionStorage.getItem('user_name') || 'Admin'} 👋</h2>
                            <span className="bg-amber-400 text-black text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">Top Sales</span>
                          </div>
                          <p className="text-xs text-gray-300 mt-1">Hôm nay: {new Date().toLocaleDateString('vi-VN')} | Chức vụ: Business Consultant | Team: Enterprise Sales</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 min-w-[240px]">
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span>Mục Tiêu Tháng 8</span>
                            <span className="text-amber-400">72%</span>
                          </div>
                          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-amber-400 rounded-full" style={{ width: '72%' }} />
                          </div>
                          <div className="flex justify-between text-[10px] text-gray-300">
                            <span>Đã đạt: <strong className="text-white">{realTotalRevenue.toLocaleString('vi-VN')}đ</strong></span>
                            <span>Chỉ tiêu: <strong className="text-white">1.000.000.000đ</strong></span>
                          </div>
                          <p className="text-xs font-extrabold text-emerald-300 mt-2 text-right">Hoa hồng dự kiến: {totalSalesCommission.toLocaleString('vi-VN')}đ</p>
                        </div>
                      </div>
                    </div>

                    {/* 8 KPI Cards Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                      <div className="p-3.5 rounded-2xl bg-white border border-gray-200 text-center space-y-1 shadow-sm">
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Lead Mới</p>
                        <p className="text-xl font-black text-[#9B2A4C]">{leads.filter(l => l.status === 'New').length}</p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-white border border-gray-200 text-center space-y-1 shadow-sm">
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Đang Chăm Sóc</p>
                        <p className="text-xl font-black text-[#1C2526]">{leads.filter(l => l.status === 'Contacted').length}</p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-white border border-gray-200 text-center space-y-1 shadow-sm">
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Dự Án Mới</p>
                        <p className="text-xl font-black text-indigo-600">{realOnboardingCount}</p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-white border border-gray-200 text-center space-y-1 shadow-sm">
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Triển Khai</p>
                        <p className="text-xl font-black text-purple-600">{realInProgressCount}</p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-white border border-gray-200 text-center space-y-1 shadow-sm">
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Duyệt SP</p>
                        <p className="text-xl font-black text-amber-600">{projects.filter(p => p.status === 'Client Review').length}</p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-white border border-gray-200 text-center space-y-1 shadow-sm">
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Chờ Thanh Toán</p>
                        <p className="text-xl font-black text-blue-600">{payouts.filter(p => p.status === 'Pending').length}</p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-white border border-gray-200 text-center space-y-1 shadow-sm">
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Hoàn Thành</p>
                        <p className="text-xl font-black text-emerald-600">{realCompletedCount}</p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-white border border-gray-200 text-center space-y-1 shadow-sm">
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Win Rate</p>
                        <p className="text-xl font-black text-rose-600">{realWinRate}%</p>
                      </div>
                    </div>

                    {/* Main Cockpit Layout: Left Main & Right AI Assistant */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left 2 Cols: Priority Leads, Checklist, Proposals */}
                      <div className="lg:col-span-2 space-y-6">
                        {/* Lead Priority List */}
                        <div className="p-5 rounded-3xl bg-white border border-gray-200 space-y-4 shadow-sm">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-bold text-[#1C2526] flex items-center gap-2">
                              <i className="ri-fire-line text-red-500" /> Danh Sách Lead Ưu Tiên Chốt (Lead Priority)
                            </h4>
                            <span className="text-[10px] text-gray-400 font-semibold">5 Hot Leads</span>
                          </div>

                          <div className="space-y-2.5">
                            <div className="p-3.5 rounded-2xl bg-red-50/40 border border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                              <div>
                                <p className="font-bold text-[#1C2526]">Công ty ABC — Score: 96 🔥</p>
                                <p className="text-[10px] text-gray-500">Gói: Website + Chatbot | Đã xem Proposal 6 lần</p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-black text-[#9B2A4C] mr-2">250.000.000đ</span>
                                <a href="mailto:abc@corp.vn" target="_blank" rel="noreferrer" title="Gửi Gmail" className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors">
                                  <i className="ri-mail-line text-xs" />
                                </a>
                                <a href="https://wa.me/84901234567" target="_blank" rel="noreferrer" title="Nhắn WhatsApp" className="w-7 h-7 rounded-lg bg-green-100 text-green-700 flex items-center justify-center hover:bg-green-200 transition-colors">
                                  <i className="ri-whatsapp-line text-xs" />
                                </a>
                                <a href="https://t.me/abccorp" target="_blank" rel="noreferrer" title="Nhắn Telegram" className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center hover:bg-sky-200 transition-colors">
                                  <i className="ri-telegram-line text-xs" />
                                </a>
                              </div>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-red-50/40 border border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                              <div>
                                <p className="font-bold text-[#1C2526]">Spa Linh Anh — Score: 91 🔥</p>
                                <p className="text-[10px] text-gray-500">Gói: Landing Page | Chờ chốt đàm phán</p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-black text-[#9B2A4C] mr-2">80.000.000đ</span>
                                <a href="mailto:contact@spalinhanh.vn" target="_blank" rel="noreferrer" title="Gửi Gmail" className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors">
                                  <i className="ri-mail-line text-xs" />
                                </a>
                                <a href="https://wa.me/84909876543" target="_blank" rel="noreferrer" title="Nhắn WhatsApp" className="w-7 h-7 rounded-lg bg-green-100 text-green-700 flex items-center justify-center hover:bg-green-200 transition-colors">
                                  <i className="ri-whatsapp-line text-xs" />
                                </a>
                                <a href="https://t.me/spalinhanh" target="_blank" rel="noreferrer" title="Nhắn Telegram" className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center hover:bg-sky-200 transition-colors">
                                  <i className="ri-telegram-line text-xs" />
                                </a>
                              </div>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                              <div>
                                <p className="font-bold text-[#1C2526]">XYZ Retail — Score: 82 🟢</p>
                                <p className="text-[10px] text-gray-500">Gói: Workflow n8n | Hẹn Demo hôm nay 15:00</p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-black text-emerald-700 mr-2">120.000.000đ</span>
                                <a href="mailto:info@xyzretail.com" target="_blank" rel="noreferrer" title="Gửi Gmail" className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors">
                                  <i className="ri-mail-line text-xs" />
                                </a>
                                <a href="https://wa.me/84903334444" target="_blank" rel="noreferrer" title="Nhắn WhatsApp" className="w-7 h-7 rounded-lg bg-green-100 text-green-700 flex items-center justify-center hover:bg-green-200 transition-colors">
                                  <i className="ri-whatsapp-line text-xs" />
                                </a>
                                <a href="https://t.me/xyzretail" target="_blank" rel="noreferrer" title="Nhắn Telegram" className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center hover:bg-sky-200 transition-colors">
                                  <i className="ri-telegram-line text-xs" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* To-Do List & Leaderboard */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-3">
                            <h4 className="text-xs font-bold text-[#1C2526] flex items-center gap-1.5">
                              <i className="ri-checkbox-line text-emerald-600" /> Việc Cần Làm Hôm Nay
                            </h4>
                            <div className="space-y-1.5 text-xs text-gray-700">
                              <div className="flex justify-between"><span>📞 Gọi khách hàng:</span><span className="font-bold">18 cuộc</span></div>
                              <div className="flex justify-between"><span>📅 Meeting trao đổi:</span><span className="font-bold">4 cuộc</span></div>
                              <div className="flex justify-between"><span>📩 Gửi Báo giá / Proposal:</span><span className="font-bold">3 file</span></div>
                              <div className="flex justify-between"><span>🔄 Follow-up định kỳ:</span><span className="font-bold">15 leads</span></div>
                              <div className="flex justify-between text-red-500"><span>⚠️ Quá hạn Follow-up:</span><span className="font-bold">5 leads</span></div>
                            </div>
                          </div>

                          <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-3">
                            <h4 className="text-xs font-bold text-[#1C2526] flex items-center gap-1.5">
                              <i className="ri-trophy-line text-amber-500" /> Bảng Xếp Hạng Sales (Leaderboard)
                            </h4>
                            <div className="space-y-1.5 text-xs">
                              <div className="flex justify-between font-bold"><span>🥇 Minh</span><span className="text-amber-600">1.120.000.000đ</span></div>
                              <div className="flex justify-between font-bold text-[#9B2A4C]"><span>🥈 Alvin (Bạn)</span><span>720.000.000đ</span></div>
                              <div className="flex justify-between"><span>🥉 Hoàng</span><span>680.000.000đ</span></div>
                              <div className="flex justify-between text-gray-500"><span>4. Trang</span><span>530.000.000đ</span></div>
                              <div className="flex justify-between text-gray-500"><span>5. Phúc</span><span>420.000.000đ</span></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Col: AI Sales Assistant (Feature box) */}
                      <div className="p-5 rounded-3xl bg-emerald-950 text-white space-y-5 border border-emerald-800 shadow-xl">
                        <div className="flex items-center gap-2 pb-3 border-b border-emerald-800">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                            <i className="ri-robot-line" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">AI Sales Assistant</h4>
                            <p className="text-[10px] text-emerald-300">Gợi ý hành động thông minh từ AI</p>
                          </div>
                        </div>

                        {/* Priority tasks */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">🟢 Việc ưu tiên hôm nay:</p>
                          <ul className="text-xs space-y-1.5 text-gray-200">
                            <li className="flex items-start gap-2"><i className="ri-phone-line text-emerald-400 mt-0.5" /> Gọi lại Công ty ABC (đã mở Proposal 6 lần).</li>
                            <li className="flex items-start gap-2"><i className="ri-time-line text-emerald-400 mt-0.5" /> Follow-up Spa Linh Anh trước 15:00.</li>
                            <li className="flex items-start gap-2"><i className="ri-file-text-line text-emerald-400 mt-0.5" /> Gửi báo giá bổ sung cho XYZ Retail.</li>
                          </ul>
                        </div>

                        {/* Upsell opportunities */}
                        <div className="space-y-2 pt-2 border-t border-emerald-800">
                          <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">📈 Cơ hội Upsell:</p>
                          <ul className="text-xs space-y-1.5 text-gray-200">
                            <li className="flex items-start gap-2"><i className="ri-arrow-up-circle-line text-amber-400 mt-0.5" /> F&B House → Chatbot AI (87% mua).</li>
                            <li className="flex items-start gap-2"><i className="ri-arrow-up-circle-line text-amber-400 mt-0.5" /> ABC Corp → Email Automation (79%).</li>
                          </ul>
                        </div>

                        {/* Warnings */}
                        <div className="space-y-2 pt-2 border-t border-emerald-800">
                          <p className="text-[10px] font-extrabold uppercase tracking-wider text-red-400">⚠️ Cảnh báo rủi ro:</p>
                          <ul className="text-xs space-y-1.5 text-gray-200">
                            <li className="flex items-start gap-2"><i className="ri-error-warning-line text-red-400 mt-0.5" /> 5 khách chưa liên hệ &gt; 7 ngày.</li>
                            <li className="flex items-start gap-2"><i className="ri-alarm-warning-line text-red-400 mt-0.5" /> 2 Proposal sắp hết hạn hiệu lực.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. FINANCE TAB */}
                {activeTab === 'finance' && (
                  role === 'manager' ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-2xl">
                        <i className="ri-lock-2-line" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-[#1C2526] text-base">
                          {i18n.language === 'vi' ? 'Truy cập bị hạn chế' : 'Access Restricted'}
                        </h4>
                        <p className="text-xs text-gray-400 max-w-sm">
                          {i18n.language === 'vi'
                            ? 'Tài khoản vai trò Quản lý (Manager) không có quyền xem báo cáo tài chính và sổ cái.'
                            : 'Manager accounts do not have permission to view financial reports and ledger.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8 animate-fadeIn">
                      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <h3 className="font-bold text-[#1C2526] text-lg">{t('admin.sheetsIntegration')}</h3>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={handleExportFinanceExcel}
                            className="flex items-center gap-1 px-3 py-1.5 bg-[#1C2526] hover:bg-slate-800 text-white text-[10px] font-bold rounded-xl cursor-pointer transition-colors shadow-sm"
                          >
                            <i className="ri-file-download-line text-sm" />
                            {i18n.language === 'vi' ? 'Xuất Excel (CSV)' : 'Export Excel (CSV)'}
                          </button>
                          <span className="text-[10px] text-[#1C2526] font-semibold flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1C2526]/5 rounded-xl">
                            <i className="ri-file-excel-fill text-green-600 text-sm" />
                            {t('admin.sheetsActive')}
                          </span>
                        </div>
                      </div>

                      {/* Finance charts */}
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={financeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ fontSize: 11 }} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Bar dataKey="revenue" fill="#9B2A4C" name="Total Revenue ($)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="outsourceCost" fill="#1C2526" name="Outsource Expenses ($)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="otherCost" fill="#A8B5A0" name="General Operations ($)" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Sheets Grid table representation */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-xs text-[#1C2526] uppercase tracking-wide">
                          {t('admin.sheetsLedger')}
                        </h4>
                        <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-gray-50 border-b border-gray-200 text-[#5A6A72] font-bold">
                                <th className="p-3">Month</th>
                                <th className="p-3 text-right">Revenue</th>
                                <th className="p-3 text-right">Outsource Cost</th>
                                <th className="p-3 text-right">Operating Cost</th>
                                <th className="p-3 text-right">Gross Profit</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                              {financeData.map(log => {
                                const gross = log.revenue - log.outsourceCost - log.otherCost;
                                return (
                                  <tr key={log.month} className="hover:bg-gray-50/50">
                                    <td className="p-3 font-semibold text-[#1C2526]">{log.month}</td>
                                    <td className="p-3 text-right font-semibold text-green-600">${log.revenue}</td>
                                    <td className="p-3 text-right text-red-500">-${log.outsourceCost}</td>
                                    <td className="p-3 text-right text-gray-400">-${log.otherCost}</td>
                                    <td className="p-3 text-right font-bold text-[#9B2A4C]">${gross}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )
                )}

                {/* 3. CRM LEADS */}
                {activeTab === 'crm' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
                      <div>
                        <h3 className="font-bold text-[#1C2526] text-lg">{t('admin.crmDatabase')}</h3>
                        <p className="text-xs text-gray-400">{t('admin.crmDesc')}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <label className="px-4 py-2 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-gray-50 transition-colors cursor-pointer select-none">
                          <i className="ri-file-upload-line text-sm" />
                          {i18n.language === 'vi' ? 'Import CSV' : 'Import CSV'}
                          <input
                            type="file"
                            accept=".csv"
                            onChange={handleCsvImport}
                            className="hidden"
                          />
                        </label>

                        <button
                          onClick={() => {
                            setActiveTab('projects_management');
                            setActiveProjectSubTab('assign');
                          }}
                          className="px-4 py-2 bg-[#1C2526] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow hover:opacity-95 transition-opacity cursor-pointer"
                        >
                          <i className="ri-add-line text-sm" />
                          {i18n.language === 'vi' ? 'Tạo đơn hàng mới' : 'Create new project'}
                        </button>
                      </div>
                    </div>

                    {/* CRM Leads Database */}
                    <div className="border border-gray-200 rounded-2xl shadow-sm">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200 text-[#5A6A72] font-bold">
                            <th className="p-3 rounded-tl-2xl">{t('admin.customerInfo')}</th>
                            <th className="p-3">{t('admin.requestDetails')}</th>
                            <th className="p-3">{t('admin.leadStatus')}</th>
                            <th className="p-3 rounded-tr-2xl text-center">{t('common.actions')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700">
                          {leads.map((lead, idx) => {
                            const isLast = idx === leads.length - 1;
                            return (
                              <tr key={lead.id} className="hover:bg-gray-50/50 align-top">
                                <td className={`p-3 space-y-1 ${isLast ? 'rounded-bl-2xl' : ''}`}>
                                  <p className="font-bold text-[#1C2526]">{lead.name}</p>
                                  <p className="text-[10px] text-gray-400">{lead.email}</p>
                                  <p className="text-[10px] text-gray-400">{lead.phone}</p>
                                  <p className="text-[10px] font-bold text-[#9B2A4C]">{lead.company}</p>
                                </td>
                                <td className="p-3 space-y-1 max-w-xs">
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                                    {i18n.exists(`services.list.${lead.service}.title`) ? t(`services.list.${lead.service}.title` as any) : lead.service}
                                  </span>
                                  <p className="text-[10px] text-[#5A6A72] leading-relaxed line-clamp-3">
                                    {lead.message}
                                  </p>
                                </td>
                                <td className="p-3">
                                  <CustomSelect
                                    value={lead.status}
                                    onChange={async (val) => {
                                      await LeadsAPI.update(lead.id, { status: val });
                                      await loadData();
                                    }}
                                    options={[
                                      { value: 'New', label: t('admin.statusNew') },
                                      { value: 'Contacted', label: t('admin.statusContacted') },
                                      { value: 'Qualified', label: t('admin.statusQualified') },
                                      { value: 'Closed', label: t('admin.statusClosed') }
                                    ]}
                                    selectClassName="bg-gray-50 border border-gray-200 rounded px-2.5 py-1 text-[10px] font-bold text-gray-700 focus:border-[#9B2A4C]"
                                    className="w-28"
                                  />
                                </td>
                                <td className={`p-3 text-center ${isLast ? 'rounded-br-2xl' : ''}`}>
                                  <div className="flex items-center justify-center gap-2">
                                    {lead.status !== 'Qualified' && lead.status !== 'Closed' ? (
                                      <button
                                        onClick={() => {
                                          setAssigningLead(lead);
                                          setAssigneeStaffId('Unassigned');
                                        }}
                                        className="px-2 py-1 bg-[#9B2A4C] text-white text-[10px] font-bold rounded hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-0.5"
                                        title={i18n.language === 'vi' ? 'Giao việc cho Dev' : 'Assign to Dev'}
                                      >
                                        <i className="ri-user-add-line" />
                                        {i18n.language === 'vi' ? 'Giao việc' : 'Assign'}
                                      </button>
                                    ) : null}
                                    <button
                                      onClick={() => setLeadToDelete(lead)}
                                      className="text-red-500 hover:text-red-700 p-1 text-sm cursor-pointer"
                                      title={i18n.language === 'vi' ? 'Xóa khách hàng' : 'Delete Lead'}
                                    >
                                      <i className="ri-delete-bin-6-line" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>


                    {/* Add Customer Modal */}
                    {showAddLeadModal && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-gray-100 shadow-2xl relative overflow-hidden animate-dropdown-in">
                          <div className="absolute top-0 left-0 right-0 h-1.5 gradient-bg" />
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="font-extrabold text-[#1C2526] text-base">
                              {i18n.language === 'vi' ? 'Thêm Khách Hàng Thủ Công' : 'Add New Customer'}
                            </h3>
                            <button
                              onClick={() => setShowAddLeadModal(false)}
                              className="text-gray-400 hover:text-[#9B2A4C] cursor-pointer"
                            >
                              <i className="ri-close-line text-xl" />
                            </button>
                          </div>

                          <form onSubmit={handleAddLeadSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-bold text-[#1C2526] uppercase">
                                {i18n.language === 'vi' ? 'Họ tên *' : 'Full Name *'}
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="Nguyen Van A"
                                value={newLeadName}
                                onChange={(e) => setNewLeadName(e.target.value)}
                                className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C] text-[#1C2526]"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold text-[#1C2526] uppercase">
                                  Email *
                                </label>
                                <input
                                  type="email"
                                  required
                                  placeholder="client@example.com"
                                  value={newLeadEmail}
                                  onChange={(e) => setNewLeadEmail(e.target.value)}
                                  className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C] text-[#1C2526]"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold text-[#1C2526] uppercase">
                                  {i18n.language === 'vi' ? 'Số điện thoại *' : 'Phone Number *'}
                                </label>
                                <input
                                  type="tel"
                                  required
                                  placeholder="0987654321"
                                  value={newLeadPhone}
                                  onChange={(e) => setNewLeadPhone(e.target.value)}
                                  className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C] text-[#1C2526]"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold text-[#1C2526] uppercase">
                                  {i18n.language === 'vi' ? 'Công ty' : 'Company'}
                                </label>
                                <input
                                  type="text"
                                  placeholder="Tech Corp"
                                  value={newLeadCompany}
                                  onChange={(e) => setNewLeadCompany(e.target.value)}
                                  className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C] text-[#1C2526]"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold text-[#1C2526] uppercase">
                                  {i18n.language === 'vi' ? 'Dịch vụ yêu cầu' : 'Service Requested'}
                                </label>
                                <CustomSelect
                                  value={newLeadService}
                                  onChange={(val) => setNewLeadService(val)}
                                  options={[
                                    { value: 'web', label: 'Web Development' },
                                    { value: 'chatbot', label: 'Chatbot AI' },
                                    { value: 'landing', label: 'Landing Page' },
                                    { value: 'workflow', label: 'Workflow Automation' },
                                    { value: 'email', label: 'Email Automation' },
                                    { value: 'n8n', label: 'n8n Custom Setup' },
                                    { value: 'app', label: 'Mobile App' }
                                  ]}
                                  selectClassName="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:border-[#9B2A4C] cursor-pointer text-[#1C2526] font-semibold"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-bold text-[#1C2526] uppercase">
                                {i18n.language === 'vi' ? 'Yêu cầu cụ thể *' : 'Brief / Message *'}
                              </label>
                              <textarea
                                required
                                rows={3}
                                placeholder="..."
                                value={newLeadMessage}
                                onChange={(e) => setNewLeadMessage(e.target.value)}
                                className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C] resize-none text-[#1C2526]"
                              />
                            </div>

                            <div className="flex gap-2 justify-end pt-2">
                              <button
                                type="button"
                                onClick={() => setShowAddLeadModal(false)}
                                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 font-semibold text-xs hover:bg-gray-50 transition-colors"
                              >
                                {i18n.language === 'vi' ? 'Hủy' : 'Cancel'}
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-2 rounded-xl gradient-bg text-white font-bold text-xs shadow hover:opacity-95 transition-opacity"
                              >
                                {i18n.language === 'vi' ? 'Thêm Khách Hàng' : 'Create Customer'}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}

                    {/* Delete Confirmation Modal */}
                    {leadToDelete && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
                        <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-gray-100 shadow-2xl relative overflow-hidden animate-dropdown-in">
                          <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600" />
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 text-lg shrink-0">
                              <i className="ri-error-warning-line" />
                            </div>
                            <div className="space-y-1 flex-1">
                              <h3 className="font-extrabold text-[#1C2526] text-base">
                                {i18n.language === 'vi' ? 'Xác nhận xóa' : 'Confirm Delete'}
                              </h3>
                              <p className="text-xs text-gray-500 leading-relaxed">
                                {i18n.language === 'vi'
                                  ? `Bạn có chắc chắn muốn xóa khách hàng "${leadToDelete.name}"? Hành động này không thể hoàn tác.`
                                  : `Are you sure you want to delete customer "${leadToDelete.name}"? This action cannot be undone.`}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end pt-2">
                            <button
                              type="button"
                              onClick={() => setLeadToDelete(null)}
                              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 font-semibold text-xs hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              {i18n.language === 'vi' ? 'Hủy' : 'Cancel'}
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  await LeadsAPI.delete(leadToDelete.id);
                                  showToast(
                                    i18n.language === 'vi' ? 'Đã xóa khách hàng thành công!' : 'Customer successfully deleted!',
                                    'success'
                                  );
                                  setLeadToDelete(null);
                                  await loadData();
                                } catch (err) {
                                  showToast(
                                    i18n.language === 'vi' ? 'Lỗi khi xóa khách hàng.' : 'Error deleting customer.',
                                    'error'
                                  );
                                }
                              }}
                              className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow hover:bg-red-700 transition-colors cursor-pointer"
                            >
                              {i18n.language === 'vi' ? 'Xóa' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* 4. PROJECTS MANAGEMENT */}
                {activeTab === 'projects_management' && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Sub-tabs Selection */}
                    <div className="flex border-b border-gray-100 pb-2 gap-6">
                      <button
                        onClick={() => setActiveProjectSubTab('progress')}
                        className={`text-sm font-bold pb-2 transition-all border-b-2 cursor-pointer ${activeProjectSubTab === 'progress'
                            ? 'border-[#9B2A4C] text-[#9B2A4C]'
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                          }`}
                      >
                        {i18n.language === 'vi' ? 'Quản lý tiến độ' : 'Progress Management'}
                      </button>
                      <button
                        onClick={() => setActiveProjectSubTab('assign')}
                        className={`text-sm font-bold pb-2 transition-all border-b-2 cursor-pointer ${activeProjectSubTab === 'assign'
                            ? 'border-[#9B2A4C] text-[#9B2A4C]'
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                          }`}
                      >
                        {i18n.language === 'vi' ? 'Tạo dự án mới' : 'Create Project'}
                      </button>
                    </div>

                    {/* Sub-tab 1: Progress Management */}
                    {activeProjectSubTab === 'progress' && (
                      <div className="space-y-6 animate-fadeIn">
                        <div>
                          <h3 className="font-bold text-[#1C2526] text-lg">
                            {i18n.language === 'vi' ? 'Bảng Tiến Độ Dự Án' : 'Project Kanban Board'}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {i18n.language === 'vi' ? 'Sắp xếp và điều phối tiến độ công việc dự án trực quan theo từng trạng thái.' : t('admin.kanbanDesc')}
                          </p>
                        </div>

                        {/* Status Tabs Switcher */}
                        <div className="flex flex-wrap border-b border-gray-100 gap-1 sm:gap-2 pt-2">
                          {(['New', 'In Progress', 'Client Review', 'Completed'] as const).map(status => {
                            const count = projects.filter(p => p.status === status).length;
                            const isActive = activeKanbanStatus === status;
                            return (
                              <button
                                key={status}
                                onClick={() => setActiveKanbanStatus(status)}
                                className={`flex items-center gap-2 px-4 py-3 text-xs font-extrabold transition-all border-b-2 cursor-pointer ${isActive
                                    ? status === 'New' ? 'border-[#D97706] text-[#D97706] bg-[#D97706]/5' :
                                      status === 'In Progress' ? 'border-indigo-500 text-indigo-500 bg-indigo-500/5' :
                                        status === 'Client Review' ? 'border-[#9B2A4C] text-[#9B2A4C] bg-[#9B2A4C]/5' :
                                          'border-green-500 text-green-500 bg-green-500/5'
                                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50/50'
                                  } rounded-t-xl`}
                              >
                                <span className={`w-2 h-2 rounded-full ${status === 'New' ? 'bg-[#D97706]' :
                                    status === 'In Progress' ? 'bg-indigo-500' :
                                      status === 'Client Review' ? 'bg-[#9B2A4C]' : 'bg-green-500'
                                  }`} />
                                <span>
                                  {status === 'New' ? t('admin.statusNew') :
                                    status === 'In Progress' ? t('admin.statusInProgress') :
                                      status === 'Client Review' ? t('admin.statusClientReview') :
                                        t('admin.statusCompleted')}
                                </span>
                                <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${isActive
                                    ? status === 'New' ? 'bg-[#D97706]/10 text-[#D97706]' :
                                      status === 'In Progress' ? 'bg-indigo-500/10 text-indigo-500' :
                                        status === 'Client Review' ? 'bg-[#9B2A4C]/10 text-[#9B2A4C]' :
                                          'bg-green-500/10 text-green-500'
                                    : 'bg-gray-100 text-gray-500'
                                  }`}>
                                  {count}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Projects Grid for Selected Status */}
                        <div className="pt-2">
                          {(() => {
                            const filtered = projects.filter(p => p.status === activeKanbanStatus);
                            if (filtered.length === 0) {
                              return (
                                <div className="py-16 text-center text-gray-400 italic text-xs">
                                  {i18n.language === 'vi' ? 'Không có dự án nào ở trạng thái này' : 'No projects in this status'}
                                </div>
                              );
                            }
                            return (
                              <div className="divide-y divide-gray-100">
                                {filtered.map(proj => {
                                  // Calculate subtasks info
                                  let subTasksList: any[] = [];
                                  try {
                                    subTasksList = JSON.parse(proj.subTasks || '[]');
                                  } catch {
                                    subTasksList = [];
                                  }
                                  const totalSubTasks = subTasksList.length;
                                  const completedSubTasks = subTasksList.filter((t: any) => t.completed).length;

                                  return (
                                    <div
                                      key={proj.id}
                                      className="py-6 first:pt-2 last:pb-2 space-y-4 transition-all duration-200"
                                    >
                                      {/* Main Row: Flexible layout for flat look */}
                                      <div className="flex flex-col md:flex-row gap-6 items-start justify-between w-full">

                                        {/* Left: Project Title, ID, Service, Client */}
                                        <div className="space-y-2 min-w-0 flex-1">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-[9px] font-extrabold text-[#9B2A4C] uppercase bg-[#9B2A4C]/5 px-2 py-0.5 rounded-md tracking-wider">
                                              {i18n.exists(`services.list.${proj.service}.title`) ? t(`services.list.${proj.service}.title` as any) : proj.service}
                                            </span>
                                            <span className="text-[9px] font-bold text-gray-400">
                                              #{proj.id.substring(0, 5)}
                                            </span>
                                          </div>
                                          <div>
                                            <h4 className="text-sm font-bold text-[#1C2526] leading-snug" title={proj.name}>
                                              {proj.name}
                                            </h4>
                                            <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                                              <i className="ri-user-star-line text-[12px]" />
                                              <span>{i18n.language === 'vi' ? 'Khách hàng' : 'Client'}: <strong className="text-[#5A6A72] font-semibold">{proj.clientName}</strong></span>
                                            </p>
                                          </div>
                                        </div>

                                        {/* Middle: Details Grid (Deadline, Money) */}
                                        <div className="grid grid-cols-2 sm:flex sm:items-center gap-x-6 gap-y-3 text-[11px] text-[#5A6A72] shrink-0 w-full sm:w-auto">
                                          <div className="space-y-1 sm:min-w-[90px]">
                                            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Deadline</p>
                                            <div className="flex items-center gap-1.5 font-bold text-red-500/80">
                                              <i className="ri-calendar-todo-line text-[#8A97A0]" />
                                              <span>{proj.deadline}</span>
                                            </div>
                                          </div>

                                          <div className="space-y-1 sm:min-w-[80px]">
                                            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">{i18n.language === 'vi' ? 'Hợp đồng' : 'Contract'}</p>
                                            <div className="flex items-center gap-1.5 font-bold text-green-600">
                                              <i className="ri-money-dollar-circle-line" />
                                              <span>{role === 'manager' ? '$***' : `$${proj.contractValue}`}</span>
                                            </div>
                                          </div>

                                          <div className="space-y-1 sm:min-w-[80px]">
                                            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">{i18n.language === 'vi' ? 'Thù lao' : 'Payout'}</p>
                                            <div className="flex items-center gap-1.5 font-bold text-[#9B2A4C]">
                                              <i className="ri-wallet-line" />
                                              <span>{role === 'manager' ? '$***' : `$${proj.outsourceFee}`}</span>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Right: Progress & Card Movement */}
                                        <div className="w-full md:w-56 space-y-3 shrink-0">
                                          {/* Progress Indicator */}
                                          <div className="space-y-1">
                                            <div className="flex justify-between items-center text-[10px]">
                                              <span className="text-gray-400 font-medium">{i18n.language === 'vi' ? 'Tiến độ' : 'Progress'}</span>
                                              <span className="font-bold text-[#9B2A4C]">{proj.progress}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                              <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                  width: `${proj.progress}%`,
                                                  background: proj.progress === 100 ? '#10B981' : 'linear-gradient(90deg, #9B2A4C, #1C2526)'
                                                }}
                                              />
                                            </div>
                                          </div>

                                          {/* Card Mover */}
                                          <div className="flex justify-between items-center pt-1">
                                            <span className="text-[9px] font-bold text-[#5A6A72] uppercase tracking-wider">
                                              {i18n.language === 'vi' ? 'Di chuyển thẻ' : 'Move card'}
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                              <button
                                                onClick={() => handleMoveCard(proj.id, proj.status, 'left')}
                                                disabled={activeKanbanStatus === 'New'}
                                                className="w-6 h-6 rounded-full bg-[#F8F6F2] border border-gray-200 text-gray-500 hover:text-[#9B2A4C] hover:border-[#9B2A4C]/30 hover:bg-[#9B2A4C]/5 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:hover:border-gray-200 cursor-pointer flex items-center justify-center transition-all duration-150"
                                                title={i18n.language === 'vi' ? 'Sang trái' : 'Move left'}
                                              >
                                                <i className="ri-arrow-left-s-line text-xs font-bold" />
                                              </button>
                                              <button
                                                onClick={() => handleMoveCard(proj.id, proj.status, 'right')}
                                                disabled={activeKanbanStatus === 'Completed'}
                                                className="w-6 h-6 rounded-full bg-[#F8F6F2] border border-gray-200 text-gray-500 hover:text-[#9B2A4C] hover:border-[#9B2A4C]/30 hover:bg-[#9B2A4C]/5 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:hover:border-gray-200 cursor-pointer flex items-center justify-center transition-all duration-150"
                                                title={i18n.language === 'vi' ? 'Sang phải' : 'Move right'}
                                              >
                                                <i className="ri-arrow-right-s-line text-xs font-bold" />
                                              </button>
                                            </div>
                                          </div>
                                        </div>

                                      </div>

                                      {/* Subtasks nested section below the main info row */}
                                      {totalSubTasks > 0 && (
                                        <div className="pt-3.5 border-t border-dashed border-gray-150 space-y-2">
                                          <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">
                                              {i18n.language === 'vi' ? 'Đầu việc timeline' : 'Subtasks timeline'}
                                            </span>
                                            <span className="text-[9px] font-bold bg-[#1C2526]/5 px-1.5 py-0.2 rounded text-gray-500">
                                              {completedSubTasks}/{totalSubTasks}
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
                                            {subTasksList.map((st: any) => (
                                              <div key={st.id} className="flex items-center justify-between gap-2 text-[10px] text-gray-500 font-medium py-1 border-b border-gray-100/60 last:border-b-0">
                                                <div className="flex items-center gap-1.5 min-w-0">
                                                  <i className={st.completed ? "ri-checkbox-circle-fill text-green-500 text-[11px]" : "ri-checkbox-blank-circle-line text-gray-300 text-[11px]"} />
                                                  <span className={`truncate leading-tight ${st.completed ? 'line-through text-gray-400' : 'text-gray-700 font-medium'}`} title={st.title}>
                                                    {st.title}
                                                  </span>
                                                </div>
                                                <span className="text-[8px] font-bold text-red-500/80 bg-red-50 px-1 py-0.2 rounded shrink-0">{st.deadline}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    {/* Sub-tab 2: Create Project */}
                    {activeProjectSubTab === 'assign' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-bold text-[#1C2526] text-lg">
                            {i18n.language === 'vi' ? 'Tạo Dự Án Mới' : 'Create New Project'}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {i18n.language === 'vi' ? 'Tạo dự án mới từ đơn hàng của khách và thiết lập ngân sách hợp đồng, deadline.' : 'Create a new project from client order with contract value and deadline.'}
                          </p>
                        </div>

                        <form onSubmit={handleAddTask} className="space-y-5 pt-4 border-t border-gray-100">
                          <h4 className="font-bold text-xs text-[#1C2526] uppercase tracking-wide">
                            {i18n.language === 'vi' ? 'TẠO DỰ ÁN MỚI' : 'CREATE NEW PROJECT'}
                          </h4>

                          {/* Prefill from request */}
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-extrabold text-[#5A6A72] uppercase tracking-wide">
                              {i18n.language === 'vi' ? 'Điền nhanh thông tin từ Đơn hàng của khách' : 'Prefill from Client Order'}
                            </label>
                            <CustomSelect
                              value={prefillLeadId}
                              onChange={(val) => {
                                setPrefillLeadId(val);
                                handleSelectLeadForTask(val);
                              }}
                              options={[
                                { value: 'none', label: `-- ${i18n.language === 'vi' ? 'Chọn đơn hàng từ khách hàng' : 'Select client order'} --` },
                                ...leads.map(l => ({
                                  value: l.id,
                                  label: `${l.name} - ${l.company || (i18n.language === 'vi' ? 'Khách lẻ' : 'Individual')} (${i18n.exists(`services.list.${l.service}.title`) ? t(`services.list.${l.service}.title` as any) : l.service}) [${l.status}]`
                                }))
                              ]}
                              selectClassName="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:border-[#9B2A4C] cursor-pointer"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-bold text-[#1C2526] uppercase">
                                {i18n.language === 'vi' ? 'Tên dự án *' : 'Project Name *'}
                              </label>
                              <input
                                type="text"
                                required
                                placeholder={t('admin.kanbanForm.projectName')}
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C]"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-bold text-[#1C2526] uppercase">
                                {i18n.language === 'vi' ? 'Tên khách hàng *' : 'Client Name *'}
                              </label>
                              <input
                                type="text"
                                required
                                placeholder={t('admin.kanbanForm.clientName')}
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C]"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-bold text-[#1C2526] uppercase">
                                {i18n.language === 'vi' ? 'Email khách hàng *' : 'Client Email *'}
                              </label>
                              <input
                                type="email"
                                required
                                placeholder={t('admin.kanbanForm.clientEmail')}
                                value={clientEmail}
                                onChange={(e) => setClientEmail(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-bold text-[#1C2526] uppercase">
                                {i18n.language === 'vi' ? 'Dịch vụ yêu cầu *' : 'Requested Service *'}
                              </label>
                              <CustomSelect
                                value={taskService}
                                onChange={(val) => setTaskService(val)}
                                options={[
                                  { value: 'web', label: t('services.list.web.title') },
                                  { value: 'chatbot', label: t('services.list.chatbot.title') },
                                  { value: 'landing', label: t('services.list.landing.title') },
                                  { value: 'workflow', label: t('services.list.workflow.title') },
                                  { value: 'email', label: t('services.list.email.title') },
                                  { value: 'n8n', label: t('services.list.n8n.title') },
                                  { value: 'app', label: t('services.list.app.title') }
                                ]}
                                selectClassName="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:border-[#9B2A4C] cursor-pointer text-[#1C2526] font-semibold"
                              />
                            </div>

                            {role !== 'manager' && (
                              <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold text-[#1C2526] uppercase">
                                  {i18n.language === 'vi' ? 'Giá trị Hợp đồng ($) *' : 'Contract Value ($) *'}
                                </label>
                                <input
                                  type="number"
                                  required
                                  placeholder={t('admin.kanbanForm.contractValue')}
                                  value={contractValue}
                                  onChange={(e) => setContractValue(parseInt(e.target.value) || 0)}
                                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C]"
                                />
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-bold text-[#1C2526] uppercase">
                                {i18n.language === 'vi' ? 'Hạn bàn giao (Deadline) *' : 'Project Deadline *'}
                              </label>
                              <input
                                type="date"
                                required
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C] text-[#1C2526] font-semibold"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-bold text-[#1C2526] uppercase">
                                {i18n.language === 'vi' ? 'Mô tả yêu cầu / Brief' : 'Brief / Details'}
                              </label>
                              <textarea
                                rows={1}
                                placeholder={t('admin.kanbanForm.briefPlaceholder')}
                                value={taskBrief}
                                onChange={(e) => setTaskBrief(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C] resize-none"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="bg-[#1C2526] text-white font-bold px-4.5 py-2.5 rounded-xl text-xs hover:bg-[#1C2526]/90 transition-colors cursor-pointer"
                          >
                            {i18n.language === 'vi' ? 'Tạo Dự Án Mới' : 'Create New Project'}
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. POST PROMPT TAB */}
                {activeTab === 'post_prompt' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
                      <div>
                        <h3 className="font-bold text-[#1C2526] text-lg">Đăng Bài Prompt AI</h3>
                        <p className="text-xs text-gray-400">Thêm bài viết Prompt mới (hỗ trợ nhập chữ & upload hình ảnh) tự động hiển thị lên thư viện Prompts.</p>
                      </div>
                      <button
                        onClick={() => {
                          resetPromptForm();
                          setShowAddPromptModal(true);
                        }}
                        className="px-4 py-2.5 bg-[#9B2A4C] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-[#80223e] transition-all shadow-md cursor-pointer"
                      >
                        <i className="ri-add-line text-sm" />
                        Đăng Prompt Mới
                      </button>
                    </div>

                    {/* Prompt Items Cards */}
                    {customPrompts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {customPrompts.map((prompt) => (
                          <div key={prompt.id} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between hover:border-[#9B2A4C]/30 transition-all">
                            <div className="space-y-3">
                              {prompt.imageUrl && (
                                <div className="w-full h-40 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                                  <img src={prompt.imageUrl} alt={prompt.title} className="w-full h-full object-cover" />
                                </div>
                              )}
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#9B2A4C]/10 text-[#9B2A4C]">
                                  {prompt.category}
                                </span>
                                <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full text-white ${prompt.badgeColor}`}>
                                  {prompt.model}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-[#1C2526] leading-snug">{prompt.title}</h4>
                              <p className="text-xs text-gray-500 line-clamp-2">{prompt.summary}</p>
                            </div>

                            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                              <span className="text-[10px] text-gray-400 font-medium">Biến tùy chỉnh: {prompt.variables.length}</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditPrompt(prompt)}
                                  className="px-2.5 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                                >
                                  <i className="ri-edit-line mr-1" /> Sửa
                                </button>
                                <button
                                  onClick={() => handleDeletePrompt(prompt.id)}
                                  className="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                                >
                                  <i className="ri-delete-bin-line mr-1" /> Xóa
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 space-y-3 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                        <i className="ri-magic-line text-4xl text-gray-300" />
                        <p className="text-xs font-bold text-gray-500">Chưa có bài Prompt nào tự đăng.</p>
                        <p className="text-[11px] text-gray-400">Hãy nhấn nút "Đăng Prompt Mới" để tạo bài đầu tiên.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* 6. POST PROJECT TAB */}
                {activeTab === 'post_project' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
                      <div>
                        <h3 className="font-bold text-[#1C2526] text-lg">Đăng Bài Project Showcase</h3>
                        <p className="text-xs text-gray-400">Đăng sản phẩm/dự án mẫu mới (hỗ trợ nhập chữ & upload hình ảnh) hiển thị lên trang Projects.</p>
                      </div>
                      <button
                        onClick={() => {
                          resetProjectForm();
                          setShowAddProjectModal(true);
                        }}
                        className="px-4 py-2.5 bg-[#1C2526] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-slate-800 transition-all shadow-md cursor-pointer"
                      >
                        <i className="ri-add-line text-sm" />
                        Đăng Project Mới
                      </button>
                    </div>

                    {/* Custom Projects List */}
                    {customProjects.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {customProjects.map((proj) => (
                          <div key={proj.id} className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between hover:border-[#9B2A4C]/30 transition-all">
                            <div className="space-y-3">
                              <div className="w-full h-40 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                                <img src={proj.img} alt={proj.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-rose-50 text-[#9B2A4C] border border-rose-100">
                                  {proj.catName}
                                </span>
                                <span className="text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#1C2526] text-white">
                                  {proj.badge}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-[#1C2526] leading-snug">{proj.title}</h4>
                              <p className="text-xs text-gray-500 line-clamp-2">{proj.desc}</p>
                              <div className="flex items-center justify-between text-xs font-bold text-[#9B2A4C]">
                                <span>{proj.priceLabel || 'Giá từ'}: {proj.price} VNĐ</span>
                                <span className="text-gray-400 font-normal text-[10px]">Bàn giao: {proj.delivery}</span>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                              <div className="flex gap-1 flex-wrap">
                                {proj.tags.slice(0, 3).map(tag => (
                                  <span key={tag} className="text-[8px] font-semibold bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{tag}</span>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditProject(proj)}
                                  className="px-2.5 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                                >
                                  <i className="ri-edit-line mr-1" /> Sửa
                                </button>
                                <button
                                  onClick={() => handleDeleteProject(proj.id)}
                                  className="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                                >
                                  <i className="ri-delete-bin-line mr-1" /> Xóa
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 space-y-3 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                        <i className="ri-layout-grid-line text-4xl text-gray-300" />
                        <p className="text-xs font-bold text-gray-500">Chưa có dự án mẫu nào tự đăng.</p>
                        <p className="text-[11px] text-gray-400">Nhấn nút "Đăng Project Mới" để thêm dự án vào Portfolio.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* 7. SALES PAYOUTS TAB */}
                {activeTab === 'payouts' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
                      <div>
                        <h3 className="font-bold text-[#1C2526] text-lg">Thanh Toán Hoa Hồng Cho Sale</h3>
                        <p className="text-xs text-gray-400">Quản lý chi trả hoa hồng chốt hợp đồng dự án cho nhân viên kinh doanh / Sales Reps.</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleExportSalesPayoutsCsv}
                          className="px-3.5 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <i className="ri-file-download-line text-sm" />
                          Xuất CSV
                        </button>
                        <button
                          onClick={() => setShowAddSalesModal(true)}
                          className="px-4 py-2 bg-[#9B2A4C] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#80223e] transition-colors shadow-sm cursor-pointer"
                        >
                          <i className="ri-add-line text-sm" />
                          Tạo Yêu Cầu Hoa Hồng Sale
                        </button>
                      </div>
                    </div>

                    {/* Sales Payout Table */}
                    <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-[#5A6A72] font-bold">
                              <th className="p-3 pl-4">Nhân viên Sale</th>
                              <th className="p-3">Tên Dự Án</th>
                              <th className="p-3 text-right">Giá trị Hợp đồng</th>
                              <th className="p-3 text-right">Hoa hồng (%)</th>
                              <th className="p-3 text-right">Tiền thực nhận</th>
                              <th className="p-3">Thông tin chuyển khoản</th>
                              <th className="p-3">Trạng thái</th>
                              <th className="p-3 text-center pr-4">Thao tác</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-gray-700">
                            {salesPayouts.map(p => (
                              <tr key={p.id} className="hover:bg-gray-50/50">
                                <td className="p-3 pl-4 font-semibold text-[#1C2526]">
                                  <div>{p.saleName}</div>
                                  <div className="text-[10px] text-gray-400 font-normal">{p.saleEmail} | {p.salePhone}</div>
                                </td>
                                <td className="p-3 text-gray-600 font-medium max-w-xs">{p.projectName}</td>
                                <td className="p-3 text-right font-bold text-[#1C2526]">{p.contractValue.toLocaleString('vi-VN')} VNĐ</td>
                                <td className="p-3 text-right font-bold text-amber-600">{p.commissionRate}%</td>
                                <td className="p-3 text-right font-bold text-[#9B2A4C]">{p.amount.toLocaleString('vi-VN')} VNĐ</td>
                                <td className="p-3 text-[10px] text-gray-500 font-mono max-w-xs truncate" title={p.bankInfo}>{p.bankInfo}</td>
                                <td className="p-3">
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                    p.status === 'Paid' ? 'bg-green-50 text-green-600' :
                                    p.status === 'Approved' ? 'bg-indigo-50 text-indigo-600' :
                                    p.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                                    'bg-yellow-50 text-yellow-600'
                                  }`}>
                                    {p.status === 'Paid' ? 'Đã Thanh Toán' : p.status === 'Approved' ? 'Đã Duyệt' : p.status === 'Rejected' ? 'Từ Chối' : 'Chờ Duyệt'}
                                  </span>
                                </td>
                                <td className="p-3 text-center pr-4 space-x-1.5">
                                  {p.status === 'Pending' && (
                                    <button
                                      onClick={() => handleUpdateSalesPayoutStatus(p.id, 'Approved')}
                                      className="px-2.5 py-1 bg-[#1C2526] text-white text-[9px] font-bold rounded hover:opacity-90 transition-opacity cursor-pointer"
                                    >
                                      Duyệt
                                    </button>
                                  )}
                                  {p.status === 'Approved' && (
                                    <button
                                      onClick={() => handleUpdateSalesPayoutStatus(p.id, 'Paid')}
                                      className="px-2.5 py-1 bg-green-500 text-white text-[9px] font-bold rounded hover:opacity-90 transition-opacity cursor-pointer"
                                    >
                                      Đã Chuyển Tiền
                                    </button>
                                  )}
                                  {p.status !== 'Paid' && (
                                    <button
                                      onClick={() => handleUpdateSalesPayoutStatus(p.id, 'Rejected')}
                                      className="px-2 py-1 border border-red-200 text-red-500 text-[9px] font-bold rounded hover:bg-red-50 transition-colors cursor-pointer"
                                    >
                                      Từ Chối
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDeleteSalesPayout(p.id)}
                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                  >
                                    <i className="ri-delete-bin-line" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {salesPayouts.length === 0 && (
                              <tr>
                                <td colSpan={8} className="p-6 text-center text-gray-400 italic">
                                  Chưa có yêu cầu thanh toán hoa hồng Sale nào.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. CONTACT LEADS TAB */}
                {activeTab === 'contact_leads' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
                      <div>
                        <h3 className="font-bold text-[#1C2526] text-lg">Thông Tin Liên Hệ Từ Khách Hàng</h3>
                        <p className="text-xs text-gray-400">Tổng hợp tin nhắn gửi từ trang Contact. Liên hệ trực tiếp 1-click qua Gmail, WhatsApp, Telegram.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-medium">Lọc:</span>
                        <CustomSelect
                          value={contactStatusFilter}
                          onChange={(val: any) => setContactStatusFilter(val)}
                          options={[
                            { value: 'All', label: 'Tất cả trạng thái' },
                            { value: 'New', label: 'Mới gửi (New)' },
                            { value: 'Contacted', label: 'Đã liên hệ' },
                            { value: 'Qualified', label: 'Đã xử lý / Giao việc' },
                            { value: 'Closed', label: 'Đã đóng' },
                          ]}
                          selectClassName="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-700 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Leads List with 1-Click Action Buttons */}
                    <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-[#5A6A72] font-bold">
                              <th className="p-3 pl-4">Khách hàng</th>
                              <th className="p-3">Dịch vụ quan tâm</th>
                              <th className="p-3">Nội dung tin nhắn</th>
                              <th className="p-3">Trạng thái</th>
                              <th className="p-3 text-center pr-4">Tiếp Cận Trực Tiếp</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-gray-700">
                            {leads
                              .filter(l => contactStatusFilter === 'All' || l.status === contactStatusFilter)
                              .map(lead => {
                                const phoneDigits = lead.phone.replace(/[^0-9]/g, '');
                                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(lead.email)}&su=${encodeURIComponent('Phản hồi liên hệ từ Alvin AI Mastery')}&body=${encodeURIComponent(`Chào ${lead.name},\n\nCảm ơn bạn đã liên hệ với Alvin AI Mastery về dịch vụ: ${lead.service}.\n...`)}`;
                                const whatsappUrl = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(`Chào ${lead.name}, tôi liên hệ từ Alvin AI Mastery về yêu cầu ${lead.service || ''} của bạn.`)}`;
                                const telegramUrl = `https://t.me/+${phoneDigits}`;

                                return (
                                  <tr key={lead.id} className="hover:bg-gray-50/50">
                                    <td className="p-3 pl-4">
                                      <div className="font-semibold text-[#1C2526]">{lead.name}</div>
                                      <div className="text-[10px] text-gray-400">{lead.email} | {lead.phone}</div>
                                      {lead.company && <div className="text-[9px] text-[#9B2A4C] font-semibold">{lead.company}</div>}
                                    </td>
                                    <td className="p-3">
                                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 uppercase">
                                        {lead.service}
                                      </span>
                                    </td>
                                    <td className="p-3 max-w-xs">
                                      <p className="text-[11px] text-gray-600 line-clamp-2">{lead.message}</p>
                                      <button
                                        onClick={() => setSelectedContactLead(lead)}
                                        className="text-[9px] font-bold text-[#9B2A4C] hover:underline mt-1 cursor-pointer"
                                      >
                                        Xem chi tiết tin nhắn »
                                      </button>
                                    </td>
                                    <td className="p-3">
                                      <select
                                        value={lead.status}
                                        onChange={(e) => handleUpdateContactLeadStatus(lead.id, e.target.value as any)}
                                        className={`text-[9px] font-bold px-2 py-1 rounded-lg border border-gray-200 cursor-pointer ${
                                          lead.status === 'New' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                          lead.status === 'Contacted' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
                                          'bg-gray-50 text-gray-600'
                                        }`}
                                      >
                                        <option value="New">Mới (New)</option>
                                        <option value="Contacted">Đã liên hệ</option>
                                        <option value="Qualified">Đã xử lý</option>
                                        <option value="Closed">Đã đóng</option>
                                      </select>
                                    </td>
                                    <td className="p-3 text-center pr-4">
                                      <div className="flex items-center justify-center gap-1.5">
                                        {/* Gmail Button */}
                                        <a
                                          href={gmailUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold text-[10px] flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                                          title="Gửi Gmail trực tiếp"
                                        >
                                          <i className="ri-mail-fill text-xs" /> Gmail
                                        </a>

                                        {/* WhatsApp Button */}
                                        <a
                                          href={whatsappUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="px-2.5 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl font-bold text-[10px] flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                                          title="Nhắn tin WhatsApp"
                                        >
                                          <i className="ri-whatsapp-fill text-xs" /> WhatsApp
                                        </a>

                                        {/* Telegram Button */}
                                        <a
                                          href={telegramUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="px-2.5 py-1.5 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-xl font-bold text-[10px] flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                                          title="Nhắn Telegram"
                                        >
                                          <i className="ri-telegram-fill text-xs" /> Telegram
                                        </a>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}

                            {leads.length === 0 && (
                              <tr>
                                <td colSpan={5} className="p-6 text-center text-gray-400 italic">
                                  Chưa có tin nhắn liên hệ nào từ khách hàng.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}


                {/* 6. SECURITY & RBAC CONFIGURATION */}
                {activeTab === 'security' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div>
                      <h3 className="font-bold text-[#1C2526] text-lg">{t('admin.rbacConfigure')}</h3>
                      <p className="text-xs text-gray-400">{t('admin.rbacConfigureDesc')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                      {/* Tax Configuration */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#9B2A4C]/10 text-[#9B2A4C] flex items-center justify-center text-lg">
                            <i className="ri-percent-line" />
                          </div>
                          <h4 className="font-bold text-xs text-[#1C2526] uppercase tracking-wide">
                            {t('admin.taxConfigure')}
                          </h4>
                        </div>
                        <p className="text-xs text-[#5A6A72] leading-relaxed">
                          {t('admin.taxRateExplain')}
                        </p>
                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            disabled={role === 'manager'}
                            value={taxRate}
                            onChange={handleTaxChange}
                            className="bg-transparent border-none outline-none w-full text-sm font-bold text-[#1C2526] disabled:opacity-50"
                          />
                          <span className="text-sm font-bold text-gray-400">%</span>
                        </div>
                      </div>

                      {/* 2FA Configuration */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-lg">
                            <i className="ri-shield-keyhole-line" />
                          </div>
                          <h4 className="font-bold text-xs text-[#1C2526] uppercase tracking-wide">
                            {t('admin.securityStatus')}
                          </h4>
                        </div>
                        <p className="text-xs text-[#5A6A72] leading-relaxed">
                          {t('admin.securityExplain')}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs font-semibold text-gray-500">{t('admin.enable2fa')}</span>
                          <button
                            onClick={handleToggle2FA}
                            className={`w-12 h-6 rounded-full p-1 transition-all duration-300 disabled:opacity-50 cursor-pointer ${twoFA ? 'bg-[#9B2A4C] flex justify-end' : 'bg-gray-300 flex justify-start'
                              }`}
                          >
                            <span className="w-4 h-4 bg-white rounded-full shadow-sm" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Password Encryption notice */}
                    <div className="pl-4 border-l-2 border-yellow-500 text-xs text-[#5A6A72] space-y-1 py-1">
                      <p className="font-bold text-[#1C2526] flex items-center gap-1">
                        <i className="ri-lock-line" />
                        {t('admin.encNoticeTitle')}
                      </p>
                      <p className="leading-relaxed text-[11px]">
                        {t('admin.encNoticeDesc')}
                      </p>
                    </div>
                  </div>
                )}

                {/* 7. ACCOUNT MANAGEMENT */}
                {activeTab === 'accounts' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
                      <div>
                        <h3 className="font-bold text-[#1C2526] text-lg">
                          {i18n.language === 'vi' ? 'Quản Lý Tài Khoản' : 'Account Management'}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {i18n.language === 'vi'
                            ? 'Xem xét, phân quyền vai trò và quản lý tất cả tài khoản người dùng trên hệ thống.'
                            : 'Review, update roles, and manage all user accounts across the system.'}
                        </p>
                      </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                      {/* Search Bar */}
                      <div className="relative w-full sm:max-w-xs">
                        <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                          type="text"
                          placeholder={i18n.language === 'vi' ? 'Tìm theo tên, email...' : 'Search by name, email...'}
                          value={userSearchQuery}
                          onChange={(e) => setUserSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#9B2A4C] text-[#1C2526]"
                        />
                        {userSearchQuery && (
                          <button
                            onClick={() => setUserSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#9B2A4C]"
                          >
                            <i className="ri-close-line" />
                          </button>
                        )}
                      </div>

                      {/* Role Filter */}
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-xs text-[#5A6A72] font-semibold shrink-0">
                          {i18n.language === 'vi' ? 'Vai trò:' : 'Role:'}
                        </span>
                        <CustomSelect
                          value={userRoleFilter}
                          onChange={(val: any) => setUserRoleFilter(val)}
                          options={[
                            { value: 'All', label: i18n.language === 'vi' ? 'Tất cả vai trò' : 'All Roles' },
                            { value: 'admin', label: i18n.language === 'vi' ? 'Admin' : 'Admin' },
                            { value: 'manager', label: i18n.language === 'vi' ? 'Manager' : 'Manager' },
                            { value: 'client', label: i18n.language === 'vi' ? 'Tài khoản khách' : 'Client Account' },
                          ]}
                          selectClassName="bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:border-[#9B2A4C] cursor-pointer font-bold text-gray-700 w-44"
                          className="w-44"
                        />
                      </div>
                    </div>

                    {/* Accounts Database Table */}
                    <div className="border border-gray-200 rounded-2xl shadow-sm overflow-hidden bg-white">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-[#5A6A72] font-bold">
                              <th className="p-3 pl-4 rounded-tl-2xl">{i18n.language === 'vi' ? 'Thông tin tài khoản' : 'Account Info'}</th>
                              <th className="p-3">{i18n.language === 'vi' ? 'Vai trò hệ thống' : 'System Role'}</th>
                              <th className="p-3 rounded-tr-2xl text-center pr-4">{t('common.actions')}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-gray-700 bg-white">
                            {(() => {
                              const query = userSearchQuery.toLowerCase();
                              const filtered = users.filter(user => {
                                const nameMatch = user.name ? user.name.toLowerCase().includes(query) : false;
                                const emailMatch = user.email ? user.email.toLowerCase().includes(query) : false;
                                const matchesQuery = nameMatch || emailMatch;
                                const matchesRole = userRoleFilter === 'All' || user.role === userRoleFilter;
                                return matchesQuery && matchesRole;
                              });

                              if (filtered.length === 0) {
                                return (
                                  <tr>
                                    <td colSpan={3} className="p-8 text-center text-gray-400 italic">
                                      {i18n.language === 'vi' ? 'Không tìm thấy tài khoản nào' : 'No accounts found'}
                                    </td>
                                  </tr>
                                );
                              }

                              return filtered.map((user, idx) => {
                                const isLast = idx === filtered.length - 1;

                                return (
                                  <tr key={user.id} className="hover:bg-gray-50/50 align-top">
                                    {/* Account Info */}
                                    <td className={`p-3 pl-4 space-y-1 ${isLast ? 'rounded-bl-2xl' : ''}`}>
                                      <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-[#9B2A4C]/10 text-[#9B2A4C] flex items-center justify-center font-bold text-xs shrink-0">
                                          {(user.name || user.email || '?')[0].toUpperCase()}
                                        </div>
                                        <div>
                                          <p className="font-bold text-[#1C2526]">{user.name || '-'}</p>
                                          <p className="text-[10px] text-gray-400">{user.email}</p>
                                        </div>
                                      </div>
                                      <div className="text-[9px] text-gray-400 pl-10 space-y-0.5">
                                        <p>ID: {user.id}</p>
                                        {user.createdAt && (
                                          <p>
                                            {i18n.language === 'vi' ? 'Ngày tạo:' : 'Created:'}{' '}
                                            {new Date(user.createdAt).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
                                              year: 'numeric',
                                              month: 'short',
                                              day: 'numeric'
                                            })}
                                          </p>
                                        )}
                                      </div>
                                    </td>

                                    {/* Role Selector */}
                                    <td className="p-3">
                                      <CustomSelect
                                        value={user.role}
                                        disabled={role === 'manager'}
                                        onChange={(val: any) => handleRoleChange(user.id, val)}
                                        options={[
                                          { value: 'admin', label: i18n.language === 'vi' ? 'Admin' : 'Admin' },
                                          { value: 'manager', label: i18n.language === 'vi' ? 'Manager' : 'Manager' },
                                          { value: 'client', label: i18n.language === 'vi' ? 'Tài khoản khách' : 'Client Account' }
                                        ]}
                                        selectClassName="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1 text-[11px] font-bold text-gray-700 focus:border-[#9B2A4C] cursor-pointer"
                                        className="w-36"
                                      />
                                    </td>

                                    {/* Actions */}
                                    <td className={`p-3 text-center pr-4 ${isLast ? 'rounded-br-2xl' : ''}`}>
                                      <div className="flex items-center justify-center gap-2">
                                        {/* Delete User */}
                                        <button
                                          onClick={() => setUserToDelete(user)}
                                          disabled={role === 'manager'}
                                          className={`p-1 text-sm cursor-pointer transition-colors ${
                                            role === 'manager' 
                                              ? 'text-gray-300 cursor-not-allowed' 
                                              : 'text-red-500 hover:text-red-700'
                                          }`}
                                          title={
                                            role === 'manager'
                                              ? (i18n.language === 'vi' ? 'Không có quyền xóa' : 'No delete permission')
                                              : (i18n.language === 'vi' ? 'Xóa tài khoản' : 'Delete Account')
                                          }
                                        >
                                          <i className="ri-delete-bin-6-line" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              });
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {/* USER DELETE CONFIRMATION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-gray-100 shadow-2xl relative overflow-hidden animate-scaleUp">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600" />
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 text-lg shrink-0">
                <i className="ri-error-warning-line" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-bold text-[#1C2526] text-base">
                  {i18n.language === 'vi' ? 'Xác nhận xóa tài khoản' : 'Confirm Account Deletion'}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {i18n.language === 'vi'
                    ? `Bạn có chắc muốn xóa tài khoản "${userToDelete.name || userToDelete.email}"? Thao tác này sẽ gỡ hoàn toàn thông tin của họ khỏi hệ thống.`
                    : `Are you sure you want to delete user "${userToDelete.name || userToDelete.email}"? This action will permanently remove their records from the system.`}
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 border border-gray-200 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await UsersAPI.delete(userToDelete.id);
                    showToast(
                      i18n.language === 'vi'
                        ? 'Đã xóa tài khoản thành công!'
                        : 'Account successfully deleted!',
                      'success'
                    );
                    setUserToDelete(null);
                    await loadData();
                  } catch (err) {
                    showToast(
                      i18n.language === 'vi'
                        ? 'Lỗi khi xóa tài khoản.'
                        : 'Error deleting account.',
                      'error'
                    );
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 shadow transition-colors cursor-pointer"
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA SETUP MODAL MOCK */}
      {showTwoFAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full border border-gray-100 shadow-2xl space-y-6 animate-scaleUp">
            <div className="text-center space-y-2">
              <h3 className="font-bold text-[#1C2526] text-lg">{t('admin.qrTitle')}</h3>
              <p className="text-xs text-gray-400">{t('admin.qrDesc')}</p>
            </div>

            {/* QR Mock */}
            <div className="bg-[#F8F6F2] p-4 rounded-2xl border border-gray-100 flex justify-center">
              <div className="w-40 h-40 bg-white border border-gray-200 flex flex-wrap items-center justify-center p-2">
                {/* Visual grid representing QR Code */}
                <div className="grid grid-cols-5 gap-1.5 w-full h-full">
                  {[...Array(25)].map((_, i) => (
                    <div key={i} className={`rounded-sm ${i % 3 === 0 || i % 7 === 0 ? 'bg-[#1C2526]' : 'bg-white'}`} />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] text-gray-400 text-center font-semibold">{t('admin.qrManual')}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowTwoFAModal(false)}
                  className="w-1/2 py-2 border border-gray-200 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={confirm2FA}
                  className="w-1/2 py-2 gradient-bg text-white font-bold text-xs rounded-xl hover:opacity-95 shadow transition-colors"
                >
                  {t('admin.verifyEnable')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAO DU AN MODAL */}
      {assigningLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-gray-100 shadow-2xl space-y-6 animate-scaleUp">
            <div className="text-center space-y-2">
              <h3 className="font-bold text-[#1C2526] text-lg">
                {i18n.language === 'vi' ? 'Tạo Dự Án Từ Đơn Hàng' : 'Create Project from Order'}
              </h3>
              <p className="text-xs text-gray-400">
                {i18n.language === 'vi' ? 'Chuyển yêu cầu dịch vụ của khách hàng thành dự án mới.' : 'Convert client request into a new active project.'}
              </p>
            </div>

            {/* Info details */}
            <div className="bg-[#F8F6F2] p-4 rounded-2xl border border-gray-100 space-y-2 text-xs">
              <p className="font-bold text-[#1C2526]">{assigningLead.company || 'Client Organization'}</p>
              <div className="grid grid-cols-2 gap-2 text-gray-500">
                <p><span className="font-semibold text-gray-700">{i18n.language === 'vi' ? 'Khách hàng' : 'Client'}:</span> {assigningLead.name}</p>
                <p><span className="font-semibold text-gray-700">{i18n.language === 'vi' ? 'Dịch vụ' : 'Service'}:</span> {t(`services.list.${assigningLead.service}.title`, assigningLead.service)}</p>
              </div>
              <div className="h-px bg-gray-200" />
              <p className="text-gray-400 italic text-[11px] leading-relaxed">
                "{assigningLead.message}"
              </p>
            </div>

            <form onSubmit={handleAssignLead} className="space-y-4">
              {/* Price Details */}
              {role !== 'manager' && (
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#1C2526] uppercase">
                    {i18n.language === 'vi' ? 'Giá trị Hợp đồng ($) *' : 'Contract Value ($) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={assignContractValue}
                    onChange={(e) => setAssignContractValue(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#F8F6F2]/60 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C]"
                  />
                </div>
              )}

              {/* Deadline */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[#1C2526] uppercase">
                  {i18n.language === 'vi' ? 'Hạn bàn giao (Deadline) *' : 'Project Deadline *'}
                </label>
                <input
                  type="date"
                  required
                  value={assignDeadline}
                  onChange={(e) => setAssignDeadline(e.target.value)}
                  className="w-full bg-[#F8F6F2]/60 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C] text-[#1C2526] font-semibold"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssigningLead(null)}
                  className="w-1/2 py-2.5 border border-gray-200 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 gradient-bg text-white font-bold text-xs rounded-xl hover:opacity-95 shadow transition-all cursor-pointer"
                >
                  {i18n.language === 'vi' ? 'Tạo Dự Án' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. SALES PAYOUT MODAL */}
      {showAddSalesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-gray-100 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-[#1C2526] text-lg">Tạo Yêu Cầu Thanh Toán Cho Sale</h3>
                <p className="text-xs text-gray-400">Điền thông tin hoa hồng chốt hợp đồng dự án của Sale.</p>
              </div>
              <button onClick={() => setShowAddSalesModal(false)} className="text-gray-400 hover:text-black text-xl">
                <i className="ri-close-line" />
              </button>
            </div>

            <form onSubmit={handleAddSalesPayoutSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#1C2526] uppercase">Tên Sale *</label>
                  <input
                    type="text"
                    required
                    placeholder="vd: Nguyễn Văn Nam"
                    value={saleNameInput}
                    onChange={(e) => setSaleNameInput(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#1C2526] uppercase">Email Sale *</label>
                  <input
                    type="email"
                    required
                    placeholder="nam@alvinai.vn"
                    value={saleEmailInput}
                    onChange={(e) => setSaleEmailInput(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#1C2526] uppercase">Số điện thoại *</label>
                  <input
                    type="text"
                    required
                    placeholder="0988123456"
                    value={salePhoneInput}
                    onChange={(e) => setSalePhoneInput(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#1C2526] uppercase">Tên Dự Án *</label>
                  <input
                    type="text"
                    required
                    placeholder="vd: Cosmetics Co. Website"
                    value={saleProjectInput}
                    onChange={(e) => setSaleProjectInput(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#1C2526] uppercase">Giá trị Hợp đồng (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={saleContractValueInput}
                    onChange={(e) => setSaleContractValueInput(parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#1C2526] uppercase">Tỷ lệ Hoa Hồng (%) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    value={saleCommissionRateInput}
                    onChange={(e) => setSaleCommissionRateInput(parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                  />
                </div>
              </div>

              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium">Số tiền hoa hồng tính toán:</span>
                <span className="font-black text-[#9B2A4C] text-sm">
                  {Math.round(saleContractValueInput * (saleCommissionRateInput / 100)).toLocaleString('vi-VN')} VNĐ
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[#1C2526] uppercase">Thông tin tài khoản ngân hàng *</label>
                <input
                  type="text"
                  required
                  placeholder="vd: MBBank: 0376960193 - NGUYEN VAN A"
                  value={saleBankInfoInput}
                  onChange={(e) => setSaleBankInfoInput(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[#1C2526] uppercase">Ghi chú</label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú chi tiết hợp đồng..."
                  value={saleNoteInput}
                  onChange={(e) => setSaleNoteInput(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#9B2A4C] resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSalesModal(false)}
                  className="w-1/2 py-2.5 border border-gray-200 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#9B2A4C] text-white font-bold text-xs rounded-xl hover:bg-[#80223e] shadow"
                >
                  Tạo Yêu Cầu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. POST PROMPT MODAL (WITH IMAGE UPLOAD) */}
      {showAddPromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full border border-gray-100 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-[#1C2526] text-lg">
                  {editingPromptId ? 'Chỉnh Sửa Bài Prompt' : 'Đăng Bài Prompt Mới (Chữ & Hình Ảnh)'}
                </h3>
                <p className="text-xs text-gray-400">Điền thông tin bộ câu lệnh AI và tải ảnh minh họa nếu có.</p>
              </div>
              <button onClick={() => setShowAddPromptModal(false)} className="text-gray-400 hover:text-black text-xl">
                <i className="ri-close-line" />
              </button>
            </div>

            <form onSubmit={handleSavePromptSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[#1C2526] uppercase">Tiêu đề Prompt *</label>
                <input
                  type="text"
                  required
                  placeholder="vd: Kịch Bản Video Ads 5 Góc Nhìn Đột Phá"
                  value={promptTitleInput}
                  onChange={(e) => setPromptTitleInput(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#1C2526] uppercase">Danh mục *</label>
                  <CustomSelect
                    value={promptCategoryInput}
                    onChange={(val: any) => setPromptCategoryInput(val)}
                    options={[
                      { value: 'Marketing & Sales', label: 'Marketing & Sales' },
                      { value: 'Content & Social', label: 'Content & Social' },
                      { value: 'AI Automation', label: 'AI Automation' },
                      { value: 'SEO & Copywriting', label: 'SEO & Copywriting' },
                      { value: 'Consulting & Code', label: 'Consulting & Code' },
                    ]}
                    selectClassName="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 cursor-pointer"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#1C2526] uppercase">Model AI Tối Ưu *</label>
                  <CustomSelect
                    value={promptModelInput}
                    onChange={(val: any) => setPromptModelInput(val)}
                    options={[
                      { value: 'ChatGPT 4o', label: 'ChatGPT 4o' },
                      { value: 'Claude 3.5 Sonnet', label: 'Claude 3.5 Sonnet' },
                      { value: 'DeepSeek R1', label: 'DeepSeek R1' },
                      { value: 'Midjourney v7', label: 'Midjourney v7' },
                    ]}
                    selectClassName="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 cursor-pointer"
                  />
                </div>
              </div>

              {/* IMAGE UPLOAD & IMAGE URL SECTION */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                <label className="block text-[10px] font-bold text-[#1C2526] uppercase flex items-center justify-between">
                  <span>Hình Ảnh Minh Họa (Chèn File Ảnh hoặc Đường Dẫn URL)</span>
                  <span className="text-gray-400 font-normal">Optional</span>
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-gray-500 font-medium block mb-1">Tải ảnh từ máy tính:</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePromptImageFileChange}
                      className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#9B2A4C] file:text-white hover:file:opacity-90 cursor-pointer"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-medium block mb-1">Hoặc dán Link URL ảnh:</span>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={promptImageUrlInput}
                      onChange={(e) => setPromptImageUrlInput(e.target.value)}
                      className="w-full border border-gray-200 bg-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#9B2A4C]"
                    />
                  </div>
                </div>

                {promptImageUrlInput && (
                  <div className="relative w-full h-36 rounded-xl overflow-hidden border border-gray-200 mt-2">
                    <img src={promptImageUrlInput} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPromptImageUrlInput('')}
                      className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      <i className="ri-close-line" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[#1C2526] uppercase">Tóm tắt ngắn *</label>
                <input
                  type="text"
                  required
                  placeholder="Mô tả công dụng 1-2 câu ngắn gọn..."
                  value={promptSummaryInput}
                  onChange={(e) => setPromptSummaryInput(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#1C2526] uppercase">System Prompt *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="You are a World-Class Copywriter..."
                    value={promptSystemPromptInput}
                    onChange={(e) => setPromptSystemPromptInput(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:border-[#9B2A4C] resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#1C2526] uppercase">User Prompt *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Hãy lập 5 kịch bản video bán hàng cho: [Tên sản phẩm]..."
                    value={promptUserPromptInput}
                    onChange={(e) => setPromptUserPromptInput(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:border-[#9B2A4C] resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#1C2526] uppercase">Mẫu kết quả đầu ra</label>
                  <textarea
                    rows={3}
                    placeholder="🎬 Kịch bản 1: ..."
                    value={promptExampleOutputInput}
                    onChange={(e) => setPromptExampleOutputInput(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:border-[#9B2A4C] resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#1C2526] uppercase">Hướng dẫn sử dụng</label>
                  <textarea
                    rows={3}
                    placeholder="Thay thế các biến trong ngoặc vuông [Product] trước khi gửi AI..."
                    value={promptUsageGuideInput}
                    onChange={(e) => setPromptUsageGuideInput(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#9B2A4C] resize-none"
                  />
                </div>
              </div>

              {/* Dynamic Variables Manager */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-[#1C2526] uppercase">Các biến đầu vào [Variable]</label>
                  <button
                    type="button"
                    onClick={() => setPromptVariablesInput([...promptVariablesInput, { name: '', label: '', placeholder: '' }])}
                    className="text-[10px] font-bold text-[#9B2A4C] hover:underline"
                  >
                    + Thêm biến
                  </button>
                </div>
                {promptVariablesInput.map((v, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="key (product)"
                      value={v.name}
                      onChange={(e) => {
                        const next = [...promptVariablesInput];
                        next[idx].name = e.target.value;
                        setPromptVariablesInput(next);
                      }}
                      className="w-1/3 border border-gray-200 rounded-lg px-2.5 py-1 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Label (Tên sản phẩm)"
                      value={v.label}
                      onChange={(e) => {
                        const next = [...promptVariablesInput];
                        next[idx].label = e.target.value;
                        setPromptVariablesInput(next);
                      }}
                      className="w-1/3 border border-gray-200 rounded-lg px-2.5 py-1 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Placeholder (vd: Khóa học AI)"
                      value={v.placeholder}
                      onChange={(e) => {
                        const next = [...promptVariablesInput];
                        next[idx].placeholder = e.target.value;
                        setPromptVariablesInput(next);
                      }}
                      className="w-1/3 border border-gray-200 rounded-lg px-2.5 py-1 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setPromptVariablesInput(promptVariablesInput.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <i className="ri-close-line" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddPromptModal(false)}
                  className="w-1/2 py-2.5 border border-gray-200 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#9B2A4C] text-white font-bold text-xs rounded-xl hover:bg-[#80223e] shadow"
                >
                  {editingPromptId ? 'Cập Nhật Prompt' : 'Lưu & Đăng Bài Prompt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. POST PROJECT MODAL (WITH IMAGE UPLOAD) */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full border border-gray-100 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-[#1C2526] text-lg">
                  {editingProjectId ? 'Chỉnh Sửa Project Showcase' : 'Đăng Project Mới (Chữ & Hình Ảnh)'}
                </h3>
                <p className="text-xs text-gray-400">Đăng sản phẩm mẫu thực chiến lên trang Portfolio.</p>
              </div>
              <button onClick={() => setShowAddProjectModal(false)} className="text-gray-400 hover:text-black text-xl">
                <i className="ri-close-line" />
              </button>
            </div>

            <form onSubmit={handleSaveProjectSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[#1C2526] uppercase">Tên Dự Án / Sản Phẩm Mẫu *</label>
                <input
                  type="text"
                  required
                  placeholder="vd: Cosmetics Co. — Website Mỹ Phẩm & Skincare"
                  value={projTitleInput}
                  onChange={(e) => setProjTitleInput(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#1C2526] uppercase">Danh Mục Ngành *</label>
                  <CustomSelect
                    value={projCatIdInput}
                    onChange={(val: any) => {
                      setProjCatIdInput(val);
                      const catNames: Record<string, string> = {
                        'my-pham': 'Mỹ phẩm & Skincare',
                        'bat-dong-san': 'Bất động sản',
                        'doanh-nghiep': 'Doanh nghiệp & AI',
                        'spa': 'Spa & Thẩm mỹ',
                        'nha-hang': 'Nhà hàng & F&B',
                        'giao-duc': 'Giáo dục & Khóa học',
                      };
                      setProjCatNameInput(catNames[val] || 'Khác');
                    }}
                    options={[
                      { value: 'my-pham', label: 'Mỹ phẩm & Skincare' },
                      { value: 'bat-dong-san', label: 'Bất động sản' },
                      { value: 'doanh-nghiep', label: 'Doanh nghiệp & AI' },
                      { value: 'spa', label: 'Spa & Thẩm mỹ' },
                      { value: 'nha-hang', label: 'Nhà hàng & F&B' },
                      { value: 'giao-duc', label: 'Giáo dục & Khóa học' },
                    ]}
                    selectClassName="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 cursor-pointer"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#1C2526] uppercase">Badge Loại Sản Phẩm *</label>
                  <CustomSelect
                    value={projBadgeInput}
                    onChange={(val: any) => setProjBadgeInput(val)}
                    options={[
                      { value: 'Website', label: 'Website' },
                      { value: 'E-Commerce', label: 'E-Commerce' },
                      { value: 'Web App', label: 'Web App' },
                      { value: 'Landing Page', label: 'Landing Page' },
                    ]}
                    selectClassName="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 cursor-pointer"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#1C2526] uppercase">Giá Tham Khảo (VNĐ) *</label>
                  <input
                    type="text"
                    required
                    placeholder="3.500.000"
                    value={projPriceInput}
                    onChange={(e) => setProjPriceInput(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                  />
                </div>
              </div>

              {/* IMAGE UPLOAD & IMAGE URL SECTION */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                <label className="block text-[10px] font-bold text-[#1C2526] uppercase flex items-center justify-between">
                  <span>Hình Ảnh Giao Diện Sản Phẩm (Tải File Ảnh hoặc Đường Dẫn URL) *</span>
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-gray-500 font-medium block mb-1">Tải ảnh từ máy tính:</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProjectImageFileChange}
                      className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1C2526] file:text-white hover:file:opacity-90 cursor-pointer"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-medium block mb-1">Hoặc dán Link URL ảnh:</span>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={projImgInput}
                      onChange={(e) => setProjImgInput(e.target.value)}
                      className="w-full border border-gray-200 bg-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#9B2A4C]"
                    />
                  </div>
                </div>

                {projImgInput && (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200 mt-2">
                    <img src={projImgInput} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setProjImgInput('')}
                      className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      <i className="ri-close-line" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[#1C2526] uppercase">Mô tả tính năng nổi bật *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tối ưu phễu đặt hàng nhanh, tích hợp giỏ hàng & Zalo ZNS tự động..."
                  value={projDescInput}
                  onChange={(e) => setProjDescInput(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#9B2A4C] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#1C2526] uppercase">Tech Stack Tags (phẩy)</label>
                  <input
                    type="text"
                    placeholder="React 19, Next.js, TailwindCSS"
                    value={projTagsInput}
                    onChange={(e) => setProjTagsInput(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#1C2526] uppercase">Thời Gian Bàn Giao</label>
                  <input
                    type="text"
                    placeholder="24h - 48h"
                    value={projDeliveryInput}
                    onChange={(e) => setProjDeliveryInput(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[#1C2526] uppercase">Demo URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={projDemoUrlInput}
                    onChange={(e) => setProjDemoUrlInput(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="w-1/2 py-2.5 border border-gray-200 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#1C2526] text-white font-bold text-xs rounded-xl hover:bg-slate-800 shadow"
                >
                  {editingProjectId ? 'Cập Nhật Project' : 'Lưu & Đăng Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. CONTACT LEAD DETAIL & QUICK DIRECT REACH OUT MODAL */}
      {selectedContactLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-gray-100 shadow-2xl space-y-6">
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-[#1C2526] text-lg">Chi Tiết Liên Hệ Khách Hàng</h3>
                <p className="text-xs text-gray-400">Xem tin nhắn và kết nối trực tiếp 1-click với khách hàng.</p>
              </div>
              <button onClick={() => setSelectedContactLead(null)} className="text-gray-400 hover:text-black text-xl">
                <i className="ri-close-line" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-2xl space-y-2 border border-gray-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Họ tên:</span>
                  <span className="font-bold text-[#1C2526]">{selectedContactLead.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="font-semibold text-gray-700">{selectedContactLead.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Số điện thoại:</span>
                  <span className="font-semibold text-gray-700">{selectedContactLead.phone}</span>
                </div>
                {selectedContactLead.company && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Công ty:</span>
                    <span className="font-semibold text-[#9B2A4C]">{selectedContactLead.company}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Dịch vụ yêu cầu:</span>
                  <span className="font-bold uppercase text-gray-800">{selectedContactLead.service}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[#1C2526] uppercase">Nội dung tin nhắn:</label>
                <div className="p-4 rounded-2xl bg-[#0E1524] text-gray-200 text-xs font-sans border border-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedContactLead.message}
                </div>
              </div>

              {/* Direct Action Links */}
              <div className="space-y-2 pt-2">
                <label className="block text-[10px] font-bold text-[#9B2A4C] uppercase">Tiếp Cận Trực Tiếp Ngay:</label>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(selectedContactLead.email)}&su=${encodeURIComponent('Phản hồi liên hệ từ Alvin AI Mastery')}&body=${encodeURIComponent(`Chào ${selectedContactLead.name},\n\nCảm ơn bạn đã liên hệ với Alvin AI Mastery...`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold text-xs flex flex-col items-center gap-1 transition-all"
                  >
                    <i className="ri-mail-fill text-lg" />
                    <span>Gmail Web</span>
                  </a>
                  <a
                    href={`https://wa.me/${selectedContactLead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Chào ${selectedContactLead.name}, tôi liên hệ từ Alvin AI Mastery.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl font-bold text-xs flex flex-col items-center gap-1 transition-all"
                  >
                    <i className="ri-whatsapp-fill text-lg" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`https://t.me/+${selectedContactLead.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-xl font-bold text-xs flex flex-col items-center gap-1 transition-all"
                  >
                    <i className="ri-telegram-fill text-lg" />
                    <span>Telegram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}



    </div>
  );
}
