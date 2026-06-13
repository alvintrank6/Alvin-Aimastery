import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  MockDB, Lead, Freelancer, Project, PayoutRequest,
  TrafficMetric, CampaignAlert, FinanceLog
} from '@/utils/db';

const COLORS = ['#2C3E50', '#9B2A4C', '#A8B5A0', '#D97706', '#2563EB'];

export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // RBAC Roles: 'admin' (Super Admin), 'manager' (Manager)
  const [role, setRole] = useState<'admin' | 'manager'>('admin');

  // DB States
  const [leads, setLeads] = useState<Lead[]>([]);
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [trafficData, setTrafficData] = useState<TrafficMetric[]>([]);
  const [alerts, setAlerts] = useState<CampaignAlert[]>([]);
  const [financeData, setFinanceData] = useState<FinanceLog[]>([]);

  // Settings
  const [taxRate, setTaxRate] = useState(10);
  const [twoFA, setTwoFA] = useState(false);
  const [showTwoFAModal, setShowTwoFAModal] = useState(false);

  // Form states
  const [activeTab, setActiveTab] = useState<'marketing' | 'finance' | 'crm' | 'kanban' | 'payouts' | 'security'>('marketing');

  // CRM manual entry
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadCompany, setNewLeadCompany] = useState('');
  const [newLeadService, setNewLeadService] = useState('Web Development');
  const [newLeadMessage, setNewLeadMessage] = useState('');

  // Kanban task assignment
  const [taskName, setTaskName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [taskService, setTaskService] = useState('Web Development');
  const [assigneeId, setAssigneeId] = useState('Unassigned');
  const [contractValue, setContractValue] = useState<number>(1500);
  const [outsourceFee, setOutsourceFee] = useState<number>(600);
  const [deadline, setDeadline] = useState('2026-07-01');
  const [taskBrief, setTaskBrief] = useState('');

  // Bulk CSV simulator message
  const [csvMessage, setCsvMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLeads(MockDB.getLeads());
    setFreelancers(MockDB.getFreelancers());
    setProjects(MockDB.getProjects());
    setPayouts(MockDB.getPayoutRequests());
    setTrafficData(MockDB.getTrafficMetrics());
    setAlerts(MockDB.getCampaignAlerts());
    setFinanceData(MockDB.getFinanceLogs());
    setTaxRate(MockDB.getTaxRate());
    setTwoFA(MockDB.get2FAEnabled());
  };

  // Resolve campaign alert
  const handleResolveAlert = (id: string) => {
    MockDB.resolveCampaignAlert(id);
    loadData();
  };

  // Approve freelance application
  const handleApproveFreelancer = (id: string, approve: boolean) => {
    if (role === 'manager') {
      alert('Security Denied: Manager role is restricted from approving outsource applications.');
      return;
    }
    MockDB.updateFreelancerStatus(id, approve ? 'Approved' : 'Rejected');
    loadData();
  };

  // Add customer lead manually
  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    MockDB.addLead({
      name: newLeadName,
      email: newLeadEmail,
      phone: newLeadPhone,
      company: newLeadCompany,
      service: newLeadService,
      message: newLeadMessage
    });
    loadData();
    // Reset inputs
    setNewLeadName('');
    setNewLeadEmail('');
    setNewLeadPhone('');
    setNewLeadCompany('');
    setNewLeadMessage('');
  };

  // Import mock CSV data
  const handleCsvImport = () => {
    const mockItems = [
      { name: 'David Miller', email: 'david@growfast.co', phone: '+12025550144', company: 'GrowFast Co', service: 'n8n Workflow Setup', message: 'Sync CRM leads to ActiveCampaign.' },
      { name: 'Sophia Chen', email: 'sophia@techasia.org', phone: '+6591234567', company: 'TechAsia', service: 'Custom App Development', message: 'Build cross-platform client app.' },
      { name: 'Minh Huy', email: 'huy.minh@vietnambrand.vn', phone: '0905556677', company: 'VN Brands', service: 'High-Converting Landings', message: 'Product landing page design.' }
    ];

    mockItems.forEach(item => {
      MockDB.addLead(item);
    });

    setCsvMessage('Successfully imported 3 mockup lead records from CSV simulator!');
    loadData();
    setTimeout(() => setCsvMessage(''), 4000);
  };

  // Add Kanban Project
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedFreelancer = freelancers.find(f => f.id === assigneeId);
    const assigneeName = assignedFreelancer ? assignedFreelancer.name : 'None';

    MockDB.addProject({
      name: taskName,
      clientName,
      clientEmail,
      service: taskService,
      status: 'New',
      assigneeId,
      assigneeName,
      deadline,
      brief: taskBrief,
      contractValue,
      outsourceFee,
      taxRate
    });

    loadData();
    // Reset Form
    setTaskName('');
    setClientName('');
    setClientEmail('');
    setTaskBrief('');
  };

  // Move Kanban card
  const handleMoveCard = (id: string, currentStatus: Project['status'], direction: 'left' | 'right') => {
    const stages: Project['status'][] = ['New', 'In Progress', 'Client Review', 'Completed'];
    const currentIdx = stages.indexOf(currentStatus);
    let newIdx = currentIdx;

    if (direction === 'left' && currentIdx > 0) newIdx = currentIdx - 1;
    if (direction === 'right' && currentIdx < 3) newIdx = currentIdx + 1;

    if (newIdx !== currentIdx) {
      MockDB.updateProjectStatus(id, stages[newIdx]);
      loadData();
    }
  };

  // Payout actions
  const handleApprovePayout = (id: string) => {
    if (role === 'manager') {
      alert('Security Denied: Managers cannot authorize payout operations.');
      return;
    }
    MockDB.approvePayoutRequest(id);
    loadData();
  };

  const handleMarkPaid = (id: string) => {
    if (role === 'manager') {
      alert('Security Denied: Managers cannot authorize payout operations.');
      return;
    }
    MockDB.markPayoutAsPaid(id);
    loadData();
  };

  // Export Payout CSV
  const handleExportPayoutsCsv = () => {
    const pending = payouts.filter(p => p.status === 'Approved');
    if (pending.length === 0) {
      alert('No approved payout records pending bank transfer.');
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,ID,Freelancer,Amount,Tax Deducted,Net Payout,Date\n";
    pending.forEach(p => {
      csvContent += `${p.id},${p.freelancerName},${p.amount},${p.taxDeducted},${p.netAmount},${p.date}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Alvin_Agency_BankPayouts_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Config adjustments
  const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (role === 'manager') {
      alert('Managers cannot alter corporate tax rules.');
      return;
    }
    const val = parseInt(e.target.value) || 0;
    setTaxRate(val);
    MockDB.setTaxRate(val);
  };

  const handleToggle2FA = () => {
    if (role === 'manager') {
      alert('Managers cannot change authentication parameters.');
      return;
    }
    if (!twoFA) {
      setShowTwoFAModal(true);
    } else {
      setTwoFA(false);
      MockDB.set2FAEnabled(false);
    }
  };

  const confirm2FA = () => {
    setTwoFA(true);
    MockDB.set2FAEnabled(true);
    setShowTwoFAModal(false);
  };

  // Calc general totals
  const totalLeads = leads.length;
  const totalRevenue = projects.reduce((acc, p) => acc + p.contractValue, 0);
  const totalOutsource = projects.reduce((acc, p) => acc + p.outsourceFee, 0);
  const netEarnings = totalRevenue - totalOutsource;

  // Pie chart format
  const sourceTotals = trafficData.reduce((acc, curr) => {
    acc.organic += curr.organic;
    acc.facebook += curr.facebook;
    acc.tiktok += curr.tiktok;
    acc.youtube += curr.youtube;
    acc.direct += curr.direct;
    return acc;
  }, { organic: 0, facebook: 0, tiktok: 0, youtube: 0, direct: 0 });

  const pieChartData = [
    { name: 'Organic Search', value: sourceTotals.organic },
    { name: 'Facebook Ads', value: sourceTotals.facebook },
    { name: 'TikTok Social', value: sourceTotals.tiktok },
    { name: 'YouTube Content', value: sourceTotals.youtube },
    { name: 'Direct Traffic', value: sourceTotals.direct }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: '#F8F6F2' }}>
      <Navbar />

      <main className="pt-24 pb-16 flex-grow max-w-7xl mx-auto px-4 md:px-6 w-full">
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
            <span className="text-xs font-bold text-[#5A6A72] uppercase tracking-wide">
              {t('admin.currentRole')}:
            </span>
            <div className="inline-flex rounded-xl border border-gray-200 p-0.5 bg-gray-50">
              <button
                onClick={() => setRole('admin')}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer ${
                  role === 'admin' ? 'bg-white text-[#9B2A4C] shadow-sm' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {t('portals.roleAdmin')}
              </button>
              <button
                onClick={() => setRole('manager')}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer ${
                  role === 'manager' ? 'bg-white text-[#2C3E50] shadow-sm' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {t('portals.roleManager')}
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#9B2A4C]/10 flex items-center justify-center text-[#9B2A4C] text-xl">
              <i className="ri-contacts-book-line" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">CRM Leads</p>
              <p className="text-2xl font-black text-[#1C2526]">{totalLeads}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-500 text-xl">
              <i className="ri-bank-card-line" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Contract Value</p>
              <p className="text-2xl font-black text-[#1C2526]">${totalRevenue}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 text-xl">
              <i className="ri-refund-2-line" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Outsource Fees</p>
              <p className="text-2xl font-black text-[#1C2526]">${totalOutsource}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 text-xl">
              <i className="ri-safe-2-line" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Net Profit Margin</p>
              <p className="text-2xl font-black text-[#1C2526]">${netEarnings}</p>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs & Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3 space-y-2">
            <button
              onClick={() => setActiveTab('marketing')}
              className={`w-full text-left px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === 'marketing' ? 'gradient-bg text-white shadow' : 'bg-white text-[#5A6A72] border border-gray-100 hover:bg-gray-50'
              }`}
            >
              <i className="ri-line-chart-line text-base" />
              {t('admin.trafficAnalytics')}
            </button>
            <button
              onClick={() => setActiveTab('finance')}
              className={`w-full text-left px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === 'finance' ? 'gradient-bg text-white shadow' : 'bg-white text-[#5A6A72] border border-gray-100 hover:bg-gray-50'
              }`}
            >
              <i className="ri-file-excel-2-line text-base" />
              {t('admin.financeReporting')}
            </button>
            <button
              onClick={() => setActiveTab('crm')}
              className={`w-full text-left px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === 'crm' ? 'gradient-bg text-white shadow' : 'bg-white text-[#5A6A72] border border-gray-100 hover:bg-gray-50'
              }`}
            >
              <i className="ri-user-follow-line text-base" />
              {t('admin.crmManagement')}
            </button>
            <button
              onClick={() => setActiveTab('kanban')}
              className={`w-full text-left px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === 'kanban' ? 'gradient-bg text-white shadow' : 'bg-white text-[#5A6A72] border border-gray-100 hover:bg-gray-50'
              }`}
            >
              <i className="ri-kanban-view text-base" />
              {t('admin.projectKanban')}
            </button>
            <button
              onClick={() => setActiveTab('payouts')}
              className={`w-full text-left px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'payouts' ? 'gradient-bg text-white shadow' : 'bg-white text-[#5A6A72] border border-gray-100 hover:bg-gray-50'
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
              onClick={() => setActiveTab('security')}
              className={`w-full text-left px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === 'security' ? 'gradient-bg text-white shadow' : 'bg-white text-[#5A6A72] border border-gray-100 hover:bg-gray-50'
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
                  <h3 className="font-bold text-[#1C2526] text-lg">{t('admin.realtimeTraffic')}</h3>
                  <span className="text-[10px] text-green-500 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                    Connected to GA4 & Social APIs
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
                          className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                            alert.status === 'active'
                              ? 'bg-red-50/50 border-red-100'
                              : 'bg-gray-50/50 border-gray-100 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                              alert.platform === 'TikTok' ? 'bg-black text-white' : 'bg-blue-100 text-blue-600'
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
              <div className="space-y-8 animate-fadeIn">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <h3 className="font-bold text-[#1C2526] text-lg">{t('admin.sheetsIntegration')}</h3>
                  <span className="text-[10px] text-[#2C3E50] font-semibold flex items-center gap-1.5 px-2.5 py-1.5 bg-[#2C3E50]/5 rounded-xl">
                    <i className="ri-file-excel-fill text-green-600 text-sm" />
                    Google Sheets API Active
                  </span>
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
                    Live Sheet: Income Statement
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
            )}

            {/* 3. CRM LEADS */}
            {activeTab === 'crm' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-[#1C2526] text-lg">{t('admin.crmDatabase')}</h3>
                    <p className="text-xs text-gray-400">Track and close incoming project prospects.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCsvImport}
                      className="px-4 py-2 border border-dashed border-[#9B2A4C]/30 text-[#9B2A4C] hover:bg-[#9B2A4C]/5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <i className="ri-file-upload-line" />
                      {t('admin.importCsv')}
                    </button>
                  </div>
                </div>

                {csvMessage && (
                  <div className="p-3 bg-green-50 text-green-700 rounded-xl border border-green-200 text-xs font-semibold">
                    {csvMessage}
                  </div>
                )}

                {/* CRM Leads Database */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-[#5A6A72] font-bold">
                        <th className="p-3">Customer info</th>
                        <th className="p-3">Request Details</th>
                        <th className="p-3">Lead Status</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {leads.map(lead => (
                        <tr key={lead.id} className="hover:bg-gray-50/50 align-top">
                          <td className="p-3 space-y-1">
                            <p className="font-bold text-[#1C2526]">{lead.name}</p>
                            <p className="text-[10px] text-gray-400">{lead.email}</p>
                            <p className="text-[10px] text-gray-400">{lead.phone}</p>
                            <p className="text-[10px] font-bold text-[#9B2A4C]">{lead.company}</p>
                          </td>
                          <td className="p-3 space-y-1 max-w-xs">
                            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                              {lead.service}
                            </span>
                            <p className="text-[10px] text-[#5A6A72] leading-relaxed line-clamp-3">
                              {lead.message}
                            </p>
                          </td>
                          <td className="p-3">
                            <select
                              value={lead.status}
                              onChange={(e) => {
                                MockDB.updateLeadStatus(lead.id, e.target.value as Lead['status']);
                                loadData();
                              }}
                              className="bg-gray-50 border border-gray-200 rounded px-1.5 py-1 text-[10px] font-bold text-gray-700 focus:outline-none focus:border-[#9B2A4C]"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Qualified">Qualified</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                MockDB.deleteLead(lead.id);
                                loadData();
                              }}
                              className="text-red-500 hover:text-red-700 p-1 text-sm cursor-pointer"
                              title="Delete Lead"
                            >
                              <i className="ri-delete-bin-6-line" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Lead manual add form */}
                <form onSubmit={handleAddLead} className="p-6 rounded-3xl bg-[#F8F6F2]/50 border border-gray-200 space-y-4">
                  <h4 className="font-bold text-xs text-[#1C2526] uppercase tracking-wide">
                    {t('admin.addLeadManual')}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Name"
                      value={newLeadName}
                      onChange={(e) => setNewLeadName(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email"
                      value={newLeadEmail}
                      onChange={(e) => setNewLeadEmail(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone"
                      value={newLeadPhone}
                      onChange={(e) => setNewLeadPhone(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Company"
                      value={newLeadCompany}
                      onChange={(e) => setNewLeadCompany(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                    />
                    <select
                      value={newLeadService}
                      onChange={(e) => setNewLeadService(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="AI Chatbots">AI Chatbots</option>
                      <option value="Landing Page">Landing Page</option>
                      <option value="Workflow Automation">Workflow Automation</option>
                      <option value="Email Automation">Email Automation</option>
                      <option value="n8n Integration">n8n Integration</option>
                      <option value="Mobile App">Mobile App</option>
                    </select>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Inquiry Brief / Client Goals..."
                    value={newLeadMessage}
                    onChange={(e) => setNewLeadMessage(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#9B2A4C] resize-none"
                  />
                  <button
                    type="submit"
                    className="bg-[#2C3E50] text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-[#2C3E50]/90 transition-colors cursor-pointer"
                  >
                    Add Lead
                  </button>
                </form>
              </div>
            )}

            {/* 4. KANBAN PROJECT BOARD */}
            {activeTab === 'kanban' && (
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <h3 className="font-bold text-[#1C2526] text-lg">{t('admin.taskBoard')}</h3>
                  <p className="text-xs text-gray-400">Map and orchestrate freelancer timelines dynamically.</p>
                </div>

                {/* Columns */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {['New', 'In Progress', 'Client Review', 'Completed'].map(columnStatus => {
                    const filtered = projects.filter(p => p.status === columnStatus);
                    return (
                      <div key={columnStatus} className="bg-[#F8F6F2]/50 border border-gray-200 rounded-2xl p-3 space-y-3 min-h-[300px]">
                        <div className="flex justify-between items-center px-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {columnStatus === 'New' ? 'Mới' : columnStatus === 'In Progress' ? 'Đang Làm' : columnStatus === 'Client Review' ? 'Chờ Khách Duyệt' : 'Hoàn Thành'}
                          </span>
                          <span className="bg-[#2C3E50]/5 text-[#2C3E50] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                            {filtered.length}
                          </span>
                        </div>

                        <div className="space-y-3">
                          {filtered.map(proj => (
                            <div key={proj.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3 hover:border-[#9B2A4C]/30 transition-colors">
                              <div>
                                <span className="text-[8px] font-bold text-[#9B2A4C] uppercase bg-[#9B2A4C]/5 px-1.5 py-0.5 rounded">
                                  {proj.service}
                                </span>
                                <h4 className="text-xs font-bold text-[#1C2526] mt-1 line-clamp-1">{proj.name}</h4>
                                <p className="text-[9px] text-gray-400">Client: {proj.clientName}</p>
                              </div>

                              <div className="space-y-1.5">
                                <div className="flex justify-between text-[9px] text-gray-500 font-bold">
                                  <span>Assignee</span>
                                  <span className="text-[#2C3E50]">{proj.assigneeName}</span>
                                </div>
                                <div className="flex justify-between text-[9px] text-gray-500 font-bold">
                                  <span>Deadline</span>
                                  <span className="text-red-500">{proj.deadline}</span>
                                </div>
                                <div className="flex justify-between text-[9px] text-gray-500 font-bold">
                                  <span>Progress</span>
                                  <span className="text-[#9B2A4C]">{proj.progress}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full gradient-bg rounded-full" style={{ width: `${proj.progress}%` }} />
                                </div>
                              </div>

                              {/* Simple Move Controller */}
                              <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                                <button
                                  onClick={() => handleMoveCard(proj.id, proj.status, 'left')}
                                  disabled={columnStatus === 'New'}
                                  className="p-1 text-[#5A6A72] disabled:opacity-30 cursor-pointer"
                                >
                                  <i className="ri-arrow-left-s-line" />
                                </button>
                                <span className="text-[8px] font-bold text-[#5A6A72] uppercase">Control</span>
                                <button
                                  onClick={() => handleMoveCard(proj.id, proj.status, 'right')}
                                  disabled={columnStatus === 'Completed'}
                                  className="p-1 text-[#5A6A72] disabled:opacity-30 cursor-pointer"
                                >
                                  <i className="ri-arrow-right-s-line" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add new project/Assign Task */}
                <form onSubmit={handleAddTask} className="p-6 rounded-3xl bg-[#F8F6F2]/50 border border-gray-200 space-y-4">
                  <h4 className="font-bold text-xs text-[#1C2526] uppercase tracking-wide">
                    {t('admin.addTask')}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Project Name *"
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Client Name *"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Client Email *"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <select
                      value={taskService}
                      onChange={(e) => setTaskService(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="AI Chatbots">AI Chatbots</option>
                      <option value="Landing Page">Landing Page</option>
                      <option value="Workflow Automation">Workflow Automation</option>
                      <option value="Email Automation">Email Automation</option>
                      <option value="n8n Integration">n8n Integration</option>
                      <option value="Mobile App">Mobile App</option>
                    </select>

                    <select
                      value={assigneeId}
                      onChange={(e) => setAssigneeId(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                    >
                      <option value="Unassigned">Assign Freelancer</option>
                      {freelancers.filter(f => f.status === 'Approved').map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>

                    <input
                      type="number"
                      required
                      placeholder="Contract Value ($)"
                      value={contractValue}
                      onChange={(e) => setContractValue(parseInt(e.target.value) || 0)}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                    />

                    <input
                      type="number"
                      required
                      placeholder="Outsource thù lao ($)"
                      value={outsourceFee}
                      onChange={(e) => setOutsourceFee(parseInt(e.target.value) || 0)}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="date"
                      required
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#9B2A4C]"
                    />
                    <textarea
                      rows={1}
                      placeholder="Task specifications, requirements and client briefs..."
                      value={taskBrief}
                      onChange={(e) => setTaskBrief(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#9B2A4C] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#2C3E50] text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-[#2C3E50]/90 transition-colors cursor-pointer"
                  >
                    Create Project Task
                  </button>
                </form>
              </div>
            )}

            {/* 5. PAYMENTS REQUEST */}
            {activeTab === 'payouts' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-[#1C2526] text-lg">{t('admin.pendingPayments')}</h3>
                    <p className="text-xs text-gray-400">Authorize payments and thù lao request sheets.</p>
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
                        <th className="p-3">Freelancer Name</th>
                        <th className="p-3">Project Info</th>
                        <th className="p-3 text-right">Fee Rate</th>
                        <th className="p-3 text-right">Tax ({taxRate}%)</th>
                        <th className="p-3 text-right">Net Payout</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {payouts.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50/50">
                          <td className="p-3 font-semibold text-[#1C2526]">{p.freelancerName}</td>
                          <td className="p-3 text-[10px] text-gray-500 max-w-xs truncate">{p.projectName}</td>
                          <td className="p-3 text-right font-bold text-[#2C3E50]">${p.amount}</td>
                          <td className="p-3 text-right text-red-500">-${p.taxDeducted}</td>
                          <td className="p-3 text-right font-bold text-[#9B2A4C]">${p.netAmount}</td>
                          <td className="p-3">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              p.status === 'Paid'
                                ? 'bg-green-50 text-green-600'
                                : p.status === 'Approved'
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-yellow-50 text-yellow-600'
                            }`}>
                              {p.status === 'Paid' ? t('admin.paid') : p.status === 'Approved' ? 'Approved' : 'Pending'}
                            </span>
                          </td>
                          <td className="p-3 text-center space-x-2">
                            {p.status === 'Pending' && (
                              <button
                                onClick={() => handleApprovePayout(p.id)}
                                disabled={role === 'manager'}
                                className="px-2.5 py-1 bg-[#2C3E50] text-white text-[9px] font-bold rounded hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
                              >
                                {t('admin.approve')}
                              </button>
                            )}
                            {p.status === 'Approved' && (
                              <button
                                onClick={() => handleMarkPaid(p.id)}
                                disabled={role === 'manager'}
                                className="px-2.5 py-1 bg-green-500 text-white text-[9px] font-bold rounded hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
                              >
                                Mark Paid
                              </button>
                            )}
                            {p.status === 'Paid' && (
                              <span className="text-[10px] text-gray-400 font-semibold">Done</span>
                            )}
                          </td>
                        </tr>
                      ))}

                      {payouts.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-gray-400 italic">
                            No payment requests listed in the mock database.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Freelancer approvals pending list */}
                <div className="space-y-4 pt-4">
                  <h4 className="font-bold text-xs text-[#1C2526] uppercase tracking-wide">
                    Pending Freelancer registrations
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {freelancers.filter(f => f.status === 'Pending').map(free => (
                      <div key={free.id} className="p-4 rounded-2xl bg-[#F8F6F2]/50 border border-gray-200 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="text-xs font-bold text-[#1C2526]">{free.name}</h5>
                            <p className="text-[10px] text-gray-400">{free.email}</p>
                          </div>
                          <span className="text-[8px] font-bold bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded uppercase">
                            Pending
                          </span>
                        </div>
                        <div className="text-[10px] space-y-1 text-gray-500">
                          <p><span className="font-semibold">Skills:</span> {free.skills.join(', ')}</p>
                          <p>
                            <span className="font-semibold">Portfolio:</span>{' '}
                            <a href={free.portfolio} target="_blank" rel="noreferrer" className="text-[#9B2A4C] hover:underline truncate inline-block max-w-[150px]">
                              {free.portfolio}
                            </a>
                          </p>
                          <p>
                            <span className="font-semibold">Expected Rate:</span>{' '}
                            ${free.rateValue} {free.rateType === 'hourly' ? '/ hr' : 'fixed'}
                          </p>
                        </div>
                        <div className="flex gap-2 justify-end pt-1">
                          <button
                            onClick={() => handleApproveFreelancer(free.id, false)}
                            disabled={role === 'manager'}
                            className="px-2.5 py-1 border border-red-200 text-red-500 text-[10px] font-bold rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors cursor-pointer"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleApproveFreelancer(free.id, true)}
                            disabled={role === 'manager'}
                            className="px-2.5 py-1 bg-green-500 text-white text-[10px] font-bold rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    ))}

                    {freelancers.filter(f => f.status === 'Pending').length === 0 && (
                      <p className="text-xs text-gray-400 italic">No pending freelancer registrations waiting for approval.</p>
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
                  <p className="text-xs text-gray-400">Configure business rules, tax settings and authentication layers.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Tax Configuration */}
                  <div className="p-6 rounded-3xl bg-[#F8F6F2]/50 border border-gray-200 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#9B2A4C]/10 text-[#9B2A4C] flex items-center justify-center text-lg">
                        <i className="ri-percent-line" />
                      </div>
                      <h4 className="font-bold text-xs text-[#1C2526] uppercase tracking-wide">
                        {t('admin.taxConfigure')}
                      </h4>
                    </div>
                    <p className="text-xs text-[#5A6A72] leading-relaxed">
                      This percentage is deducted automatically from the outsource fee when freelancers claim payout requests.
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
                  <div className="p-6 rounded-3xl bg-[#F8F6F2]/50 border border-gray-200 space-y-4">
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
                      <span className="text-xs font-semibold text-gray-500">Enable 2FA Protection</span>
                      <button
                        onClick={handleToggle2FA}
                        disabled={role === 'manager'}
                        className={`w-12 h-6 rounded-full p-1 transition-all duration-300 disabled:opacity-50 cursor-pointer ${
                          twoFA ? 'bg-[#9B2A4C] flex justify-end' : 'bg-gray-300 flex justify-start'
                        }`}
                      >
                        <span className="w-4 h-4 bg-white rounded-full shadow-sm" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Encryption notice */}
                <div className="p-4 rounded-2xl bg-yellow-50/50 border border-yellow-100 text-xs text-[#5A6A72] space-y-1">
                  <p className="font-bold text-[#2C3E50] flex items-center gap-1">
                    <i className="ri-lock-line" />
                    Encrypted Password Protocol Active
                  </p>
                  <p className="leading-relaxed text-[11px]">
                    All freelancer profile passwords and Admin authentication database credentials are encrypted using SHA-256 visual signatures in this front-end package environment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 2FA SETUP MODAL MOCK */}
      {showTwoFAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full border border-gray-100 shadow-2xl space-y-6 animate-scaleUp">
            <div className="text-center space-y-2">
              <h3 className="font-bold text-[#1C2526] text-lg">Set up Authenticator app</h3>
              <p className="text-xs text-gray-400">Scan this QR code using Google Authenticator or Microsoft Authenticator.</p>
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
              <p className="text-[10px] text-gray-400 text-center font-semibold">Or enter manually code: ALVIN2FASECRETKEY</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowTwoFAModal(false)}
                  className="w-1/2 py-2 border border-gray-200 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirm2FA}
                  className="w-1/2 py-2 gradient-bg text-white font-bold text-xs rounded-xl hover:opacity-95 shadow transition-colors"
                >
                  Verify & Enable
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
