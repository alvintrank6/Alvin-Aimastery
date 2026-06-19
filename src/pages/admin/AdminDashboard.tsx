import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { useToast } from '@/components/common/ToastContext';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  User, Lead, Developer, Project, PayoutRequest,
  TrafficMetric, CampaignAlert, FinanceLog
} from '@/utils/db';
import { api, LeadsAPI, DevelopersAPI, UsersAPI, ProjectsAPI, PayoutsAPI, AnalyticsAPI, SettingsAPI } from '@/utils/api';
import CustomSelect from '@/components/common/Select';
import { io } from 'socket.io-client';

const COLORS = ['#2C3E50', '#9B2A4C', '#A8B5A0', '#D97706', '#2563EB'];

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
  const [developers, setDevelopers] = useState<Developer[]>([]);
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
  const [userRoleFilter, setUserRoleFilter] = useState<'All' | 'admin' | 'manager' | 'client' | 'developer'>('All');
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadCompany, setNewLeadCompany] = useState('');
  const [newLeadService, setNewLeadService] = useState('web');
  const [newLeadMessage, setNewLeadMessage] = useState('');

  // Form states
  const [activeTab, setActiveTab] = useState<'marketing' | 'finance' | 'crm' | 'projects_management' | 'payouts' | 'accounts' | 'security'>('marketing');
  const [activeProjectSubTab, setActiveProjectSubTab] = useState<'progress' | 'assign'>('progress');
  const [activeKanbanStatus, setActiveKanbanStatus] = useState<'New' | 'In Progress' | 'Client Review' | 'Completed'>('New');

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
  const [assigneeDeveloperId, setAssigneeDeveloperId] = useState('Unassigned');
  const [assignContractValue, setAssignContractValue] = useState<number>(1500);
  const [assignOutsourceFee, setAssignOutsourceFee] = useState<number>(600);
  const [assignDeadline, setAssignDeadline] = useState('2026-07-01');

  const handleAssignLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningLead) return;

    const assignedDeveloper = developers.find(f => f.id === assigneeDeveloperId);
    const assigneeName = assignedDeveloper ? assignedDeveloper.name : 'None';

    await ProjectsAPI.create({
      name: `${assigningLead.company || 'Client'} - ${t(`services.list.${assigningLead.service}.title`, assigningLead.service)}`,
      clientName: assigningLead.name,
      clientEmail: assigningLead.email,
      service: assigningLead.service,
      status: 'New',
      assigneeId: assigneeDeveloperId,
      assigneeName,
      deadline: assignDeadline,
      brief: assigningLead.message,
      contractValue: role === 'manager' ? 0 : assignContractValue,
      outsourceFee: role === 'manager' ? 0 : assignOutsourceFee,
      taxRate,
      subTasks: JSON.stringify([])
    });

    await LeadsAPI.update(assigningLead.id, { status: 'Qualified' });

    setAssigningLead(null);
    setAssigneeDeveloperId('Unassigned');
    setAssignContractValue(1500);
    setAssignOutsourceFee(600);
    showToast(
      i18n.language === 'vi' ? 'Đã giao việc cho Developer thành công!' : 'Task successfully assigned to Developer!',
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
    socket.on('developers-updated', async () => {
      const updatedDevelopers = await DevelopersAPI.getAll();
      setDevelopers(prevDevelopers => {
        if (prevDevelopers.length > 0) {
          const newDevelopers = updatedDevelopers.filter(uf => !prevDevelopers.some(pf => pf.id === uf.id));
          newDevelopers.forEach(latestDeveloper => {
            showToast(
              i18n.language === 'vi'
                ? `Ứng viên mới: ${latestDeveloper.name} ứng tuyển ${t(`developer.titles.${latestDeveloper.title}`, latestDeveloper.title || 'Developer')}!`
                : `New Candidate: ${latestDeveloper.name} applied for ${t(`developer.titles.${latestDeveloper.title}`, latestDeveloper.title || 'Developer')}!`,
              'success'
            );
          });
        }
        return updatedDevelopers;
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
    setLeads(await LeadsAPI.getAll());
    setDevelopers(await DevelopersAPI.getAll());
    setUsers(await UsersAPI.getAll());
    setProjects(await ProjectsAPI.getAll());
    setPayouts(await PayoutsAPI.getAll());
    setTrafficData(await AnalyticsAPI.getTraffic(trafficFilter));
    setAlerts(await AnalyticsAPI.getAlerts());
    setFinanceData(await AnalyticsAPI.getFinance());
    setTaxRate(await SettingsAPI.get('taxRate') || 10);
    setTwoFA(await SettingsAPI.get('twoFA') || false);
  };

  // Resolve campaign alert
  const handleResolveAlert = async (id: string) => {
    await AnalyticsAPI.updateAlert(id, { status: 'resolved' });
    await loadData();
  };

  // Approve developer application
  const handleApproveDeveloper = async (id: string, approve: boolean) => {
    await DevelopersAPI.update(id, { status: approve ? 'Approved' : 'Rejected' });
    await loadData();
  };

  // Change user role and auto-create developer profile if needed
  const handleRoleChange = async (userId: string, newRole: 'admin' | 'manager' | 'client' | 'developer') => {
    try {
      const userObj = users.find(u => u.id === userId);
      if (!userObj) return;

      await UsersAPI.update(userId, { role: newRole });

      if (newRole === 'developer') {
        const devProfile = developers.find(d => d.email === userObj.email || d.id === userId);
        if (!devProfile) {
          await DevelopersAPI.create({
            email: userObj.email,
            name: userObj.name || 'Developer',
            skills: [],
            rateType: 'hourly',
            rateValue: 0,
            status: 'Approved',
            title: 'Developer'
          });
        }
      }

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
    const assignedDeveloper = developers.find(f => f.id === assigneeId);
    const assigneeName = assignedDeveloper ? assignedDeveloper.name : 'None';

    await ProjectsAPI.create({
      name: taskName,
      clientName,
      clientEmail,
      service: taskService,
      status: 'New',
      assigneeId,
      assigneeName,
      deadline,
      brief: taskBrief,
      contractValue: role === 'manager' ? 0 : contractValue,
      outsourceFee: role === 'manager' ? 0 : outsourceFee,
      taxRate
    });

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

    let csvContent = "data:text/csv;charset=utf-8,ID,Developer,Amount,Tax Deducted,Net Payout,Date\n";
    pending.forEach(p => {
      csvContent += `${p.id},${p.developerName},${p.amount},${p.taxDeducted},${p.netAmount},${p.date}\n`;
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
      type: 'lead' | 'developer';
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

    developers.forEach(f => {
      list.push({
        id: `developer-${f.id}`,
        title: i18n.language === 'vi' ? 'Ứng tuyển Developer mới' : 'New Developer Application',
        desc: i18n.language === 'vi'
          ? `${f.name} đã ứng tuyển vị trí ${t(`developer.titles.${f.title}`, f.title || 'Developer')}`
          : `${f.name} applied for ${t(`developer.titles.${f.title}`, f.title || 'Developer')}`,
        time: new Date(f.createdAt || f.date),
        type: 'developer',
        targetTab: 'payouts',
        item: f
      });
    });

    // Sort by time descending
    return list.sort((a, b) => b.time.getTime() - a.time.getTime());
  }, [leads, developers, i18n.language, t]);

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

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: '#F8F6F2' }}>
      <Navbar />

      <main className="pt-24 pb-16 flex-grow max-w-7xl mx-auto px-4 md:px-6 w-full">
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
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${role === 'admin' ? 'bg-[#9B2A4C]/10 text-[#9B2A4C]' : 'bg-[#2C3E50]/10 text-[#2C3E50]'}`}>
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
                                      : 'bg-blue-50 text-blue-600'
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
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 text-xl">
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
                  onClick={() => setActiveTab('marketing')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-3 cursor-pointer border-l-4 ${activeTab === 'marketing' ? 'border-[#9B2A4C] text-[#9B2A4C] bg-[#9B2A4C]/5' : 'border-transparent text-[#5A6A72] hover:bg-gray-50/50'
                    }`}
                >
                  <i className="ri-line-chart-line text-base" />
                  {t('admin.trafficAnalytics')}
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
                  onClick={() => setActiveTab('crm')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-3 cursor-pointer border-l-4 ${activeTab === 'crm' ? 'border-[#9B2A4C] text-[#9B2A4C] bg-[#9B2A4C]/5' : 'border-transparent text-[#5A6A72] hover:bg-gray-50/50'
                    }`}
                >
                  <i className="ri-file-list-3-line text-base" />
                  {t('admin.crmManagement')}
                </button>
                <button
                  onClick={() => setActiveTab('projects_management')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-3 cursor-pointer border-l-4 ${activeTab === 'projects_management' ? 'border-[#9B2A4C] text-[#9B2A4C] bg-[#9B2A4C]/5' : 'border-transparent text-[#5A6A72] hover:bg-gray-50/50'
                    }`}
                >
                  <i className="ri-folder-shield-2-line text-base" />
                  {i18n.language === 'vi' ? 'Quản Lý Dự Án' : 'Projects Management'}
                </button>
                <button
                  onClick={() => setActiveTab('payouts')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-between cursor-pointer border-l-4 ${activeTab === 'payouts' ? 'border-[#9B2A4C] text-[#9B2A4C] bg-[#9B2A4C]/5' : 'border-transparent text-[#5A6A72] hover:bg-gray-50/50'
                    }`}
                >
                  <span className="flex items-center gap-3">
                    <i className="ri-wallet-3-line text-base" />
                    {t('admin.outsourcePayouts')}
                  </span>
                  {payouts.filter(p => p.status === 'Pending').length > 0 && (
                    <span className="bg-[#9B2A4C] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                      {payouts.filter(p => p.status === 'Pending').length}
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
                  {developers.filter(f => f.status === 'Pending').length > 0 && (
                    <span className="bg-yellow-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                      {developers.filter(f => f.status === 'Pending').length}
                    </span>
                  )}
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
                          <Line type="monotone" dataKey="organic" stroke="#2C3E50" name="SEO Organic" strokeWidth={1.5} />
                          <Line type="monotone" dataKey="facebook" stroke="#2563EB" name="Facebook" strokeWidth={1.5} />
                          <Line type="monotone" dataKey="tiktok" stroke="#D97706" name="TikTok" strokeWidth={1.5} />
                          <Line type="monotone" dataKey="youtube" stroke="#EF4444" name="YouTube" strokeWidth={1.5} />
                          <Line type="monotone" dataKey="direct" stroke="#10B981" name="Browser" strokeWidth={1.5} />
                        </LineChart>
                      </ResponsiveContainer>
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

                      {/* Campaign Alerts */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-[#1C2526] text-sm">{t('admin.alertsTitle')}</h4>
                        <div className="space-y-3">
                          {alerts.map(alert => (
                            <div
                              key={alert.id}
                              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${alert.status === 'active'
                                  ? 'bg-red-50/50 border-red-100'
                                  : 'bg-gray-50/50 border-gray-100 opacity-60'
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${alert.platform === 'TikTok' ? 'bg-black text-white' : 'bg-blue-100 text-blue-600'
                                  }`}>
                                  <i className={`ri-${alert.platform.toLowerCase()}-fill`} />
                                </span>
                                <div>
                                  <p className="text-xs font-bold text-[#1C2526]">{alert.campaignName}</p>
                                  <p className="text-[10px] text-gray-400">
                                    {t('admin.engagementDrop')}
                                    <span className="font-semibold text-red-500">-{alert.engagementDrop}%</span>
                                  </p>
                                </div>
                              </div>
                              {alert.status === 'active' ? (
                                <button
                                  onClick={() => handleResolveAlert(alert.id)}
                                  className="px-3 py-1 bg-[#2C3E50] text-white text-[10px] font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                                >
                                  {t('admin.resolve')}
                                </button>
                              ) : (
                                <span className="text-[10px] font-bold text-green-500 flex items-center gap-0.5">
                                  <i className="ri-checkbox-circle-line" />
                                  Resolved
                                </span>
                              )}
                            </div>
                          ))}
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
                            className="flex items-center gap-1 px-3 py-1.5 bg-[#2C3E50] hover:bg-slate-800 text-white text-[10px] font-bold rounded-xl cursor-pointer transition-colors shadow-sm"
                          >
                            <i className="ri-file-download-line text-sm" />
                            {i18n.language === 'vi' ? 'Xuất Excel (CSV)' : 'Export Excel (CSV)'}
                          </button>
                          <span className="text-[10px] text-[#2C3E50] font-semibold flex items-center gap-1.5 px-2.5 py-1.5 bg-[#2C3E50]/5 rounded-xl">
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
                            <Bar dataKey="outsourceCost" fill="#2C3E50" name="Outsource Expenses ($)" radius={[4, 4, 0, 0]} />
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
                          className="px-4 py-2 bg-[#2C3E50] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow hover:opacity-95 transition-opacity cursor-pointer"
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
                                          setAssigneeDeveloperId(developers.filter(f => f.status === 'Approved')[0]?.id || 'Unassigned');
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
                        {i18n.language === 'vi' ? 'Giao việc' : 'Assign Project'}
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
                            {i18n.language === 'vi' ? 'Sắp xếp và điều phối tiến độ công việc của developer trực quan theo từng trạng thái.' : t('admin.kanbanDesc')}
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
                                      status === 'In Progress' ? 'border-blue-500 text-blue-500 bg-blue-500/5' :
                                        status === 'Client Review' ? 'border-[#9B2A4C] text-[#9B2A4C] bg-[#9B2A4C]/5' :
                                          'border-green-500 text-green-500 bg-green-500/5'
                                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50/50'
                                  } rounded-t-xl`}
                              >
                                <span className={`w-2 h-2 rounded-full ${status === 'New' ? 'bg-[#D97706]' :
                                    status === 'In Progress' ? 'bg-blue-500' :
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
                                      status === 'In Progress' ? 'bg-blue-500/10 text-blue-500' :
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

                                        {/* Middle: Details Grid (Assignee, Deadline, Money) */}
                                        <div className="grid grid-cols-2 sm:flex sm:items-center gap-x-6 gap-y-3 text-[11px] text-[#5A6A72] shrink-0 w-full sm:w-auto">
                                          <div className="space-y-1 sm:min-w-[100px]">
                                            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                              {i18n.language === 'vi' ? 'Dev đảm nhận' : 'Developer'}
                                            </p>
                                            <div className="flex items-center gap-1.5 font-medium text-gray-750">
                                              <i className="ri-user-3-line text-[#8A97A0]" />
                                              <CustomSelect
                                                value={proj.assigneeId || 'Unassigned'}
                                                onChange={async (val) => {
                                                  const newAssigneeId = val;
                                                  const dev = developers.find(f => f.id === newAssigneeId);
                                                  const newAssigneeName = dev ? dev.name : 'None';
                                                  await ProjectsAPI.update(proj.id, {
                                                    ...proj,
                                                    assigneeId: newAssigneeId,
                                                    assigneeName: newAssigneeName
                                                  });
                                                  await loadData();
                                                  showToast(
                                                    i18n.language === 'vi'
                                                      ? 'Đã cập nhật người thực hiện dự án thành công!'
                                                      : 'Project assignee successfully updated!',
                                                    'success'
                                                  );
                                                }}
                                                options={[
                                                  { value: 'Unassigned', label: 'Unassigned' },
                                                  ...developers.filter(f => f.status === 'Approved' && f.name !== 'Developer').map(f => ({
                                                    value: f.id,
                                                    label: f.name
                                                  }))
                                                ]}
                                                selectClassName="bg-transparent border-none p-0 text-[11px] font-bold focus:outline-none cursor-pointer"
                                                className={`w-32 hover:text-[#9B2A4C] ${(proj.assigneeId || 'Unassigned') === 'Unassigned' ? 'text-gray-400' : 'text-gray-750'}`}
                                              />
                                            </div>
                                          </div>

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
                                                  background: proj.progress === 100 ? '#10B981' : 'linear-gradient(90deg, #9B2A4C, #2C3E50)'
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
                                            <span className="text-[9px] font-bold bg-[#2C3E50]/5 px-1.5 py-0.2 rounded text-gray-500">
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

                    {/* Sub-tab 2: Assign Task / Create Project */}
                    {activeProjectSubTab === 'assign' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-bold text-[#1C2526] text-lg">
                            {i18n.language === 'vi' ? 'Giao Việc & Tạo Dự Án Mới' : 'Assign Project & Create Task'}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {i18n.language === 'vi' ? 'Tạo dự án mới, giao việc cho developer và điền thù lao, deadline.' : 'Create a new project, assign to developer, contract value and outsource fee.'}
                          </p>
                        </div>

                        <form onSubmit={handleAddTask} className="space-y-5 pt-4 border-t border-gray-100">
                          <h4 className="font-bold text-xs text-[#1C2526] uppercase tracking-wide">
                            {t('admin.addTask')}
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

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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

                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-bold text-[#1C2526] uppercase">
                                {i18n.language === 'vi' ? 'Dev đảm nhận *' : 'Assign Developer *'}
                              </label>
                              <CustomSelect
                                value={assigneeId}
                                onChange={(val) => setAssigneeId(val)}
                                options={[
                                  { value: 'Unassigned', label: t('admin.kanbanForm.assignDeveloper') },
                                  ...developers.filter(f => f.status === 'Approved' && f.name !== 'Developer').map(f => ({
                                    value: f.id,
                                    label: f.name
                                  }))
                                ]}
                                selectClassName={`w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:border-[#9B2A4C] cursor-pointer ${
                                  assigneeId === 'Unassigned' ? 'text-gray-400 font-normal' : 'text-[#1C2526] font-semibold'
                                }`}
                              />
                            </div>

                            {role !== 'manager' && (
                              <>
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

                                <div className="space-y-1.5">
                                  <label className="block text-[10px] font-bold text-[#1C2526] uppercase">
                                    {i18n.language === 'vi' ? 'Thù lao cho Dev ($) *' : 'Developer Fee ($) *'}
                                  </label>
                                  <input
                                    type="number"
                                    required
                                    placeholder={t('admin.kanbanForm.outsourceFee')}
                                    value={outsourceFee}
                                    onChange={(e) => setOutsourceFee(parseInt(e.target.value) || 0)}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C]"
                                  />
                                </div>
                              </>
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
                            className="bg-[#2C3E50] text-white font-bold px-4.5 py-2.5 rounded-xl text-xs hover:bg-[#2C3E50]/90 transition-colors cursor-pointer"
                          >
                            {t('admin.createTaskBtn')}
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. PAYMENTS REQUEST */}
                {activeTab === 'payouts' && (
                  <div className="space-y-8 animate-fadeIn">
                    {role === 'manager' && (
                      <div className="pb-4 border-b border-gray-100">
                        <h3 className="font-bold text-[#1C2526] text-lg">
                          {i18n.language === 'vi' ? 'Phê Duyệt Lập Trình Viên' : 'Developer Approvals'}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {i18n.language === 'vi'
                            ? 'Xem xét và phê duyệt hồ sơ năng lực của các lập trình viên mới đăng ký.'
                            : 'Review and approve capacity profiles of newly registered developers.'}
                        </p>
                      </div>
                    )}

                    {role !== 'manager' && (
                      <>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
                          <div>
                            <h3 className="font-bold text-[#1C2526] text-lg">{t('admin.pendingPayments')}</h3>
                            <p className="text-xs text-gray-400">{t('admin.payoutDesc')}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleExportPayoutsCsv}
                              className="px-4 py-2 bg-[#2C3E50] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-[#2C3E50]/90 transition-colors cursor-pointer"
                            >
                              <i className="ri-file-download-line" />
                              {t('admin.exportPayouts')}
                            </button>
                          </div>
                        </div>

                        <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-gray-50 border-b border-gray-200 text-[#5A6A72] font-bold">
                                <th className="p-3">{t('admin.payoutHeaders.developerName')}</th>
                                <th className="p-3">{t('admin.payoutHeaders.projectInfo')}</th>
                                <th className="p-3 text-right">{t('admin.payoutHeaders.feeRate')}</th>
                                <th className="p-3 text-right">{t('admin.payoutHeaders.tax')} ({taxRate}%)</th>
                                <th className="p-3 text-right">{t('admin.payoutHeaders.netPayout')}</th>
                                <th className="p-3">{t('common.status')}</th>
                                <th className="p-3 text-center">{t('common.actions')}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                              {payouts.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50/50">
                                  <td className="p-3 font-semibold text-[#1C2526]">{p.developerName}</td>
                                  <td className="p-3 text-[10px] text-gray-500 max-w-xs truncate">{p.projectName}</td>
                                  <td className="p-3 text-right font-bold text-[#2C3E50]">${p.amount}</td>
                                  <td className="p-3 text-right text-red-500">-${p.taxDeducted}</td>
                                  <td className="p-3 text-right font-bold text-[#9B2A4C]">${p.netAmount}</td>
                                  <td className="p-3">
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${p.status === 'Paid'
                                        ? 'bg-green-50 text-green-600'
                                        : p.status === 'Approved'
                                          ? 'bg-blue-50 text-blue-600'
                                          : 'bg-yellow-50 text-yellow-600'
                                      }`}>
                                      {p.status === 'Paid' ? t('admin.paid') : p.status === 'Approved' ? t('admin.statusApproved') : t('admin.statusPending')}
                                    </span>
                                  </td>
                                  <td className="p-3 text-center space-x-2">
                                    {p.status === 'Pending' && (
                                      <button
                                        onClick={() => handleApprovePayout(p.id)}
                                        className="px-2.5 py-1 bg-[#2C3E50] text-white text-[9px] font-bold rounded hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
                                      >
                                        {t('admin.approve')}
                                      </button>
                                    )}
                                    {p.status === 'Approved' && (
                                      <button
                                        onClick={() => handleMarkPaid(p.id)}
                                        className="px-2.5 py-1 bg-green-500 text-white text-[9px] font-bold rounded hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
                                      >
                                        {t('admin.markPaidBtn')}
                                      </button>
                                    )}
                                    {p.status === 'Paid' && (
                                      <span className="text-[10px] text-gray-400 font-semibold">{t('admin.done')}</span>
                                    )}
                                  </td>
                                </tr>
                              ))}

                              {payouts.length === 0 && (
                                <tr>
                                  <td colSpan={7} className="p-6 text-center text-gray-400 italic">
                                    {t('admin.noPayoutRequests')}
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}

                    {/* Freelancer approvals pending list */}
                    <div className="space-y-4 pt-4">
                      <h4 className="font-bold text-xs text-[#1C2526] uppercase tracking-wide">
                        {t('admin.pendingDevelopers')}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {developers.filter(f => f.status === 'Pending').map(free => (
                          <div key={free.id} className="py-4 border-b border-gray-100 last:border-0 space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="text-xs font-bold text-[#1C2526]">{free.name}</h5>
                                <p className="text-[10px] text-gray-400">{free.email}</p>
                                {free.dateOfBirth && (
                                  <p className="text-[10px] text-[#5A6A72] mt-0.5">
                                    <span className="font-semibold">{t('developer.dobLabel')}:</span> {free.dateOfBirth}
                                  </p>
                                )}
                                {free.title && (
                                  <p className="text-[10px] font-bold text-[#9B2A4C] mt-0.5">
                                    {t(`developer.titles.${free.title}` as any, free.title)}{' '}
                                    {free.yearsOfExperience && (
                                      <span className="text-gray-400 font-normal">
                                        • {t(`developer.experience.${free.yearsOfExperience}` as any, free.yearsOfExperience)}
                                      </span>
                                    )}
                                  </p>
                                )}
                              </div>
                              <span className="text-[8px] font-bold bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded uppercase">
                                {t('admin.statusPending')}
                              </span>
                            </div>
                            <div className="text-[10px] space-y-1 text-gray-500">
                              {(!free.title && free.yearsOfExperience) && (
                                <p>
                                  <span className="font-semibold">{t('developer.yearsLabel')}:</span>{' '}
                                  {t(`developer.experience.${free.yearsOfExperience}` as any, free.yearsOfExperience)}
                                </p>
                              )}
                              <p><span className="font-semibold">{t('admin.skills')}:</span> {free.skills.join(', ')}</p>

                              {free.englishProficiency && (
                                <p>
                                  <span className="font-semibold">{t('developer.englishLabel')}:</span>{' '}
                                  {t(`developer.englishLevels.${free.englishProficiency}` as any, free.englishProficiency)}
                                </p>
                              )}

                              {free.availability && (
                                <p>
                                  <span className="font-semibold">{t('developer.availabilityLabel')}:</span>{' '}
                                  {t(`developer.availabilityOptions.${free.availability}` as any, free.availability)}
                                </p>
                              )}

                              <div className="flex flex-wrap gap-x-3 gap-y-1">
                                <p>
                                  <span className="font-semibold">{t('admin.portfolio')}:</span>{' '}
                                  <a href={free.portfolio} target="_blank" rel="noreferrer" className="text-[#9B2A4C] hover:underline truncate inline-block max-w-[130px] align-bottom">
                                    {free.portfolio}
                                  </a>
                                </p>
                                {free.cvLink && (
                                  <p>
                                    <span className="font-semibold">{t('developer.cvLabel').split(' ')[0] || 'CV'}:</span>{' '}
                                    <a href={free.cvLink} target="_blank" rel="noreferrer" className="text-[#9B2A4C] hover:underline truncate inline-block max-w-[130px] align-bottom font-bold">
                                      <i className="ri-attachment-line mr-0.5" />
                                      {i18n.language === 'vi' ? 'Xem CV' : 'View CV'}
                                    </a>
                                  </p>
                                )}
                              </div>

                              <p>
                                <span className="font-semibold">{t('admin.expectedRate')}:</span>{' '}
                                {role === 'manager' ? (
                                  <span className="text-gray-400 italic">
                                    {i18n.language === 'vi' ? 'Bị hạn chế' : 'Restricted'}
                                  </span>
                                ) : (
                                  i18n.language === 'vi'
                                    ? `${free.rateValue.toLocaleString('vi-VN')} vnđ ${free.rateType === 'hourly' ? t('admin.hourlyRate') : t('admin.fixedPrice')}`
                                    : `$${free.rateValue} ${free.rateType === 'hourly' ? t('admin.hourlyRate') : t('admin.fixedPrice')}`
                                )}
                              </p>

                              {free.shortBio && (
                                <div className="mt-2 pl-3 border-l-2 border-[#9B2A4C]/30 text-[10px] text-[#5A6A72] leading-relaxed italic">
                                  "{free.shortBio}"
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 justify-end pt-1">
                              <button
                                onClick={() => handleApproveDeveloper(free.id, false)}
                                className="px-2.5 py-1 border border-red-200 text-red-500 text-[10px] font-bold rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                {t('admin.decline')}
                              </button>
                              <button
                                onClick={() => handleApproveDeveloper(free.id, true)}
                                className="px-2.5 py-1 bg-green-500 text-white text-[10px] font-bold rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
                              >
                                {t('admin.approve')}
                              </button>
                            </div>
                          </div>
                        ))}

                        {developers.filter(f => f.status === 'Pending').length === 0 && (
                          <p className="text-xs text-gray-400 italic">{t('admin.noPendingDevelopers')}</p>
                        )}
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
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-lg">
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
                      <p className="font-bold text-[#2C3E50] flex items-center gap-1">
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
                            { value: 'developer', label: i18n.language === 'vi' ? 'Developer' : 'Developer' },
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
                              <th className="p-3">{i18n.language === 'vi' ? 'Thông tin Lập trình viên & Trạng thái' : 'Developer Profile & Status'}</th>
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
                                    <td colSpan={4} className="p-8 text-center text-gray-400 italic">
                                      {i18n.language === 'vi' ? 'Không tìm thấy tài khoản nào' : 'No accounts found'}
                                    </td>
                                  </tr>
                                );
                              }

                              return filtered.map((user, idx) => {
                                const isLast = idx === filtered.length - 1;
                                
                                // Find matched developer profile if role is 'developer'
                                const devProfile = user.role === 'developer' 
                                  ? developers.find(d => d.email === user.email || d.id === user.id)
                                  : null;

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
                                          { value: 'developer', label: i18n.language === 'vi' ? 'Developer' : 'Developer' },
                                          { value: 'client', label: i18n.language === 'vi' ? 'Tài khoản khách' : 'Client Account' }
                                        ]}
                                        selectClassName="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1 text-[11px] font-bold text-gray-700 focus:border-[#9B2A4C] cursor-pointer"
                                        className="w-36"
                                      />
                                    </td>

                                    {/* Developer Profile & Status */}
                                    <td className="p-3 space-y-1.5 max-w-sm">
                                      {user.role === 'developer' ? (
                                        devProfile ? (
                                          <div className="space-y-1.5">
                                            {/* Status Dropdown */}
                                            <div className="flex items-center gap-2">
                                              <span className="text-[10px] text-gray-400 font-semibold">
                                                {i18n.language === 'vi' ? 'Xét duyệt:' : 'Verification:'}
                                              </span>
                                              <CustomSelect
                                                value={devProfile.status}
                                                disabled={role === 'manager'}
                                                onChange={async (val: any) => {
                                                  await DevelopersAPI.update(devProfile.id, { status: val });
                                                  await loadData();
                                                  showToast(
                                                    i18n.language === 'vi' 
                                                      ? 'Cập nhật trạng thái lập trình viên thành công!' 
                                                      : 'Developer status updated!',
                                                    'success'
                                                  );
                                                }}
                                                options={[
                                                  { value: 'Pending', label: i18n.language === 'vi' ? 'Chờ duyệt' : 'Pending' },
                                                  { value: 'Approved', label: i18n.language === 'vi' ? 'Đã duyệt' : 'Approved' },
                                                  { value: 'Rejected', label: i18n.language === 'vi' ? 'Từ chối' : 'Rejected' }
                                                ]}
                                                selectClassName="bg-gray-50 border border-gray-200 rounded px-2 py-0.5 text-[10px] font-bold text-gray-700 focus:border-[#9B2A4C]"
                                                className="w-28"
                                              />
                                            </div>

                                            {/* Developer Details */}
                                            {devProfile.title && (
                                              <p className="font-bold text-[#9B2A4C] text-[10px]">
                                                {t(`developer.titles.${devProfile.title}` as any, devProfile.title)}
                                              </p>
                                            )}
                                            {devProfile.skills && devProfile.skills.length > 0 && (
                                              <div className="flex flex-wrap gap-1 mt-1">
                                                {devProfile.skills.map(s => (
                                                  <span key={s} className="text-[9px] font-semibold px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                                                    {s}
                                                  </span>
                                                ))}
                                              </div>
                                            )}
                                            <div className="text-[10px] text-gray-500 space-y-0.5">
                                              <p className="font-semibold text-[#2C3E50]">
                                                {i18n.language === 'vi' ? 'Mức lương:' : 'Rate:'}{' '}
                                                {i18n.language === 'vi'
                                                  ? `${devProfile.rateValue.toLocaleString('vi-VN')} vnđ`
                                                  : `$${devProfile.rateValue}`}{' '}
                                                <span className="text-[9px] text-gray-400 font-normal">
                                                  {devProfile.rateType === 'hourly' ? t('admin.hourlyRate') : t('admin.fixedPrice')}
                                                </span>
                                              </p>
                                              {devProfile.availability && (
                                                <p>
                                                  <span className="font-semibold">{i18n.language === 'vi' ? 'Khả dụng:' : 'Availability:'}</span>{' '}
                                                  {t(`developer.availabilityOptions.${devProfile.availability}` as any, devProfile.availability)}
                                                </p>
                                              )}
                                              {devProfile.englishProficiency && (
                                                <p>
                                                  <span className="font-semibold">{i18n.language === 'vi' ? 'Tiếng Anh:' : 'English:'}</span>{' '}
                                                  {t(`developer.englishLevels.${devProfile.englishProficiency}` as any, devProfile.englishProficiency)}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="text-yellow-600 text-[10px] bg-yellow-50 px-2 py-1 rounded border border-yellow-100 flex items-center gap-1.5">
                                            <i className="ri-alert-line text-xs" />
                                            <span>
                                              {i18n.language === 'vi' 
                                                ? 'Chưa khởi tạo hồ sơ Lập trình viên' 
                                                : 'Developer profile not initialized'}
                                            </span>
                                          </div>
                                        )
                                      ) : (
                                        <span className="text-gray-400">-</span>
                                      )}
                                    </td>

                                    {/* Actions */}
                                    <td className={`p-3 text-center pr-4 ${isLast ? 'rounded-br-2xl' : ''}`}>
                                      <div className="flex items-center justify-center gap-2">
                                        {/* CV and Portfolio for Developers */}
                                        {user.role === 'developer' && devProfile && (
                                          <>
                                            {devProfile.portfolio && (
                                              <a
                                                href={devProfile.portfolio}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-500 hover:text-blue-700 p-1 text-sm cursor-pointer"
                                                title={i18n.language === 'vi' ? 'Portfolio / Website' : 'Portfolio / Website'}
                                              >
                                                <i className="ri-external-link-line" />
                                              </a>
                                            )}
                                            {devProfile.cvLink && (
                                              <a
                                                href={devProfile.cvLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[#9B2A4C] hover:text-[#7A203A] p-1 text-sm cursor-pointer"
                                                title={i18n.language === 'vi' ? 'Xem hồ sơ CV' : 'View CV Link'}
                                              >
                                                <i className="ri-attachment-line" />
                                              </a>
                                            )}
                                          </>
                                        )}
                                        
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
                    ? `Bạn có chắc muốn xóa tài khoản "${userToDelete.name || userToDelete.email}"? Thao tác này sẽ gỡ hoàn toàn thông tin của họ khỏi hệ thống. Nếu tài khoản là Lập trình viên, hồ sơ chuyên môn của họ cũng sẽ bị xóa.`
                    : `Are you sure you want to delete user "${userToDelete.name || userToDelete.email}"? This action will permanently remove their records from the system. If they are a Developer, their profile details will also be deleted.`}
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
                    <div key={i} className={`rounded-sm ${i % 3 === 0 || i % 7 === 0 ? 'bg-[#2C3E50]' : 'bg-white'}`} />
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

      {/* GIAO VIEC MODAL */}
      {assigningLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-gray-100 shadow-2xl space-y-6 animate-scaleUp">
            <div className="text-center space-y-2">
              <h3 className="font-bold text-[#1C2526] text-lg">
                {i18n.language === 'vi' ? 'Giao Việc Cho Developer' : 'Assign Lead to Developer'}
              </h3>
              <p className="text-xs text-gray-400">
                {i18n.language === 'vi' ? 'Chuyển yêu cầu dịch vụ của khách hàng thành dự án cho Dev.' : 'Convert client request into an active project for a developer.'}
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
              {/* Select Assignee */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[#1C2526] uppercase">
                  {i18n.language === 'vi' ? 'Chọn Developer thực hiện *' : 'Assign Developer *'}
                </label>
                <CustomSelect
                  value={assigneeDeveloperId}
                  onChange={(val) => setAssigneeDeveloperId(val)}
                  options={[
                    { value: 'Unassigned', label: i18n.language === 'vi' ? 'Chọn Developer' : 'Select Developer' },
                    ...developers.filter(f => f.status === 'Approved' && f.name !== 'Developer').map(f => ({
                      value: f.id,
                      label: `${f.name} (${f.title || 'Developer'})`
                    }))
                  ]}
                  selectClassName={`w-full bg-[#F8F6F2]/60 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:border-[#9B2A4C] cursor-pointer ${
                    assigneeDeveloperId === 'Unassigned' ? 'text-gray-400 font-normal' : 'text-[#1C2526] font-semibold'
                  }`}
                />
              </div>

              {/* Price Details */}
              {role !== 'manager' && (
                <div className="grid grid-cols-2 gap-4">
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
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-[#1C2526] uppercase">
                      {i18n.language === 'vi' ? 'Thù lao cho Dev ($) *' : 'Developer Fee ($) *'}
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={assignOutsourceFee}
                      onChange={(e) => setAssignOutsourceFee(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#F8F6F2]/60 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C]"
                    />
                  </div>
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
                  disabled={assigneeDeveloperId === 'Unassigned'}
                  className="w-1/2 py-2.5 gradient-bg text-white font-bold text-xs rounded-xl hover:opacity-95 shadow disabled:opacity-50 transition-all cursor-pointer"
                >
                  {i18n.language === 'vi' ? 'Giao việc' : 'Assign Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      <Footer />
    </div>
  );
}
