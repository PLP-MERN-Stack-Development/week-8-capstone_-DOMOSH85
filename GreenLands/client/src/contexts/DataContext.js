import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [landData, setLandData] = useState([]);
  const [farmerData, setFarmerData] = useState([]);
  const [governmentData, setGovernmentData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all data from backend on mount
  useEffect(() => {
    if (user && user.id) {
      fetchLandData();
      fetchFarmerData(user.id);
      fetchGovernmentData();
      fetchAnalyticsData();
    }
  }, [user]);

  const fetchLandData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.get('/api/land', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLandData(response.data);
    } catch (error) {
      setError('Failed to fetch land data');
      console.error('Error fetching land data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFarmerData = async (userId) => {
    if (!userId) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.get(`/api/farmers/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFarmerData(response.data);
    } catch (error) {
      setError('Failed to fetch farmer data');
      console.error('Error fetching farmer data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add government data fetcher
  const fetchGovernmentData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.get('/api/government', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGovernmentData(response.data);
    } catch (error) {
      setError('Failed to fetch government data');
      console.error('Error fetching government data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.get('/api/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalyticsData(response.data);
    } catch (error) {
      setError('Failed to fetch analytics data');
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Crop management
  const fetchCrops = async (farmerId) => {
    if (!farmerId) return [];
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.get(`/api/farmers/${farmerId}`,
        { headers: { Authorization: `Bearer ${token}` } });
      // Assuming crops are in response.data.farmDetails.crops
      return response.data.farmDetails?.crops || [];
    } catch (error) {
      setError('Failed to fetch crops');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addCrop = async (farmerId, crop) => {
    try {
      const token = localStorage.getItem('token');
      await api.post(`/api/farmers/${farmerId}/crops`, { crop }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { success: true };
    } catch (error) {
      setError('Failed to add crop');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const deleteCrop = async (farmerId, crop) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/api/farmers/${farmerId}/crops/${encodeURIComponent(crop)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { success: true };
    } catch (error) {
      setError('Failed to delete crop');
      return { success: false, error: error.response?.data?.message };
    }
  };

  // Equipment management
  const fetchEquipment = async (farmerId) => {
    if (!farmerId) return [];
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.get(`/api/farmers/${farmerId}`,
        { headers: { Authorization: `Bearer ${token}` } });
      // Assuming equipment is in response.data.farmDetails.equipment
      return response.data.farmDetails?.equipment || [];
    } catch (error) {
      setError('Failed to fetch equipment');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addEquipment = async (farmerId, equipment) => {
    try {
      const token = localStorage.getItem('token');
      await api.post(`/api/farmers/${farmerId}/equipment`, { equipment }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { success: true };
    } catch (error) {
      setError('Failed to add equipment');
      return { success: false, error: error.response?.data?.message };
    }
  };

  // Resources (static for now, can be replaced with backend fetch)
  const fetchResources = async () => {
    // Replace with backend call if available
    return [
      {
        id: 1,
        title: 'Sustainable Farming Guide',
        type: 'PDF',
        description: 'Comprehensive guide to sustainable farming practices',
        url: '#'
      },
      {
        id: 2,
        title: 'Crop Disease Prevention',
        type: 'Video',
        description: 'Learn how to prevent common crop diseases',
        url: '#'
      },
      {
        id: 3,
        title: 'Government Subsidies 2024',
        type: 'Document',
        description: 'Updated information on available subsidies',
        url: '#'
      }
    ];
  };

  const addLandRecord = async (landData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/api/land', landData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLandData(prev => [...prev, response.data]);
      return { success: true };
    } catch (error) {
      setError('Failed to add land record');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const updateLandRecord = async (id, landData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(`/api/land/${id}`, landData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLandData(prev => prev.map(item => item.id === id ? response.data : item));
      return { success: true };
    } catch (error) {
      setError('Failed to update land record');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const fetchFinancialReport = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.get('/api/finance/report', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      setError('Failed to fetch financial report');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add this function to fetch notifications from backend
  const fetchNotifications = async (user) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/communication/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      return data;
    } catch (error) {
      setError('Failed to fetch notifications');
      return [];
    }
  };

  const value = {
    landData,
    farmerData,
    governmentData,
    analyticsData,
    loading,
    error,
    fetchLandData,
    fetchFarmerData,
    fetchGovernmentData,
    fetchAnalyticsData,
    addLandRecord,
    updateLandRecord,
    fetchCrops,
    addCrop,
    deleteCrop,
    fetchEquipment,
    addEquipment,
    fetchResources,
    fetchFinancialReport,
    fetchNotifications // <-- add this
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}; 