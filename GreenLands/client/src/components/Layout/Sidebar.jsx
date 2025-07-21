import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import {
  HomeIcon,
  MapIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  Bars3Icon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Sidebar = ({ open, setOpen, collapsed, setCollapsed }) => {
  const { user, logout, hasRole } = useAuth();
  const { fetchNotifications } = useData();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationPanelRef = useRef(null);

  // Fetch notifications from backend
  useEffect(() => {
    if (user && fetchNotifications) {
      fetchNotifications(user).then(setNotifications);
    }
  }, [user, fetchNotifications]);

  // Refetch notifications when notification panel is opened
  useEffect(() => {
    if (showNotifications && user && fetchNotifications) {
      fetchNotifications(user).then(setNotifications);
    }
  }, [showNotifications, user, fetchNotifications]);

  // Count unread notifications
  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = safeNotifications.filter(n => !n.read).length;

  // Close notification panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationPanelRef.current && !notificationPanelRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  // Navigation with role restrictions
  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon, roles: ['farmer', 'government', 'admin', 'analyst'] },
    { name: 'Farmer Portal', href: '/farmer-portal', icon: UserGroupIcon, roles: ['farmer'] },
    { name: 'Government Portal', href: '/government-portal', icon: BuildingOfficeIcon, roles: ['government'] },
    { name: 'Analyst Portal', href: '/analyst-portal', icon: ChartBarIcon, roles: ['analyst'] },
    { name: 'Admin Portal', href: '/admin-portal', icon: Cog6ToothIcon, roles: ['admin'] },
    { name: 'Land Mapping', href: '/land-mapping', icon: MapIcon, roles: ['government', 'admin'] },
    { name: 'Government', href: '/government', icon: BuildingOfficeIcon, roles: ['government', 'admin'] },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, roles: ['analyst', 'government', 'admin'] },
    { name: 'Communication', href: '/communication', icon: ChatBubbleLeftRightIcon, roles: ['government', 'admin', 'analyst'] },
  ];

  // Only show Dashboard, Farmer Portal, and Communication for farmers
  const filteredNavigation = user && user.role === 'farmer'
    ? navigation.filter(item => ['Dashboard', 'Farmer Portal', 'Communication'].includes(item.name))
    : navigation.filter(item => hasRole && hasRole(item.roles));

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
  };

  const handleMarkAllRead = () => {
    setNotifications(safeNotifications.map(n => ({ ...n, read: true })));
  };

  const handleMarkRead = (id) => {
    setNotifications(safeNotifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkUnread = (id) => {
    setNotifications(safeNotifications.map(n => n.id === id ? { ...n, read: false } : n));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  // Sidebar width classes
  const sidebarWidth = collapsed ? 'lg:w-20' : 'lg:w-64';

  return (
    <>
      {/* Mobile sidebar (unchanged) */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl border-r border-green-700/20 transform transition-transform duration-300 ease-in-out lg:hidden ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">GreenLands</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <div className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2 pl-2">Navigation</div>
            {filteredNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `sidebar-item flex items-center px-3 py-2 rounded-lg transition-colors font-medium text-base ${
                    isActive
                      ? 'bg-green-100 text-green-700 shadow-inner border-l-4 border-green-600'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                  }`
                }
                onClick={() => setOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-green-700">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.role || 'User'}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <button className="sidebar-item w-full justify-start">
                <Cog6ToothIcon className="w-5 h-5 mr-3" />
                Settings
              </button>
              <button 
                onClick={handleLogout}
                className="sidebar-item w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar (collapsible) */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 ${sidebarWidth} lg:bg-white lg:shadow-2xl lg:border-r lg:border-green-700/20 lg:flex lg:flex-col transition-all duration-300`}>
        <div className="flex flex-col h-full">
          {/* Collapse/Expand Button and Notification Bell */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              {!collapsed && <span className="text-xl font-bold text-gray-900">GreenLands</span>}
            </div>
            <button
              className="p-2 rounded hover:bg-green-100 transition-colors"
              onClick={() => setCollapsed((prev) => !prev)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronDoubleRightIcon className="w-5 h-5 text-green-700" /> : <ChevronDoubleLeftIcon className="w-5 h-5 text-green-700" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-6 space-y-2">
            <div className={`text-xs font-semibold text-green-700 uppercase tracking-wider mb-2 pl-2 ${collapsed ? 'hidden' : ''}`}>Navigation</div>
            {navigation.filter(item => hasRole && hasRole(item.roles)).map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `sidebar-item flex items-center ${collapsed ? 'justify-center' : 'px-3'} py-2 rounded-lg transition-colors font-medium text-base ${
                    isActive
                      ? 'bg-green-100 text-green-700 shadow-inner border-l-4 border-green-600'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                  }`
                }
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="w-5 h-5" />
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </NavLink>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-4 justify-center lg:justify-start">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-green-700">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.role || 'User'}
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-1 flex flex-col items-center lg:items-start">
              <button className="sidebar-item w-full justify-start">
                <Cog6ToothIcon className="w-5 h-5 mr-3" />
                {!collapsed && 'Settings'}
              </button>
              <button 
                onClick={handleLogout}
                className="sidebar-item w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                {!collapsed && 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 