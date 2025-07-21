import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
  MapIcon,
  CogIcon,
  CloudIcon,
  DocumentTextIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  PlusIcon,
  PencilIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  SparklesIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import * as Dialog from '@radix-ui/react-dialog';

const FarmerPortal = () => {
  const { user } = useAuth();
  const {
    landData,
    analyticsData,
    fetchCrops,
    addCrop,
    deleteCrop,
    fetchEquipment,
    addEquipment,
    fetchResources,
    loading,
    error,
    fetchFinancialReport
  } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [cropForm, setCropForm] = useState({
    name: '',
    area: '',
    cropType: '',
    plantingDate: '',
    expectedHarvest: '',
    notes: ''
  });
  const [equipmentForm, setEquipmentForm] = useState({
    name: '',
    type: '',
    purchaseDate: '',
    maintenanceDate: '',
    status: 'active'
  });
  // Farmer-specific data
  const myLand = landData.filter(l => l.farmer && (l.farmer._id === user.id || l.farmer === user.id));
  const myLandArea = myLand.reduce((sum, l) => sum + (l.area || 0), 0);
  const [crops, setCrops] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [resources, setResources] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [financialReport, setFinancialReport] = useState(null);
  const [financialLoading, setFinancialLoading] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportForm, setSupportForm] = useState({ subject: '', message: '' });
  const [supportLoading, setSupportLoading] = useState(false);
  // Add Land Record modal state and form
  const [showAddLand, setShowAddLand] = useState(false);
  const [landForm, setLandForm] = useState({
    name: '',
    area: '',
    crop: '',
    soilType: '',
    coordinates: ['', '']
  });
  const [addLandLoading, setAddLandLoading] = useState(false);
  // Contact Government modal state and form
  const [showContactGov, setShowContactGov] = useState(false);
  const [govContacts, setGovContacts] = useState([]);
  const [contactGovForm, setContactGovForm] = useState({ recipientId: '', subject: '', content: '' });
  const [contactGovLoading, setContactGovLoading] = useState(false);
  // Apply for Subsidy modal state and logic
  const [showApplySubsidy, setShowApplySubsidy] = useState(false);
  const [subsidies, setSubsidies] = useState([]);
  const [selectedSubsidy, setSelectedSubsidy] = useState('');
  const [applySubsidyLoading, setApplySubsidyLoading] = useState(false);
  const [applicationNote, setApplicationNote] = useState('');
  // Generate Report logic
  const [reportLoading, setReportLoading] = useState(false);
  const handleGenerateReport = async () => {
    if (!user || !user.id) return;
    setReportLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/farmers/${user.id}/report`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to generate report');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `farmer_report_${user.name.replace(/\s+/g, '_')}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Report downloaded!');
    } catch (err) {
      toast.error('Failed to generate report');
    }
    setReportLoading(false);
  };

  const handleLandFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'coordinates0' || name === 'coordinates1') {
      const idx = name === 'coordinates0' ? 0 : 1;
      setLandForm({ ...landForm, coordinates: landForm.coordinates.map((c, i) => i === idx ? value : c) });
    } else {
      setLandForm({ ...landForm, [name]: value });
    }
  };

  const handleAddLandSubmit = async (e) => {
    e.preventDefault();
    setAddLandLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/land`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...landForm,
          area: parseFloat(landForm.area),
          coordinates: landForm.coordinates.map(Number)
        })
      });
      if (!res.ok) throw new Error('Failed to add land record');
      toast.success('Land record added!');
      setShowAddLand(false);
      setLandForm({ name: '', area: '', crop: '', soilType: '', coordinates: ['', ''] });
      // Optionally refetch land data here if needed
    } catch (err) {
      toast.error('Failed to add land record');
    }
    setAddLandLoading(false);
  };

  // Mock weather data
  useEffect(() => {
    setWeatherData({
      temperature: 24,
      humidity: 65,
      windSpeed: 12,
      condition: 'Partly Cloudy',
      forecast: [
        { day: 'Today', temp: 24, condition: 'Partly Cloudy' },
        { day: 'Tomorrow', temp: 26, condition: 'Sunny' },
        { day: 'Wednesday', temp: 22, condition: 'Rainy' }
      ]
    });
  }, []);

  useEffect(() => {
    if (user) {
      setDataLoading(true);
      Promise.all([
        fetchCrops(user.id),
        fetchEquipment(user.id),
        fetchResources()
      ]).then(([cropsData, equipmentData, resourcesData]) => {
        setCrops(cropsData);
        setEquipment(equipmentData);
        setResources(resourcesData);
        setDataLoading(false);
      });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'finance' && user) {
      setFinancialLoading(true);
      fetchFinancialReport().then((data) => {
        setFinancialReport(data);
        setFinancialLoading(false);
      });
    }
  }, [activeTab, user]);

  const handleCropSubmit = async (e) => {
    e.preventDefault();
    if (!cropForm.name) return toast.error('Crop name is required');
    setDataLoading(true);
    const result = await addCrop(user.id, cropForm.name);
    if (result.success) {
      const updatedCrops = await fetchCrops(user.id);
      setCrops(updatedCrops);
      setShowAddCrop(false);
      setCropForm({ name: '', area: '', cropType: '', plantingDate: '', expectedHarvest: '', notes: '' });
      toast.success('Crop added successfully!');
    } else {
      toast.error(result.error || 'Failed to add crop');
    }
    setDataLoading(false);
  };

  const handleDeleteCrop = async (cropName) => {
    setDataLoading(true);
    const result = await deleteCrop(user.id, cropName);
    if (result.success) {
      const updatedCrops = await fetchCrops(user.id);
      setCrops(updatedCrops);
      toast.success('Crop deleted successfully!');
    } else {
      toast.error(result.error || 'Failed to delete crop');
    }
    setDataLoading(false);
  };

  const handleEquipmentSubmit = async (e) => {
    e.preventDefault();
    if (!equipmentForm.name) return toast.error('Equipment name is required');
    setDataLoading(true);
    const result = await addEquipment(user.id, equipmentForm.name);
    if (result.success) {
      const updatedEquipment = await fetchEquipment(user.id);
      setEquipment(updatedEquipment);
      setShowAddEquipment(false);
      setEquipmentForm({ name: '', type: '', purchaseDate: '', maintenanceDate: '', status: 'active' });
      toast.success('Equipment added successfully!');
    } else {
      toast.error(result.error || 'Failed to add equipment');
    }
    setDataLoading(false);
  };

  const handleSupportChange = (e) => {
    setSupportForm({ ...supportForm, [e.target.name]: e.target.value });
  };

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    setSupportLoading(true);
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL}/api/communication/support`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(supportForm)
      });
      toast.success('Support request sent!');
      setSupportForm({ subject: '', message: '' });
      setSupportOpen(false);
    } catch (err) {
      toast.error('Failed to send support request');
    }
    setSupportLoading(false);
  };

  const openContactGov = async () => {
    setShowContactGov(true);
    // Fetch government contacts only when opening modal
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/communication/contacts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setGovContacts(data.filter(u => u.role === 'government'));
    } catch (err) {
      toast.error('Failed to load government contacts');
    }
  };

  const handleContactGovChange = (e) => {
    setContactGovForm({ ...contactGovForm, [e.target.name]: e.target.value });
  };

  const handleContactGovSubmit = async (e) => {
    e.preventDefault();
    setContactGovLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/communication/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(contactGovForm)
      });
      if (!res.ok) throw new Error('Failed to send message');
      toast.success('Message sent to government!');
      setShowContactGov(false);
      setContactGovForm({ recipientId: '', subject: '', content: '' });
    } catch (err) {
      toast.error('Failed to send message');
    }
    setContactGovLoading(false);
  };

  const openApplySubsidy = async () => {
    setShowApplySubsidy(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/subsidies`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setSubsidies(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load subsidies');
    }
  };

  const handleApplySubsidy = async (e) => {
    e.preventDefault();
    setApplySubsidyLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/subsidies/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subsidyId: selectedSubsidy,
          applicationData: { note: applicationNote }
        })
      });
      if (!res.ok) throw new Error('Failed to apply for subsidy');
      toast.success('Subsidy application submitted!');
      setShowApplySubsidy(false);
      setSelectedSubsidy('');
      setApplicationNote('');
    } catch (err) {
      toast.error('Failed to apply for subsidy');
    }
    setApplySubsidyLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="card mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-green-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors" onClick={() => setShowAddLand(true)}>
            <MapIcon className="w-6 h-6 text-green-600 mr-2" />
            <span className="font-medium text-green-700">Add Land Record</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-purple-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors" onClick={openContactGov}>
            <BuildingOfficeIcon className="w-6 h-6 text-purple-600 mr-2" />
            <span className="font-medium text-purple-700">Contact Government</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-emerald-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors" onClick={openApplySubsidy}>
            <CurrencyDollarIcon className="w-6 h-6 text-emerald-600 mr-2" />
            <span className="font-medium text-emerald-700">Apply for Subsidy</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-blue-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors" onClick={handleGenerateReport} disabled={reportLoading || !user || !user.id}>
            <ChartBarIcon className="w-6 h-6 text-blue-600 mr-2" />
            <span className="font-medium text-blue-700">{reportLoading ? 'Generating...' : 'Generate Report'}</span>
          </button>
        </div>
      </div>

      {/* Apply for Subsidy Modal */}
      <Dialog.Root open={showApplySubsidy} onOpenChange={setShowApplySubsidy}>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50">
          <Dialog.Description>This dialog allows you to apply for a subsidy.</Dialog.Description>
          <Dialog.Title className="text-lg font-bold mb-4">Apply for Subsidy</Dialog.Title>
          <form onSubmit={handleApplySubsidy} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Subsidy</label>
              <select value={selectedSubsidy} onChange={e => setSelectedSubsidy(e.target.value)} className="input w-full" required>
                <option value="">Choose a subsidy</option>
                {(Array.isArray(subsidies) ? subsidies : []).map(sub => (
                  <option key={sub._id} value={sub._id}>{sub.name} (Deadline: {new Date(sub.applicationDeadline).toLocaleDateString()})</option>
                ))}
              </select>
            </div>
            {selectedSubsidy && (
              <div className="bg-gray-50 p-3 rounded border text-sm">
                <div className="font-semibold mb-1">{subsidies.find(s => s._id === selectedSubsidy)?.name}</div>
                <div>{subsidies.find(s => s._id === selectedSubsidy)?.description}</div>
                <div className="mt-1 text-green-700">Eligibility: {subsidies.find(s => s._id === selectedSubsidy)?.eligibility}</div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Application Note (optional)</label>
              <textarea value={applicationNote} onChange={e => setApplicationNote(e.target.value)} className="input w-full" rows={3} placeholder="Add any relevant info..." />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" className="btn-secondary" onClick={() => setShowApplySubsidy(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={applySubsidyLoading || !selectedSubsidy}>{applySubsidyLoading ? 'Applying...' : 'Apply'}</button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Root>
      {/* Add Land Record Modal */}
      <Dialog.Root open={showAddLand} onOpenChange={setShowAddLand}>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50">
          <Dialog.Description>This dialog allows you to add a land record.</Dialog.Description>
          <Dialog.Title className="text-lg font-bold mb-4">Add Land Record</Dialog.Title>
          <form onSubmit={handleAddLandSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input name="name" value={landForm.name} onChange={handleLandFormChange} className="input w-full" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Area (acres)</label>
              <input name="area" type="number" min="0" step="0.01" value={landForm.area} onChange={handleLandFormChange} className="input w-full" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Crop</label>
              <input name="crop" value={landForm.crop} onChange={handleLandFormChange} className="input w-full" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Soil Type</label>
              <input name="soilType" value={landForm.soilType} onChange={handleLandFormChange} className="input w-full" required />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Latitude</label>
                <input name="coordinates0" value={landForm.coordinates[0]} onChange={handleLandFormChange} className="input w-full" required />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Longitude</label>
                <input name="coordinates1" value={landForm.coordinates[1]} onChange={handleLandFormChange} className="input w-full" required />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" className="btn-secondary" onClick={() => setShowAddLand(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={addLandLoading}>{addLandLoading ? 'Adding...' : 'Add Land'}</button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Root>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Farmer Portal</h1>
          <p className="text-gray-600">Welcome back, {user?.name || 'Farmer'}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</span>
          <button
            className="btn-secondary ml-2"
            onClick={() => setSupportOpen(true)}
          >
            Help & Support
          </button>
        </div>
      </div>

      {/* Farmer Dashboard Features */}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Land Area</p>
              <p className="text-2xl font-bold text-gray-900">{myLandArea} acres</p>
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
              <p className="text-2xl font-bold text-gray-900">{crops.length}</p>
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
              <p className="text-2xl font-bold text-gray-900">{equipment.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <CogIcon className="w-6 h-6 text-white" />
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
          {/* Example: Show recent land/crop updates for this farmer */}
          {myLand.slice(0, 5).map(land => (
            <div key={land.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapIcon className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{land.name} Updated</p>
                <p className="text-sm text-gray-600">Area: {land.area} acres, Crop: {land.crop}</p>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <span>{new Date(land.lastUpdated).toLocaleDateString()}</span>
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
          <button className="flex items-center justify-center p-4 border-2 border-green-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors" onClick={() => setShowAddLand(true)}>
            <MapIcon className="w-6 h-6 text-green-600 mr-2" />
            <span className="font-medium text-green-700">Add Land Record</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-purple-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors" onClick={openContactGov}>
            <BuildingOfficeIcon className="w-6 h-6 text-purple-600 mr-2" />
            <span className="font-medium text-purple-700">Contact Government</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-emerald-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors" onClick={openApplySubsidy}>
            <CurrencyDollarIcon className="w-6 h-6 text-emerald-600 mr-2" />
            <span className="font-medium text-emerald-700">Apply for Subsidy</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-blue-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors" onClick={handleGenerateReport} disabled={reportLoading || !user || !user.id}>
            <ChartBarIcon className="w-6 h-6 text-blue-600 mr-2" />
            <span className="font-medium text-blue-700">{reportLoading ? 'Generating...' : 'Generate Report'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: ChartBarIcon },
            { id: 'crops', name: 'Crop Management', icon: MapIcon },
            { id: 'equipment', name: 'Equipment', icon: CogIcon },
            { id: 'resources', name: 'Resources', icon: DocumentTextIcon },
            { id: 'finance', name: 'Financial Report', icon: CurrencyDollarIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <CalendarIcon className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Crop planted in North Field</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <InformationCircleIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Equipment maintenance scheduled</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Weather alert: Rain expected</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Crops Tab */}
        {activeTab === 'crops' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Crop Management</h3>
              <button
                onClick={() => setShowAddCrop(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add New Crop</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {crops.map((crop) => (
                <div key={crop.id} className="card-hover">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">{crop.name}</h4>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCrop(crop.name)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Crop Type:</span>
                      <span className="text-sm font-medium">{crop.cropType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Area:</span>
                      <span className="text-sm font-medium">{crop.area} acres</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Progress:</span>
                      <span className="text-sm font-medium">{crop.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${crop.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Crop Modal */}
            {showAddCrop && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Crop</h3>
                  <form onSubmit={handleCropSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Field Name
                      </label>
                      <input
                        type="text"
                        value={cropForm.name}
                        onChange={(e) => setCropForm({...cropForm, name: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Crop Type
                      </label>
                      <select
                        value={cropForm.cropType}
                        onChange={(e) => setCropForm({...cropForm, cropType: e.target.value})}
                        className="input-field"
                        required
                      >
                        <option value="">Select crop type</option>
                        <option value="Wheat">Wheat</option>
                        <option value="Corn">Corn</option>
                        <option value="Soybeans">Soybeans</option>
                        <option value="Rice">Rice</option>
                        <option value="Cotton">Cotton</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Area (acres)
                      </label>
                      <input
                        type="number"
                        value={cropForm.area}
                        onChange={(e) => setCropForm({...cropForm, area: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Planting Date
                      </label>
                      <input
                        type="date"
                        value={cropForm.plantingDate}
                        onChange={(e) => setCropForm({...cropForm, plantingDate: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expected Harvest Date
                      </label>
                      <input
                        type="date"
                        value={cropForm.expectedHarvest}
                        onChange={(e) => setCropForm({...cropForm, expectedHarvest: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        value={cropForm.notes}
                        onChange={(e) => setCropForm({...cropForm, notes: e.target.value})}
                        className="input-field"
                        rows="3"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="btn-primary flex-1"
                      >
                        Add Crop
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddCrop(false)}
                        className="btn-secondary flex-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Equipment Tab */}
        {activeTab === 'equipment' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Equipment Management</h3>
              <button
                onClick={() => setShowAddEquipment(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Equipment</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipment.map((item) => (
                <div key={item.id} className="card-hover">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Type:</span>
                      <span className="text-sm font-medium">{item.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Purchase Date:</span>
                      <span className="text-sm font-medium">{item.purchaseDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Next Maintenance:</span>
                      <span className="text-sm font-medium">{item.maintenanceDate}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="btn-secondary text-xs py-1 px-2">
                      Schedule Maintenance
                    </button>
                    <button className="btn-secondary text-xs py-1 px-2">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Equipment Modal */}
            {showAddEquipment && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Equipment</h3>
                  <form onSubmit={handleEquipmentSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Equipment Name
                      </label>
                      <input
                        type="text"
                        value={equipmentForm.name}
                        onChange={(e) => setEquipmentForm({...equipmentForm, name: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Equipment Type
                      </label>
                      <select
                        value={equipmentForm.type}
                        onChange={(e) => setEquipmentForm({...equipmentForm, type: e.target.value})}
                        className="input-field"
                        required
                      >
                        <option value="">Select equipment type</option>
                        <option value="Tractor">Tractor</option>
                        <option value="Harvester">Harvester</option>
                        <option value="Irrigation">Irrigation System</option>
                        <option value="Seeder">Seeder</option>
                        <option value="Sprayer">Sprayer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Purchase Date
                      </label>
                      <input
                        type="date"
                        value={equipmentForm.purchaseDate}
                        onChange={(e) => setEquipmentForm({...equipmentForm, purchaseDate: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Next Maintenance Date
                      </label>
                      <input
                        type="date"
                        value={equipmentForm.maintenanceDate}
                        onChange={(e) => setEquipmentForm({...equipmentForm, maintenanceDate: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="btn-primary flex-1"
                      >
                        Add Equipment
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddEquipment(false)}
                        className="btn-secondary flex-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Farming Resources</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <div key={resource.id} className="card-hover">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-500">{resource.type}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{resource.title}</h4>
                  <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                  <button className="btn-primary w-full">
                    View Resource
                  </button>
                </div>
              ))}
            </div>

            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-4">Government Support</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <h5 className="font-medium text-green-900">Subsidy Application</h5>
                    <p className="text-sm text-green-700">Apply for agricultural subsidies</p>
                  </div>
                  <button className="btn-primary">Apply Now</button>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h5 className="font-medium text-blue-900">Technical Support</h5>
                    <p className="text-sm text-blue-700">Get expert farming advice</p>
                  </div>
                  <button className="btn-primary">Contact Expert</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Financial Report Tab */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Report</h3>
            {financialLoading ? (
              <div>Loading financial report...</div>
            ) : financialReport ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="card text-center">
                    <div className="text-sm text-gray-500">Total Income</div>
                    <div className="text-2xl font-bold text-green-600">${financialReport.totalIncome.toLocaleString()}</div>
                  </div>
                  <div className="card text-center">
                    <div className="text-sm text-gray-500">Total Expenses</div>
                    <div className="text-2xl font-bold text-red-600">${financialReport.totalExpenses.toLocaleString()}</div>
                  </div>
                  <div className="card text-center">
                    <div className="text-sm text-gray-500">Balance</div>
                    <div className="text-2xl font-bold text-blue-600">${financialReport.balance.toLocaleString()}</div>
                  </div>
                </div>
                {/* Chart: Income vs Expenses by Month */}
                <div className="card mb-6">
                  <h4 className="font-semibold mb-2">Income vs Expenses by Month</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={(() => {
                        // Group transactions by month
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
                      <Legend />
                      <Bar dataKey="income" fill="#22c55e" name="Income" />
                      <Bar dataKey="expense" fill="#ef4444" name="Expense" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {/* Table of Transactions */}
                <div className="card overflow-x-auto">
                  <h4 className="font-semibold mb-2">Transactions</h4>
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        <th className="px-2 py-1 text-left">Date</th>
                        <th className="px-2 py-1 text-left">Type</th>
                        <th className="px-2 py-1 text-left">Amount</th>
                        <th className="px-2 py-1 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financialReport.transactions.map(tx => (
                        <tr key={tx._id}>
                          <td className="px-2 py-1">{new Date(tx.date).toLocaleDateString()}</td>
                          <td className="px-2 py-1 capitalize">{tx.type}</td>
                          <td className={`px-2 py-1 font-medium ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{tx.amount.toLocaleString()}</td>
                          <td className="px-2 py-1">{tx.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div>No financial data available.</div>
            )}
          </div>
        )}
      </div>

      {/* Help & Support Modal */}
      <Dialog.Root open={supportOpen} onOpenChange={setSupportOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-lg z-50">
            <Dialog.Title className="text-xl font-bold mb-4">Help & Support</Dialog.Title>
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Frequently Asked Questions</h4>
              <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                <li>How do I add a new crop? — Use the Crop Management tab and click 'Add New Crop'.</li>
                <li>How do I update my equipment? — Go to the Equipment tab and click 'Add Equipment'.</li>
                <li>How do I view my financial report? — Open the Financial Report tab for details and charts.</li>
                <li>Need more help? Use the form below to contact support.</li>
              </ul>
            </div>
            <form onSubmit={handleSupportSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={supportForm.subject}
                  onChange={handleSupportChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  name="message"
                  value={supportForm.message}
                  onChange={handleSupportChange}
                  className="w-full border rounded px-3 py-2 min-h-[80px]"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={supportLoading}
                >
                  {supportLoading ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Contact Government Modal */}
      <Dialog.Root open={showContactGov} onOpenChange={setShowContactGov}>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50">
          <Dialog.Description>This dialog allows you to contact a government official.</Dialog.Description>
          <Dialog.Title className="text-lg font-bold mb-4">Contact Government</Dialog.Title>
          <form onSubmit={handleContactGovSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Recipient</label>
              <select name="recipientId" value={contactGovForm.recipientId} onChange={handleContactGovChange} className="input w-full" required>
                <option value="">Select government contact</option>
                {govContacts.map(gov => (
                  <option key={gov._id} value={gov._id}>{gov.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input name="subject" value={contactGovForm.subject} onChange={handleContactGovChange} className="input w-full" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea name="content" value={contactGovForm.content} onChange={handleContactGovChange} className="input w-full" rows={4} required />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" className="btn-secondary" onClick={() => setShowContactGov(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={contactGovLoading}>{contactGovLoading ? 'Sending...' : 'Send'}</button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};

export default FarmerPortal; 