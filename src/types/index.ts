export interface Report {
  id: number;
  category: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  description: string;
  severity: number;
  verified: boolean;
  status: string;
  timestamp: string;
  reporterId: string;
}

export interface DashboardStats {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  verifiedReports: number;
  categoryStats: Record<string, number>;
}

export interface RiskZone {
  lat: number;
  lng: number;
  name: string;
  riskLevel: number;
  type: string;
}

export interface UserStats {
  reportsSubmitted: number;
  points: number;
  badges: string[];
}