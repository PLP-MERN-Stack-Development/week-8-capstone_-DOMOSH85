import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { BuildingOfficeIcon, DocumentTextIcon, CurrencyDollarIcon, UserGroupIcon, CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip, BarChart, XAxis, YAxis, CartesianGrid, Bar } from 'recharts';

const GovernmentPortal = () => {
  const { user } = useAuth();
  const { governmentData, analyticsData, fetchGovernmentData, fetchAnalyticsData } = useData();
  useEffect(() => {
    fetchGovernmentData();
    fetchAnalyticsData();
  }, [fetchGovernmentData, fetchAnalyticsData]);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Government Portal</h1>
          <p className="text-gray-600">Welcome, {user?.name || 'Official'}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <CalendarIcon className="w-4 h-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
      {/* Government Dashboard Features */}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900">{governmentData.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <UserGroupIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Policies</p>
              <p className="text-2xl font-bold text-gray-900">{governmentData.reduce((sum, d) => sum + (d.policies || 0), 0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <DocumentTextIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Subsidies</p>
              <p className="text-2xl font-bold text-gray-900">{governmentData.reduce((sum, d) => sum + (d.activeSubsidies || 0), 0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <CurrencyDollarIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Regions</p>
              <p className="text-2xl font-bold text-gray-900">{(analyticsData.regionalData && analyticsData.regionalData.length) || 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500">
              <ChartBarIcon className="w-6 h-6 text-white" />
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
          {/* Example: Show recent department/policy/subsidy updates */}
          {governmentData.slice(0, 5).map(dep => (
            <div key={dep.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="w-4 h-4 text-green-600" />
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
            <BuildingOfficeIcon className="w-6 h-6 text-green-600 mr-2" />
            <span className="font-medium text-green-700">Add Department</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-blue-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <UserGroupIcon className="w-6 h-6 text-blue-600 mr-2" />
            <span className="font-medium text-blue-700">Register Farmer</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-purple-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
            <UserGroupIcon className="w-6 h-6 text-purple-600 mr-2" />
            <span className="font-medium text-purple-700">Contact Farmers</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-emerald-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
            <ChartBarIcon className="w-6 h-6 text-emerald-600 mr-2" />
            <span className="font-medium text-emerald-700">Generate Report</span>
          </button>
        </div>
      </div>
      {/* Government Functionalities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Department Management */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Management</h3>
          <p className="text-gray-600">Add, view, and manage government departments.</p>
          {/* TODO: Department management table/component */}
        </div>
        {/* Policy Management */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Management</h3>
          <p className="text-gray-600">Create, edit, and review agricultural policies.</p>
          {/* TODO: Policy management table/component */}
        </div>
        {/* Subsidy Management */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subsidy Management</h3>
          <p className="text-gray-600">Track and manage subsidies for farmers.</p>
          {/* TODO: Subsidy management table/component */}
        </div>
        {/* Regional Analytics */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Analytics</h3>
          <p className="text-gray-600">View analytics and reports by region.</p>
          {/* TODO: Regional analytics component */}
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

export default GovernmentPortal; 