import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { UserGroupIcon, CalendarIcon, ChartBarIcon, MapIcon, BuildingOfficeIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { ResponsiveContainer, PieChart, Pie, Tooltip, BarChart, CartesianGrid, XAxis, YAxis, Cell, Bar } from 'recharts';

const AdminPortal = () => {
  const { user } = useAuth();
  const { analyticsData, farmerData, governmentData, fetchFarmerData, fetchGovernmentData } = useData();
  useEffect(() => {
    fetchFarmerData();
    fetchGovernmentData();
  }, []);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-600">Welcome, {user?.name || 'Admin'}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <CalendarIcon className="w-4 h-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
      {/* Admin Dashboard Features */}
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
              <p className="text-sm font-medium text-gray-600">Government Partners</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.governmentPartners || 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <BuildingOfficeIcon className="w-6 h-6 text-white" />
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
          {/* Example: Show recent farmer/government/land updates */}
          {farmerData.slice(0, 2).map(farmer => (
            <div key={farmer.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{farmer.name} Registered</p>
                <p className="text-sm text-gray-600">Location: {farmer.location}</p>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <span>{farmer.joinDate}</span>
                </div>
              </div>
            </div>
          ))}
          {governmentData.slice(0, 2).map(dep => (
            <div key={dep.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BuildingOfficeIcon className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{dep.department} Updated</p>
                <p className="text-sm text-gray-600">Policies: {dep.policies}, Subsidies: {dep.activeSubsidies}</p>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <span>{dep.contact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="card mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-green-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
            <MapIcon className="w-6 h-6 text-green-600 mr-2" />
            <span className="font-medium text-green-700">Add Land Record</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-blue-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <UserGroupIcon className="w-6 h-6 text-blue-600 mr-2" />
            <span className="font-medium text-blue-700">Register Farmer</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-purple-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
            <BuildingOfficeIcon className="w-6 h-6 text-purple-600 mr-2" />
            <span className="font-medium text-purple-700">Contact Government</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-emerald-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
            <ChartBarIcon className="w-6 h-6 text-emerald-600 mr-2" />
            <span className="font-medium text-emerald-700">Generate Report</span>
          </button>
        </div>
      </div>
      {/* Admin Functionalities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* User Management */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
          <p className="text-gray-600">Add, edit, or remove users. Assign roles and permissions.</p>
          {/* TODO: User management table/component */}
        </div>
        {/* Role Management */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Management</h3>
          <p className="text-gray-600">Create, edit, or delete roles. Manage role-based access.</p>
          {/* TODO: Role management table/component */}
        </div>
        {/* System Settings */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
          <p className="text-gray-600">Configure system-wide settings and preferences.</p>
          {/* TODO: System settings form/component */}
        </div>
        {/* Activity Logs */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Logs</h3>
          <p className="text-gray-600">View recent admin and user activities for auditing.</p>
          {/* TODO: Activity logs table/component */}
        </div>
      </div>
    </div>
  );
};

export default AdminPortal; 