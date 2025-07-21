import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  UserCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Avatar from '@radix-ui/react-avatar';
import axios from 'axios';
import * as Dialog from '@radix-ui/react-dialog';
import Login from '../../pages/Auth/Login';
import Register from '../../pages/Auth/Register';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationPanelRef = useRef(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  // Provide modal openers to context
  const openLogin = () => setLoginOpen(true);
  const openRegister = () => setRegisterOpen(true);

  // Fetch notifications from backend on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        // Get unread and recent messages
        const notifRes = await axios.get('/api/communication/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Get system announcements
        const annRes = await axios.get('/api/communication/announcements', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Merge notifications and announcements
        const backendNotifications = [];
        if (notifRes.data.recentMessages) {
          backendNotifications.push(...notifRes.data.recentMessages.map(msg => ({
            id: msg.id,
            title: msg.subject || 'Message',
            message: msg.content,
            time: new Date(msg.timestamp).toLocaleString(),
            type: 'message',
            read: msg.read
          })));
        }
        if (Array.isArray(annRes.data)) {
          backendNotifications.push(...annRes.data.map(ann => ({
            id: `announcement-${ann.id}`,
            title: ann.title,
            message: ann.content,
            time: new Date(ann.timestamp).toLocaleString(),
            type: ann.type || 'announcement',
            read: false
          })));
        }
        // Sort by time, newest first
        backendNotifications.sort((a, b) => new Date(b.time) - new Date(a.time));
        setNotifications(backendNotifications);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };
    fetchNotifications();
  }, []);

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

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

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleMarkRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkUnread = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: false } : n));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            {/* Search */}
            <div className="ml-4 flex-1 max-w-lg">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search land, farmers, reports..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </form>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Show Sign In/Sign Up if not logged in */}
            {!user && (
              <>
                <Dialog.Root open={loginOpen} onOpenChange={setLoginOpen}>
                  <Dialog.Trigger asChild>
                    <button className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold shadow transition">Sign In</button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50">
                      <Login />
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
                <Dialog.Root open={registerOpen} onOpenChange={setRegisterOpen}>
                  <Dialog.Trigger asChild>
                    <button className="px-4 py-2 rounded-lg bg-green-700 hover:bg-green-800 text-white font-semibold shadow transition">Sign Up</button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50">
                      <Register />
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </>
            )}
            {/* Notifications */}
            <div className="relative">
              <button
                className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 relative"
                onClick={() => setShowNotifications((prev) => !prev)}
                aria-label="Show notifications"
              >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
              {/* Notification Panel */}
              {showNotifications && (
                <div
                  ref={notificationPanelRef}
                  className="absolute right-0 mt-2 w-80 bg-white shadow-2xl rounded-lg border border-gray-200 z-50 animate-fade-in"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <span className="font-semibold text-gray-900">Notifications</span>
                    <button onClick={() => setShowNotifications(false)} className="p-1 rounded hover:bg-gray-100">
                      <XMarkIcon className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-400">
                      <BellIcon className="w-10 h-10 mx-auto mb-2" />
                      <p className="font-medium">No notifications</p>
                    </div>
                  ) : (
                    <>
                      <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`flex items-start px-4 py-3 gap-3 ${n.read ? 'bg-white' : 'bg-green-50'}`}
                          >
                            <div className="flex-shrink-0 mt-1">
                              {n.type === 'application' ? (
                                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                              ) : n.type === 'policy' ? (
                                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
                              ) : (
                                <ClockIcon className="w-5 h-5 text-blue-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`font-medium ${n.read ? 'text-gray-700' : 'text-green-800'}`}>{n.title}</div>
                              <div className="text-sm text-gray-500">{n.message}</div>
                              <div className="text-xs text-gray-400 mt-1">{n.time}</div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {!n.read ? (
                                <button
                                  className="text-xs text-green-600 hover:underline"
                                  onClick={() => handleMarkRead(n.id)}
                                >
                                  Mark as read
                                </button>
                              ) : (
                                <button
                                  className="text-xs text-gray-400 hover:underline"
                                  onClick={() => handleMarkUnread(n.id)}
                                >
                                  Mark as unread
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-gray-50">
                        <button
                          className="text-xs text-green-700 hover:underline font-medium"
                          onClick={handleMarkAllRead}
                          disabled={notifications.length === 0}
                        >
                          Mark all as read
                        </button>
                        <button
                          className="text-xs text-red-600 hover:underline font-medium"
                          onClick={handleClearAll}
                          disabled={notifications.length === 0}
                        >
                          Clear all
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* User menu */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center space-x-3 p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500">
                  <Avatar.Root className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Avatar.Image
                      className="w-full h-full object-cover rounded-full"
                      src={user?.avatar}
                      alt={user?.name}
                    />
                    <Avatar.Fallback className="text-sm font-medium text-green-700">
                      {user?.name?.charAt(0) || 'U'}
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.role || 'User'}</p>
                  </div>
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[220px] bg-white rounded-lg shadow-lg border border-gray-200 p-1 z-50"
                  sideOffset={5}
                >
                  <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 cursor-pointer">
                    <UserCircleIcon className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 cursor-pointer">
                    Settings
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
                  <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 cursor-pointer" onClick={logout}>
                    Sign out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 