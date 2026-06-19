// Mock database using localStorage to handle interactive state in the frontend

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'manager' | 'client' | 'developer';
  createdAt?: string;
  updatedAt?: string;
}

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
  createdAt?: string;
  updatedAt?: string;
}

export interface Developer {
  id: string;
  name: string;
  email: string;
  skills: string[];
  portfolio: string;
  rateType: 'hourly' | 'fixed';
  rateValue: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
  title?: string;
  yearsOfExperience?: string;
  englishProficiency?: string;
  cvLink?: string;
  availability?: string;
  shortBio?: string;
  dateOfBirth?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  clientEmail: string;
  service: string;
  status: 'New' | 'In Progress' | 'Client Review' | 'Completed';
  assigneeId: string; // developerId or 'Unassigned'
  assigneeName: string;
  deadline: string;
  brief: string;
  progress: number; // 0 to 100
  deliverablesUrl: string;
  contractValue: number;
  outsourceFee: number;
  taxRate: number; // e.g. 10
  payoutStatus: 'None' | 'Requested' | 'Approved' | 'Paid';
  subTasks?: string;
}

export interface PayoutRequest {
  id: string;
  projectId: string;
  projectName: string;
  developerId: string;
  developerName: string;
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


