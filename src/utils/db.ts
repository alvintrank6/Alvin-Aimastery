// Mock database using localStorage to handle interactive state in the frontend

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Closed';
  date: string;
}

export interface Freelancer {
  id: string;
  name: string;
  email: string;
  skills: string[];
  portfolio: string;
  rateType: 'hourly' | 'fixed';
  rateValue: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  clientEmail: string;
  service: string;
  status: 'New' | 'In Progress' | 'Client Review' | 'Completed';
  assigneeId: string; // freelancerId or 'Unassigned'
  assigneeName: string;
  deadline: string;
  brief: string;
  progress: number; // 0 to 100
  deliverablesUrl: string;
  contractValue: number;
  outsourceFee: number;
  taxRate: number; // e.g. 10
  payoutStatus: 'None' | 'Requested' | 'Approved' | 'Paid';
}

export interface PayoutRequest {
  id: string;
  projectId: string;
  projectName: string;
  freelancerId: string;
  freelancerName: string;
  amount: number; // outsourceFee
  taxDeducted: number;
  netAmount: number;
  date: string;
  status: 'Pending' | 'Approved' | 'Paid';
}

export interface TrafficMetric {
  date: string;
  visitors: number;
  organic: number;
  facebook: number;
  tiktok: number;
  youtube: number;
  direct: number;
}

export interface CampaignAlert {
  id: string;
  platform: 'Facebook' | 'TikTok' | 'YouTube' | 'Google';
  campaignName: string;
  engagementDrop: number; // percentage
  status: 'active' | 'resolved';
}

export interface FinanceLog {
  month: string;
  revenue: number;
  outsourceCost: number;
  otherCost: number;
}

const DEFAULT_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Nguyen Van A',
    email: 'vana@techcorp.vn',
    phone: '0912345678',
    company: 'TechCorp Viet Nam',
    service: 'Web Development',
    message: 'We need an e-commerce website designed in React and Tailwind.',
    status: 'Qualified',
    date: '2026-06-10 09:30',
  },
  {
    id: 'lead-2',
    name: 'Jane Smith',
    email: 'janes@aesthetics.com',
    phone: '+1415888999',
    company: 'Aesthetics Cosmetics',
    service: 'Email Automation',
    message: 'Looking for setting up an Klaviyo automated sequence for abandoned carts.',
    status: 'New',
    date: '2026-06-11 14:15',
  },
  {
    id: 'lead-3',
    name: 'Le Thi B',
    email: 'lethib@spa.vn',
    phone: '0987654321',
    company: 'An Nhien Spa',
    service: 'AI Chatbot',
    message: 'Need a Facebook chatbot to automatically handle booking consultations.',
    status: 'Contacted',
    date: '2026-06-12 08:00',
  }
];

