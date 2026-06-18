import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` 
  : 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const LeadsAPI = {
  getAll: () => api.get('/leads').then(res => res.data),
  create: (data: any) => api.post('/leads', data).then(res => res.data),
  update: (id: string, data: any) => api.put(`/leads/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/leads/${id}`).then(res => res.data),
};

export const DevelopersAPI = {
  getAll: () => api.get('/developers').then(res => res.data),
  create: (data: any) => api.post('/developers', data).then(res => res.data),
  update: (id: string, data: any) => api.put(`/developers/${id}`, data).then(res => res.data),
};

export const ProjectsAPI = {
  getAll: () => api.get('/projects').then(res => res.data),
  create: (data: any) => api.post('/projects', data).then(res => res.data),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data).then(res => res.data),
};

export const PayoutsAPI = {
  getAll: () => api.get('/payouts').then(res => res.data),
  create: (data: any) => api.post('/payouts', data).then(res => res.data),
  update: (id: string, data: any) => api.put(`/payouts/${id}`, data).then(res => res.data),
};

export const AnalyticsAPI = {
  getTraffic: (filter?: string) => api.get('/analytics/traffic', { params: { filter } }).then(res => res.data),
  getAlerts: () => api.get('/analytics/alerts').then(res => res.data),
  updateAlert: (id: string, data: any) => api.put(`/analytics/alerts/${id}`, data).then(res => res.data),
  getFinance: () => api.get('/analytics/finance').then(res => res.data),
  trackVisit: (source: string) => api.post('/analytics/track', { source }).then(res => res.data),
};

export const SettingsAPI = {
  getAll: () => api.get('/settings').then(res => res.data),
  get: (key: string) => api.get(`/settings/${key}`).then(res => res.data?.value),
  update: (key: string, data: any) => api.put(`/settings/${key}`, data).then(res => res.data),
};
