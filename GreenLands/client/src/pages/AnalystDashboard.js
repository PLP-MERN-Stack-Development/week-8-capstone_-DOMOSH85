import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { ChartBarIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AnalystDashboard = () => {
  const { user } = useAuth();
  const { analyticsData, fetchAnalyticsData } = useData();

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analyst Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.name || 'Analyst'}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <CalendarIcon className="w-4 h-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Yield Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData.yieldTrends || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#22c55e" name="Yield" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Add more analyst-specific analytics and reports as needed */}
    </div>
  );
};

export default AnalystDashboard; 