const DEFAULT_FREELANCERS: Freelancer[] = [
  {
    id: 'free-1',
    name: 'Tran Freelancer',
    email: 'tranfree@gmail.com',
    skills: ['n8n', 'Workflow', 'Web'],
    portfolio: 'https://github.com/tranfree-portfolio',
    rateType: 'hourly',
    rateValue: 25,
    status: 'Approved',
    date: '2026-05-15 10:00',
  },
  {
    id: 'free-2',
    name: 'Minh Dev',
    email: 'minhdev@gmail.com',
    skills: ['Web', 'App', 'Landing'],
    portfolio: 'https://minhdev.com',
    rateType: 'fixed',
    rateValue: 1200,
    status: 'Approved',
    date: '2026-05-20 11:30',
  },
  {
    id: 'free-3',
    name: 'Hoa Automation',
    email: 'hoa.n8n@gmail.com',
    skills: ['n8n', 'Workflow', 'Email Auto'],
    portfolio: 'https://flow.hoa.io',
    rateType: 'hourly',
    rateValue: 30,
    status: 'Pending',
    date: '2026-06-11 16:45',
  }
];

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'React Dashboard for TechCorp',
    clientName: 'Nguyen Van A',
    clientEmail: 'vana@techcorp.vn',
    service: 'Web Development',
    status: 'In Progress',
    assigneeId: 'free-2',
    assigneeName: 'Minh Dev',
    deadline: '2026-07-15',
    brief: 'Implement client dashboard layout with dark mode support. Integrate dummy CRM datasets and charts.',
    progress: 60,
    deliverablesUrl: 'https://github.com/minhdev/techcorp-dash',
    contractValue: 4000,
    outsourceFee: 1500,
    taxRate: 10,
    payoutStatus: 'None',
  },
  {
    id: 'proj-2',
    name: 'n8n HubSpot-Slack Sync',
    clientName: 'Alvin Tran',
    clientEmail: 'alvin@agency.com',
    service: 'n8n Automation',
    status: 'Client Review',
    assigneeId: 'free-1',
    assigneeName: 'Tran Freelancer',
    deadline: '2026-06-20',
    brief: 'Create a flow: when a deal is marked WON in HubSpot, send beautiful message in Slack channels with details.',
    progress: 90,
    deliverablesUrl: 'https://n8n.agency.com/workflow/223',
    contractValue: 1200,
    outsourceFee: 500,
    taxRate: 10,
    payoutStatus: 'Requested',
  },
  {
    id: 'proj-3',
    name: 'Landing Page for Spa An Nhien',
    clientName: 'Le Thi B',
    clientEmail: 'lethib@spa.vn',
    service: 'Landing Page',
    status: 'New',
    assigneeId: 'Unassigned',
    assigneeName: 'None',
    deadline: '2026-06-30',
    brief: 'Beautiful design on Figma and convert to clean CSS/HTML. Needs contact form and call booking system.',
    progress: 0,
    deliverablesUrl: '',
    contractValue: 1500,
    outsourceFee: 600,
    taxRate: 10,
    payoutStatus: 'None',
  },
  {
    id: 'proj-4',
    name: 'Lead Generation Chatbot',
    clientName: 'Nguyen Van A',
    clientEmail: 'vana@techcorp.vn',
    service: 'AI Chatbot',
    status: 'Completed',
    assigneeId: 'free-1',
    assigneeName: 'Tran Freelancer',
    deadline: '2026-06-05',
    brief: 'Configure Chatbot using Flowise and link it with WhatsApp API to answering basic customer questions.',
    progress: 100,
    deliverablesUrl: 'https://chatbot.techcorp.vn',
    contractValue: 2200,
    outsourceFee: 800,
    taxRate: 10,
    payoutStatus: 'Paid',
  }
];

const DEFAULT_TRAFFIC: TrafficMetric[] = [
  { date: 'Jun 06', visitors: 420, organic: 180, facebook: 120, tiktok: 80, youtube: 30, direct: 10 },
  { date: 'Jun 07', visitors: 490, organic: 200, facebook: 140, tiktok: 90, youtube: 40, direct: 20 },
  { date: 'Jun 08', visitors: 580, organic: 230, facebook: 180, tiktok: 110, youtube: 45, direct: 15 },
  { date: 'Jun 09', visitors: 510, organic: 190, facebook: 160, tiktok: 100, youtube: 40, direct: 20 },
  { date: 'Jun 10', visitors: 640, organic: 250, facebook: 210, tiktok: 120, youtube: 40, direct: 20 },
  { date: 'Jun 11', visitors: 720, organic: 290, facebook: 240, tiktok: 130, youtube: 35, direct: 25 },
  { date: 'Jun 12', visitors: 810, organic: 320, facebook: 260, tiktok: 140, youtube: 60, direct: 30 },
];

const DEFAULT_ALERTS: CampaignAlert[] = [
  { id: 'a-1', platform: 'TikTok', campaignName: 'Summer AI Chatbot Promo', engagementDrop: 32, status: 'active' },
  { id: 'a-2', platform: 'Facebook', campaignName: 'Brand Identity Agency Ad', engagementDrop: 15, status: 'resolved' },
  { id: 'a-3', platform: 'YouTube', campaignName: 'n8n Tutorial Automation', engagementDrop: 24, status: 'active' }
];

const DEFAULT_FINANCE: FinanceLog[] = [
  { month: 'Jan', revenue: 12000, outsourceCost: 4500, otherCost: 1200 },
  { month: 'Feb', revenue: 15000, outsourceCost: 5500, otherCost: 1500 },
  { month: 'Mar', revenue: 18000, outsourceCost: 7000, otherCost: 1600 },
  { month: 'Apr', revenue: 22000, outsourceCost: 8500, otherCost: 1800 },
  { month: 'May', revenue: 25000, outsourceCost: 9500, otherCost: 2000 },
  { month: 'Jun', revenue: 29000, outsourceCost: 11200, otherCost: 2400 },
];

