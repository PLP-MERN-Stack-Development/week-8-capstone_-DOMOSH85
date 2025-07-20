import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
  DocumentTextIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const GovernmentDashboard = () => {
  const { user } = useAuth();
  const { governmentData, analyticsData, fetchGovernmentData, fetchAnalyticsData } = useData();

  useEffect(() => {
    fetchGovernmentData();
    fetchAnalyticsData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Government Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.name || 'Official'}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <CalendarIcon className="w-4 h-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      {/* Add more government-specific analytics and tables as needed */}
    </div>
  );
};

export default GovernmentDashboard; 