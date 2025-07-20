import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { io as socketIOClient } from 'socket.io-client';

export default function AdminSupport() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('open');
  const [selected, setSelected] = useState(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'staff')) {
      fetchRequests();
      fetchNotifications();
      // Socket.IO connection
      const socket = socketIOClient(import.meta.env.VITE_API_URL || 'http://localhost:5000');
      socket.on('support:new', (data) => {
        fetchNotifications();
        toast('New support request received!', { icon: '🔔' });
      });
      return () => socket.disconnect();
    }
  }, [user]);

  const fetchRequests = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/communication/support`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setRequests(data);
    setLoading(false);
  };

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/communication/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setNotifications(data);
  };

  const handleSelect = (req) => {
    setSelected(req);
    setResponse(req.response || '');
  };

  const handleUpdate = async (status) => {
    if (!selected) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/communication/support/${selected._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status, response })
    });
    if (res.ok) {
      toast.success('Support request updated');
      setSelected(null);
      setResponse('');
      fetchRequests();
      fetchNotifications();
    } else {
      toast.error('Failed to update request');
    }
    setLoading(false);
  };

  if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
    return <div className="p-8 text-center text-red-600 font-bold">Access denied</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Support Requests</h1>
        <button className="relative" onClick={() => setNotifOpen((v) => !v)}>
          <span className="inline-block w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </span>
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">{notifications.length}</span>
          )}
        </button>
      </div>
      {notifOpen && notifications.length > 0 && (
        <div className="bg-white border rounded shadow p-4 mb-6">
          <h4 className="font-semibold mb-2">New Support Notifications</h4>
          <ul className="text-sm space-y-1">
            {notifications.map((n) => (
              <li key={n._id}>{n.message}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="mb-4 flex gap-4">
        <button className={`btn-secondary ${filter === 'open' ? 'bg-green-100' : ''}`} onClick={() => setFilter('open')}>Open</button>
        <button className={`btn-secondary ${filter === 'closed' ? 'bg-green-100' : ''}`} onClick={() => setFilter('closed')}>Closed</button>
        <button className="btn-secondary" onClick={fetchRequests}>Refresh</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left">Date</th>
                <th className="px-2 py-1 text-left">User</th>
                <th className="px-2 py-1 text-left">Subject</th>
                <th className="px-2 py-1 text-left">Status</th>
                <th className="px-2 py-1 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.filter(r => r.status === filter).map((req) => (
                <tr key={req._id} className={selected && selected._id === req._id ? 'bg-green-50' : ''}>
                  <td className="px-2 py-1">{new Date(req.createdAt).toLocaleString()}</td>
                  <td className="px-2 py-1">{req.user?.name || 'Unknown'}<br /><span className="text-xs text-gray-500">{req.user?.email}</span></td>
                  <td className="px-2 py-1">{req.subject}</td>
                  <td className="px-2 py-1 capitalize">{req.status}</td>
                  <td className="px-2 py-1">
                    <button className="btn-primary btn-xs" onClick={() => handleSelect(req)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-red-600" onClick={() => setSelected(null)}>&times;</button>
            <h2 className="text-lg font-bold mb-2">Support Request Details</h2>
            <div className="mb-2"><span className="font-semibold">User:</span> {selected.user?.name} ({selected.user?.email})</div>
            <div className="mb-2"><span className="font-semibold">Subject:</span> {selected.subject}</div>
            <div className="mb-2"><span className="font-semibold">Message:</span> {selected.message}</div>
            <div className="mb-2"><span className="font-semibold">Status:</span> {selected.status}</div>
            <div className="mb-2">
              <label className="block font-semibold mb-1">Response</label>
              <textarea
                className="w-full border rounded px-2 py-1 min-h-[60px]"
                value={response}
                onChange={e => setResponse(e.target.value)}
                disabled={selected.status === 'closed'}
              />
            </div>
            <div className="flex gap-2 justify-end mt-4">
              {selected.status === 'open' && (
                <button className="btn-primary" onClick={() => handleUpdate('closed')} disabled={loading}>Close Request</button>
              )}
              <button className="btn-secondary" onClick={() => handleUpdate(selected.status)} disabled={loading}>Save Response</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 