const DEFAULT_PAYOUTS: PayoutRequest[] = [
  {
    id: 'pay-1',
    projectId: 'proj-2',
    projectName: 'n8n HubSpot-Slack Sync',
    freelancerId: 'free-1',
    freelancerName: 'Tran Freelancer',
    amount: 500,
    taxDeducted: 50,
    netAmount: 450,
    date: '2026-06-11 17:00',
    status: 'Pending'
  },
  {
    id: 'pay-2',
    projectId: 'proj-4',
    projectName: 'Lead Generation Chatbot',
    freelancerId: 'free-1',
    freelancerName: 'Tran Freelancer',
    amount: 800,
    taxDeducted: 80,
    netAmount: 720,
    date: '2026-06-06 12:00',
    status: 'Paid'
  }
];

export class MockDB {
  static init() {
    if (!localStorage.getItem('alvin_leads')) {
      localStorage.setItem('alvin_leads', JSON.stringify(DEFAULT_LEADS));
    }
    if (!localStorage.getItem('alvin_freelancers')) {
      localStorage.setItem('alvin_freelancers', JSON.stringify(DEFAULT_FREELANCERS));
    }
    if (!localStorage.getItem('alvin_projects')) {
      localStorage.setItem('alvin_projects', JSON.stringify(DEFAULT_PROJECTS));
    }
    if (!localStorage.getItem('alvin_traffic')) {
      localStorage.setItem('alvin_traffic', JSON.stringify(DEFAULT_TRAFFIC));
    }
    if (!localStorage.getItem('alvin_alerts')) {
      localStorage.setItem('alvin_alerts', JSON.stringify(DEFAULT_ALERTS));
    }
    if (!localStorage.getItem('alvin_finance')) {
      localStorage.setItem('alvin_finance', JSON.stringify(DEFAULT_FINANCE));
    }
    if (!localStorage.getItem('alvin_payouts')) {
      localStorage.setItem('alvin_payouts', JSON.stringify(DEFAULT_PAYOUTS));
    }
    if (!localStorage.getItem('alvin_tax_rate')) {
      localStorage.setItem('alvin_tax_rate', '10');
    }
    if (!localStorage.getItem('alvin_2fa_enabled')) {
      localStorage.setItem('alvin_2fa_enabled', 'false');
    }
  }

  // Leads CRM
  static getLeads(): Lead[] {
    this.init();
    return JSON.parse(localStorage.getItem('alvin_leads') || '[]');
  }

