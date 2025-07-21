import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import {
  MapIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  CogIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CloudIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const LandMapping = () => {
  const { landData, addLandRecord } = useData();
  const [selectedLand, setSelectedLand] = useState(null);
  const [showAddLand, setShowAddLand] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [mapView, setMapView] = useState('satellite');
  const [landForm, setLandForm] = useState({
    name: '',
    area: '',
    cropType: '',
    soilType: '',
    coordinates: '',
    status: 'active',
    notes: ''
  });

  // Use real backend data
  const filteredLand = landData.filter(land => {
    const matchesSearch = land.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (land.cropType || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || land.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const soilTypes = [
    { type: 'Loamy', quality: 'Excellent', ph: 6.5, nutrients: 'High' },
    { type: 'Clay', quality: 'Good', ph: 6.0, nutrients: 'Medium' },
    { type: 'Sandy', quality: 'Fair', ph: 5.5, nutrients: 'Low' }
  ];

  const handleLandSubmit = async (e) => {
    e.preventDefault();
    try {
      const newLand = {
        ...landForm,
        id: Date.now(),
        lastUpdated: new Date().toISOString(),
        yield: Math.floor(Math.random() * 20) + 70,
        irrigation: 'Sprinkler'
      };
      
      await addLandRecord(newLand);
      setLandForm({
        name: '',
        area: '',
        cropType: '',
        soilType: '',
        coordinates: '',
        status: 'active',
        notes: ''
      });
      setShowAddLand(false);
      toast.success('Land parcel added successfully!');
    } catch (error) {
      toast.error('Failed to add land parcel');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Land Mapping</h1>
          <p className="text-gray-600">Interactive maps and land management tools</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMapView(mapView === 'satellite' ? 'terrain' : 'satellite')}
            className="btn-secondary flex items-center space-x-2"
          >
            <MapIcon className="w-4 h-4" />
            <span>{mapView === 'satellite' ? 'Terrain' : 'Satellite'}</span>
          </button>
          <button
            onClick={() => setShowAddLand(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Land Parcel</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search land parcels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="planning">Planning</option>
              <option value="fallow">Fallow</option>
            </select>
            <button className="btn-secondary flex items-center space-x-2">
              <FunnelIcon className="w-4 h-4" />
              <span>Advanced</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map and Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Interactive Map</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{mapView} view</span>
                <CogIcon className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="h-96 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center relative overflow-hidden">
              {/* Mock Map */}
              <div className="absolute inset-0 bg-green-200 opacity-20"></div>
              <div className="relative z-10 text-center">
                <MapIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Interactive Map</h4>
                <p className="text-gray-600 mb-4">Click on land parcels to view details</p>
                <div className="flex justify-center space-x-4">
                  {filteredLand.map((land, index) => (
                    <button
                      key={land.id}
                      onClick={() => setSelectedLand(land)}
                      className={`p-3 rounded-lg transition-colors ${
                        selectedLand?.id === land.id
                          ? 'bg-green-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-green-50'
                      }`}
                    >
                      <div className="text-xs font-medium">{land.name}</div>
                      <div className="text-xs opacity-75">{land.area} acres</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Land Parcels List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Land Parcels</h3>
          <div className="space-y-3">
            {filteredLand.map((land) => (
              <div
                key={land.id}
                className={`card-hover cursor-pointer ${
                  selectedLand?.id === land.id ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => setSelectedLand(land)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{land.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    land.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : land.status === 'planning'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {land.status}
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Area:</span>
                    <span className="font-medium">{land.area} acres</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Crop:</span>
                    <span className="font-medium">{land.cropType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Yield:</span>
                    <span className="font-medium">{land.yield}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Land Details */}
      {selectedLand && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Land Details: {selectedLand.name}</h3>
            <div className="flex items-center space-x-2">
              <button className="btn-secondary text-xs py-1 px-2">
                <PencilIcon className="w-3 h-3 mr-1" />
                Edit
              </button>
              <button className="btn-secondary text-xs py-1 px-2 text-red-600 hover:text-red-700">
                <TrashIcon className="w-3 h-3 mr-1" />
                Delete
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Basic Information</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Area:</span>
                  <span className="font-medium">{selectedLand.area} acres</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Crop Type:</span>
                  <span className="font-medium">{selectedLand.cropType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium capitalize">{selectedLand.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Owner:</span>
                  <span className="font-medium">{selectedLand.owner}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Soil Information</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Soil Type:</span>
                  <span className="font-medium">{selectedLand.soilType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quality:</span>
                  <span className="font-medium">
                    {soilTypes.find(s => s.type === selectedLand.soilType)?.quality || 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">pH Level:</span>
                  <span className="font-medium">
                    {soilTypes.find(s => s.type === selectedLand.soilType)?.ph || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nutrients:</span>
                  <span className="font-medium">
                    {soilTypes.find(s => s.type === selectedLand.soilType)?.nutrients || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Performance</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Yield:</span>
                  <span className="font-medium">{selectedLand.yield}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Irrigation:</span>
                  <span className="font-medium">{selectedLand.irrigation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">{selectedLand.lastUpdated}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Quick Actions</h4>
              <div className="space-y-2">
                <button className="btn-primary w-full text-xs py-2">
                  <ChartBarIcon className="w-3 h-3 mr-1" />
                  View Analytics
                </button>
                <button className="btn-secondary w-full text-xs py-2">
                  <DocumentTextIcon className="w-3 h-3 mr-1" />
                  Generate Report
                </button>
                <button className="btn-secondary w-full text-xs py-2">
                  <CloudIcon className="w-3 h-3 mr-1" />
                  Weather Data
                </button>
                <button className="btn-secondary w-full text-xs py-2">
                  <MapPinIcon className="w-3 h-3 mr-1" />
                  GPS Coordinates
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Land Modal */}
      {showAddLand && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Land Parcel</h3>
            <form onSubmit={handleLandSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parcel Name
                </label>
                <input
                  type="text"
                  value={landForm.name}
                  onChange={(e) => setLandForm({...landForm, name: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area (acres)
                </label>
                <input
                  type="number"
                  value={landForm.area}
                  onChange={(e) => setLandForm({...landForm, area: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Crop Type
                </label>
                <select
                  value={landForm.cropType}
                  onChange={(e) => setLandForm({...landForm, cropType: e.target.value})}
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
                  Soil Type
                </label>
                <select
                  value={landForm.soilType}
                  onChange={(e) => setLandForm({...landForm, soilType: e.target.value})}
                  className="input-field"
                  required
                >
                  <option value="">Select soil type</option>
                  <option value="Loamy">Loamy</option>
                  <option value="Clay">Clay</option>
                  <option value="Sandy">Sandy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GPS Coordinates
                </label>
                <input
                  type="text"
                  value={landForm.coordinates}
                  onChange={(e) => setLandForm({...landForm, coordinates: e.target.value})}
                  className="input-field"
                  placeholder="e.g., 40.7128, -74.0060"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={landForm.notes}
                  onChange={(e) => setLandForm({...landForm, notes: e.target.value})}
                  className="input-field"
                  rows="3"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Add Land Parcel
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddLand(false)}
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
  );
};

export default LandMapping; 