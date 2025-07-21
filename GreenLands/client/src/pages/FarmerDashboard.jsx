import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
  MapIcon,
  ChartBarIcon,
  CogIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const {
    landData,
    fetchLandData,
    crops,
    fetchCrops,
    equipment,
    fetchEquipment,
    fetchFinancialReport
  } = useData();
  const [financialReport, setFinancialReport] = useState(null);
  const [financialLoading, setFinancialLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLandData();
      fetchCrops && fetchCrops(user.id);
      fetchEquipment && fetchEquipment(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setFinancialLoading(true);
      fetchFinancialReport().then((data) => {
        setFinancialReport(data);
        setFinancialLoading(false);
      });
    }
  }, [user]);

  // Filter land records for this farmer
  const myLand = landData.filter(l => l.farmer && (l.farmer._id === user.id || l.farmer === user.id));

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.name || 'Farmer'}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <CalendarIcon className="w-4 h-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Land Parcels</p>
              <p className="text-2xl font-bold text-gray-900">{myLand.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <MapIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Crops</p>
              <p className="text-2xl font-bold text-gray-900">{(crops && crops.length) || 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Equipment</p>
              <p className="text-2xl font-bold text-gray-900">{(equipment && equipment.length) || 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <CogIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                {financialLoading ? '...' : financialReport ? `$${financialReport.balance.toLocaleString()}` : '$0'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500">
              <CurrencyDollarIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* My Land Parcels Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Land Parcels</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left">Name</th>
                <th className="px-2 py-1 text-left">Area</th>
                <th className="px-2 py-1 text-left">Crop</th>
                <th className="px-2 py-1 text-left">Soil Type</th>
                <th className="px-2 py-1 text-left">Status</th>
                <th className="px-2 py-1 text-left">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {myLand.map(land => (
                <tr key={land._id}>
                  <td className="px-2 py-1">{land.name}</td>
                  <td className="px-2 py-1">{land.area} acres</td>
                  <td className="px-2 py-1">{land.crop}</td>
                  <td className="px-2 py-1">{land.soilType}</td>
                  <td className="px-2 py-1 capitalize">{land.status}</td>
                  <td className="px-2 py-1">{new Date(land.lastUpdated).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Income vs Expenses by Month</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={(() => {
                if (!financialReport) return [];
                const byMonth = {};
                financialReport.transactions.forEach(tx => {
                  const d = new Date(tx.date);
                  const key = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}`;
                  if (!byMonth[key]) byMonth[key] = { month: key, income: 0, expense: 0 };
                  if (tx.type === 'income') byMonth[key].income += tx.amount;
                  if (tx.type === 'expense') byMonth[key].expense += tx.amount;
                });
                return Object.values(byMonth).sort((a, b) => a.month.localeCompare(b.month));
              })()}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#22c55e" name="Income" />
              <Bar dataKey="expense" fill="#ef4444" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard; 