  static addLead(lead: Omit<Lead, 'id' | 'status' | 'date'>): Lead {
    const leads = this.getLeads();
    const newLead: Lead = {
      ...lead,
      id: `lead-${Date.now()}`,
      status: 'New',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    leads.unshift(newLead);
    localStorage.setItem('alvin_leads', JSON.stringify(leads));
    return newLead;
  }

  static updateLeadStatus(id: string, status: Lead['status']) {
    const leads = this.getLeads();
    const updated = leads.map(l => l.id === id ? { ...l, status } : l);
    localStorage.setItem('alvin_leads', JSON.stringify(updated));
  }

  static deleteLead(id: string) {
    const leads = this.getLeads();
    const filtered = leads.filter(l => l.id !== id);
    localStorage.setItem('alvin_leads', JSON.stringify(filtered));
  }

  // Freelancers
  static getFreelancers(): Freelancer[] {
    this.init();
    return JSON.parse(localStorage.getItem('alvin_freelancers') || '[]');
  }

  static addFreelancer(freelancer: Omit<Freelancer, 'id' | 'status' | 'date'>): Freelancer {
    const freelancers = this.getFreelancers();
    const newFree: Freelancer = {
      ...freelancer,
      id: `free-${Date.now()}`,
      status: 'Pending',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    freelancers.unshift(newFree);
    localStorage.setItem('alvin_freelancers', JSON.stringify(freelancers));
    return newFree;
  }

  static updateFreelancerStatus(id: string, status: Freelancer['status']) {
    const freelancers = this.getFreelancers();
    const updated = freelancers.map(f => f.id === id ? { ...f, status } : f);
    localStorage.setItem('alvin_freelancers', JSON.stringify(updated));
  }

  // Projects
  static getProjects(): Project[] {
    this.init();
    return JSON.parse(localStorage.getItem('alvin_projects') || '[]');
  }

  static addProject(proj: Omit<Project, 'id' | 'progress' | 'deliverablesUrl' | 'payoutStatus'>): Project {
    const projs = this.getProjects();
    const newProj: Project = {
      ...proj,
      id: `proj-${Date.now()}`,
      progress: 0,
      deliverablesUrl: '',
      payoutStatus: 'None',
    };
    projs.unshift(newProj);
    localStorage.setItem('alvin_projects', JSON.stringify(projs));
    return newProj;
  }

  static updateProject(project: Project) {
    const projs = this.getProjects();
    const updated = projs.map(p => p.id === project.id ? project : p);
    localStorage.setItem('alvin_projects', JSON.stringify(updated));
  }

  static updateProjectStatus(id: string, status: Project['status']) {
    const projs = this.getProjects();
    const updated = projs.map(p => p.id === id ? { ...p, status } : p);
    localStorage.setItem('alvin_projects', JSON.stringify(updated));
  }

  // Payout Requests
  static getPayoutRequests(): PayoutRequest[] {
    this.init();
    return JSON.parse(localStorage.getItem('alvin_payouts') || '[]');
  }

  static addPayoutRequest(projectId: string, amount: number): PayoutRequest | null {
    const projects = this.getProjects();
    const projIndex = projects.findIndex(p => p.id === projectId);
    if (projIndex === -1) return null;

    const project = projects[projIndex];
    const taxRate = this.getTaxRate();
    const taxDeducted = Math.round((amount * taxRate) / 100);
    const netAmount = amount - taxDeducted;

    const newReq: PayoutRequest = {
      id: `pay-${Date.now()}`,
      projectId: project.id,
      projectName: project.name,
      freelancerId: project.assigneeId,
      freelancerName: project.assigneeName,
      amount,
      taxDeducted,
      netAmount,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Pending'
    };

    const reqs = this.getPayoutRequests();
    reqs.unshift(newReq);
    localStorage.setItem('alvin_payouts', JSON.stringify(reqs));

    // Update project status
    project.payoutStatus = 'Requested';
    this.updateProject(project);

    return newReq;
  }

  static approvePayoutRequest(id: string) {
    const reqs = this.getPayoutRequests();
    const reqIndex = reqs.findIndex(r => r.id === id);
    if (reqIndex === -1) return;

    reqs[reqIndex].status = 'Approved';
    localStorage.setItem('alvin_payouts', JSON.stringify(reqs));

    // Update Project Status to Paid as well if status updated
    const projects = this.getProjects();
    const project = projects.find(p => p.id === reqs[reqIndex].projectId);
    if (project) {
      project.payoutStatus = 'Approved';
      this.updateProject(project);
    }
  }

  static markPayoutAsPaid(id: string) {
    const reqs = this.getPayoutRequests();
    const reqIndex = reqs.findIndex(r => r.id === id);
    if (reqIndex === -1) return;

    reqs[reqIndex].status = 'Paid';
    localStorage.setItem('alvin_payouts', JSON.stringify(reqs));

    // Update Finance Sheet as Cost
    const finance = this.getFinanceLogs();
    const currentMonth = new Date().toLocaleString('en-US', { month: 'short' });
    const logIndex = finance.findIndex(f => f.month === currentMonth);
    if (logIndex !== -1) {
      finance[logIndex].outsourceCost += reqs[reqIndex].amount;
    } else {
      finance.push({
        month: currentMonth,
        revenue: 0,
        outsourceCost: reqs[reqIndex].amount,
        otherCost: 0
      });
    }
    localStorage.setItem('alvin_finance', JSON.stringify(finance));

    // Update Project Status to Paid
    const projects = this.getProjects();
    const project = projects.find(p => p.id === reqs[reqIndex].projectId);
    if (project) {
      project.payoutStatus = 'Paid';
      this.updateProject(project);
    }
  }

  // Analytics Metrics
  static getTrafficMetrics(): TrafficMetric[] {
    this.init();
    return JSON.parse(localStorage.getItem('alvin_traffic') || '[]');
  }

  static getCampaignAlerts(): CampaignAlert[] {
    this.init();
    return JSON.parse(localStorage.getItem('alvin_alerts') || '[]');
  }

  static resolveCampaignAlert(id: string) {
    const alerts = this.getCampaignAlerts();
    const updated = alerts.map(a => a.id === id ? { ...a, status: 'resolved' as const } : a);
    localStorage.setItem('alvin_alerts', JSON.stringify(updated));
  }

  static getFinanceLogs(): FinanceLog[] {
    this.init();
    return JSON.parse(localStorage.getItem('alvin_finance') || '[]');
  }

  // Settings
  static getTaxRate(): number {
    this.init();
    return parseFloat(localStorage.getItem('alvin_tax_rate') || '10');
  }

  static setTaxRate(rate: number) {
    localStorage.setItem('alvin_tax_rate', rate.toString());
  }

  static get2FAEnabled(): boolean {
    this.init();
    return localStorage.getItem('alvin_2fa_enabled') === 'true';
  }

  static set2FAEnabled(enabled: boolean) {
    localStorage.setItem('alvin_2fa_enabled', enabled ? 'true' : 'false');
  }
}
