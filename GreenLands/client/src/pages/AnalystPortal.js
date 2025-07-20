import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { ChartBarIcon, CalendarIcon, MapIcon, UserGroupIcon, SparklesIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const AnalystPortal = () => {
  const { user } = useAuth();
  const { analyticsData, fetchAnalyticsData } = useData();
  useEffect(() => {
    fetchAnalyticsData();
  }, []);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analyst Portal</h1>
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
      {/* Analyst Dashboard Features */}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Land Area</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalLand || 0} acres</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <MapIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Farmers</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.activeFarmers || 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <UserGroupIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sustainability Score</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.sustainabilityScore || 0}%</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Government Partners</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.governmentPartners || 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <BuildingOfficeIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Crop Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Crop Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(analyticsData.cropDistribution || {}).map(([name, value]) => ({ name, value }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(Object.entries(analyticsData.cropDistribution || {})).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={["#22c55e", "#3b82f6", "#8b5cf6", "#f59e0b"][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Regional Land Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Land Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.regionalData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="landArea" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {/* Example: Show recent analytics/report activities */}
          {/* If you have a real recent activity API, use it here. Otherwise, show a placeholder. */}
          <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Analytics Data Updated</p>
              <p className="text-sm text-gray-600">Latest analytics data has been refreshed.</p>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="card mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-emerald-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
            <ChartBarIcon className="w-6 h-6 text-emerald-600 mr-2" />
            <span className="font-medium text-emerald-700">Generate Report</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-blue-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <UserGroupIcon className="w-6 h-6 text-blue-600 mr-2" />
            <span className="font-medium text-blue-700">Export Data</span>
          </button>
        </div>
      </div>
      {/* Analyst Functionalities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Yield Analytics */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Yield Analytics</h3>
          <p className="text-gray-600">Analyze crop yield trends and performance.</p>
          {/* TODO: Yield analytics chart/component */}
        </div>
        {/* Report Generation */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Generation</h3>
          <p className="text-gray-600">Generate and download detailed analytics reports.</p>
          {/* TODO: Report generation component */}
        </div>
        {/* Insights */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights</h3>
          <p className="text-gray-600">Get actionable insights from agricultural data.</p>
          {/* TODO: Insights component */}
        </div>
        {/* Data Export */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Export</h3>
          <p className="text-gray-600">Export analytics data for further analysis.</p>
          {/* TODO: Data export component */}
        </div>
        {/* Support */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Support</h3>
          <p className="text-gray-600">Request help or contact support for assistance.</p>
          {/* TODO: Support request form/component */}
        </div>
      </div>
    </div>
  );
};

export default AnalystPortal; 