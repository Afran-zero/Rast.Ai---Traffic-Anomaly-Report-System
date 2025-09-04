import React, { useEffect, useState } from 'react';
import { FileText, AlertTriangle, CheckCircle, Clock, Shield, Users } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { StatCard } from '../components/UI/StatCard';
import { Badge } from '../components/UI/Badge';
import { reportsAPI, dashboardAPI } from '../services/api';
import { Report, DashboardStats } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function Dashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'severity' | 'timestamp'>('severity');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsData, statsData] = await Promise.all([
          reportsAPI.getAllReports(),
          dashboardAPI.getStats()
        ]);
        setReports(reportsData);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusUpdate = async (reportId: number, newStatus: string) => {
    try {
      await reportsAPI.updateReportStatus(reportId, newStatus);
      setReports(prev => prev.map(report => 
        report.id === reportId ? { ...report, status: newStatus } : report
      ));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const sortedReports = [...reports].sort((a, b) => {
    if (sortBy === 'severity') {
      return b.severity - a.severity;
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // Chart data
  const categoryChartData = stats ? {
    labels: Object.keys(stats.categoryStats),
    datasets: [
      {
        label: 'Reports by Category',
        data: Object.values(stats.categoryStats),
        backgroundColor: [
          '#DC2626', // Red for accidents
          '#EA580C', // Orange for wrong-way
          '#D97706', // Amber for illegal stop
          '#7C3AED', // Purple for illegal toll
          '#DC2626', // Red for roadblock
          '#6B7280', // Gray for pothole
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  } : null;

  const statusChartData = stats ? {
    labels: ['Pending', 'Under Review', 'Assigned', 'Resolved'],
    datasets: [
      {
        label: 'Reports by Status',
        data: [
          reports.filter(r => r.status === 'Pending').length,
          reports.filter(r => r.status === 'Under Review').length,
          reports.filter(r => r.status.includes('Assigned')).length,
          reports.filter(r => r.status === 'Resolved').length,
        ],
        backgroundColor: ['#F59E0B', '#3B82F6', '#8B5CF6', '#10B981'],
        borderWidth: 0,
      },
    ],
  } : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Authority Dashboard</h1>
              <p className="mt-1 text-gray-600">Manage and monitor traffic incidents</p>
            </div>
            <div className="bg-teal-100 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium text-teal-700">Demo Mode</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Reports"
              value={stats.totalReports}
              icon={FileText}
              color="teal"
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Pending Reports"
              value={stats.pendingReports}
              icon={Clock}
              color="orange"
            />
            <StatCard
              title="Resolved Reports"
              value={stats.resolvedReports}
              icon={CheckCircle}
              color="green"
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Verified Reports"
              value={stats.verifiedReports}
              icon={Shield}
              color="blue"
            />
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Reports by Category</h2>
            {categoryChartData && (
              <div className="h-64">
                <Doughnut 
                  data={categoryChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Reports by Status</h2>
            {statusChartData && (
              <div className="h-64">
                <Bar 
                  data={statusChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Incident Queue */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Incident Queue</h2>
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'severity' | 'timestamp')}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="severity">Severity</option>
                  <option value="timestamp">Time</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Incident
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">
                          {report.category === 'Accident' && '🚑'}
                          {report.category === 'Wrong-Way Driving' && '↔️'}
                          {report.category === 'Illegal Stop' && '🚌'}
                          {report.category === 'Illegal Toll' && '💸'}
                          {report.category === 'Roadblock' && '⛔'}
                          {report.category === 'Pothole' && '🕳️'}
                        </span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {report.category}
                          </div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {report.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.location.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {[...Array(report.severity)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-sm">★</span>
                        ))}
                        <span className="ml-1 text-xs text-gray-500">
                          ({report.severity}/5)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={
                          report.status === 'Resolved' ? 'success' :
                          report.status === 'Pending' ? 'warning' : 'info'
                        } 
                        size="sm"
                      >
                        {report.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={report.verified ? 'success' : 'warning'} 
                        size="sm"
                      >
                        {report.verified ? 'Yes' : 'No'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {report.status === 'Pending' && (
                          <button
                            onClick={() => handleStatusUpdate(report.id, 'Under Review')}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 transition-colors"
                          >
                            Review
                          </button>
                        )}
                        {(report.status === 'Pending' || report.status === 'Under Review') && (
                          <button
                            onClick={() => handleStatusUpdate(report.id, 
                              report.category === 'Pothole' ? 'Assigned to DSCC' : 'Assigned to Police')}
                            className="bg-purple-100 text-purple-700 px-3 py-1 rounded-md hover:bg-purple-200 transition-colors"
                          >
                            Assign
                          </button>
                        )}
                        {report.status !== 'Resolved' && (
                          <button
                            onClick={() => handleStatusUpdate(report.id, 'Resolved')}
                            className="bg-green-100 text-green-700 px-3 py-1 rounded-md hover:bg-green-200 transition-colors"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}