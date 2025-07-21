import React from 'react';
import { useData } from '../contexts/DataContext';
import {
  MapIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  CalendarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { analyticsData } = useData();

  const stats = [
    {
      name: 'Total Land Area',
      value: `${analyticsData.totalLand} acres`,
      change: '+12.5%',
      changeType: 'positive',
      icon: MapIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Active Farmers',
      value: analyticsData.activeFarmers,
      change: '+8.2%',
      changeType: 'positive',
      icon: UserGroupIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Government Partners',
      value: analyticsData.governmentPartners,
      change: '+2',
      changeType: 'positive',
      icon: BuildingOfficeIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Sustainability Score',
      value: `${analyticsData.sustainabilityScore}%`,
      change: '+5.3%',
      changeType: 'positive',
      icon: SparklesIcon,
      color: 'bg-emerald-500',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'land_update',
      title: 'North Field Updated',
      description: 'John Smith updated crop information for North Field',
      time: '2 hours ago',
      icon: MapIcon,
    },
    {
      id: 2,
      type: 'farmer_joined',
      title: 'New Farmer Registration',
      description: 'Sarah Johnson joined the platform',
      time: '4 hours ago',
      icon: UserGroupIcon,
    },
    {
      id: 3,
      type: 'policy_update',
      title: 'New Policy Announced',
      description: 'Agriculture Department released new subsidy guidelines',
      time: '6 hours ago',
      icon: BuildingOfficeIcon,
    },
    {
      id: 4,
      type: 'analytics_report',
      title: 'Monthly Report Generated',
      description: 'Analytics report for January 2024 is ready',
      time: '1 day ago',
      icon: ChartBarIcon,
    },
  ];

  const cropData = Object.entries(analyticsData.cropDistribution || {}).map(([crop, percentage]) => ({
    name: crop.charAt(0).toUpperCase() + crop.slice(1),
    value: percentage,
  }));

  const COLORS = ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to GreenLands land management platform</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <CalendarIcon className="w-4 h-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingUpIcon className={`w-4 h-4 ${
                    stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                  }`} />
                  <span className={`text-sm font-medium ml-1 ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crop Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Crop Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cropData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {cropData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Data */}
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
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <activity.icon className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <ClockIcon className="w-3 h-3 mr-1" />
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
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
    </div>
  );
};

export default Dashboard; 