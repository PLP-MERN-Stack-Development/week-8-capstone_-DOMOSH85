import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { UserGroupIcon, CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { analyticsData, fetchAnalyticsData, farmerData, fetchFarmerData, governmentData, fetchGovernmentData } = useData();

  useEffect(() => {
    fetchAnalyticsData();
    fetchFarmerData();
    fetchGovernmentData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.name || 'Admin'}</p>
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
              <p className="text-sm font-medium text-gray-600">Total Farmers</p>
              <p className="text-2xl font-bold text-gray-900">{farmerData.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <UserGroupIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Government Officials</p>
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
              <p className="text-sm font-medium text-gray-600">Total Land Area</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalLand} acres</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        {/* Add more admin-specific stats as needed */}
      </div>
      {/* Add more admin-specific tables and management tools as needed */}
    </div>
  );
};

export default AdminDashboard; 