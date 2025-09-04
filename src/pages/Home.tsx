import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, MapPin, Shield, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { StatCard } from '../components/UI/StatCard';
import { dashboardAPI } from '../services/api';
import { DashboardStats } from '../types';

export function Home() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardAPI.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-600 to-orange-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Report Traffic Anomaly <br />
              <span className="text-yellow-300">"“Safer Roads. Smarter Responses.”</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Join millon of citizens making our roads safer through Ai & community-powered traffic monitoring 
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/report"
                className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FileText className="inline mr-2 h-5 w-5" />
                Report an Incident
              </Link>
              <Link
                to="/map"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-teal-600 transition-colors transform hover:scale-105"
              >
                <MapPin className="inline mr-2 h-5 w-5" />
                View Live Map
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Impact at a Glance</h2>
          <p className="text-lg text-gray-600">Real-time statistics from our community of traffic reporters(demo data ) </p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <StatCard
              title="Total Reports"
              value={stats.totalReports}
              icon={FileText}
              color="teal"
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Issues Resolved"
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
              trend={{ value: 15, isPositive: true }}
            />
            <StatCard
              title="Active Citizens"
              value="1,247"
              icon={Users}
              color="purple"
              trend={{ value: 23, isPositive: true }}
            />
          </div>
        )}

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">How TrafficBondhu Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-teal-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3">1. Report Issues</h4>
              <p className="text-gray-600">Citizens report traffic violations, accidents, and road hazards in real-time</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3">2. AI Verification</h4>
              <p className="text-gray-600">Our smart system validates reports and prioritizes based on severity</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3">3. Quick Response</h4>
              <p className="text-gray-600">Authorities receive alerts and take immediate action to resolve issues</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">For Citizens</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-3 text-teal-200" />
                Easy incident reporting
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-3 text-teal-200" />
                Real-time traffic updates
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-3 text-teal-200" />
                Earn points and badges
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-3 text-teal-200" />
                Anonymous reporting
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">For Authorities</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-3 text-orange-200" />
                Priority-based incident queue
              </li>
              <li className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-3 text-orange-200" />
                AI-powered risk prediction
              </li>
              <li className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-3 text-orange-200" />
                Comprehensive analytics
              </li>
              <li className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-3 text-orange-200" />
                Emergency integration
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
