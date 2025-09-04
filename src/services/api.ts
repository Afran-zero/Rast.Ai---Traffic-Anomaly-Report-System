import axios from 'axios';
import { Report, DashboardStats, RiskZone } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const reportsAPI = {
  getAllReports: (): Promise<Report[]> => 
    api.get('/reports').then(response => response.data),
    
  createReport: (report: Partial<Report>): Promise<{ success: boolean; report: Report }> => 
    api.post('/reports', report).then(response => response.data),
    
  updateReportStatus: (id: number, status: string): Promise<{ success: boolean; report: Report }> => 
    api.put(`/reports/${id}`, { status }).then(response => response.data),
};

export const dashboardAPI = {
  getStats: (): Promise<DashboardStats> => 
    api.get('/dashboard').then(response => response.data),
};

export const riskAPI = {
  getRiskZones: (): Promise<RiskZone[]> => 
    api.get('/risk-zones').then(response => response.data),
};