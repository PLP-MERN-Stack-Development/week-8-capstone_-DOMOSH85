import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Login from './Auth/Login';
import Register from './Auth/Register';

const services = [
  {
    title: 'Land Mapping',
    description: 'Interactive maps showing land parcels, soil data, and crop information for better land management.',
    icon: '🗺️',
  },
  {
    title: 'Farmer Portal',
    description: 'Profile management, crop tracking, weather alerts, and resources for farmers.',
    icon: '👨‍🌾',
  },
  {
    title: 'Government Dashboard',
    description: 'Policy updates, subsidy information, compliance tracking, and analytics for government officials.',
    icon: '🏛️',
  },
  {
    title: 'Analytics Hub',
    description: 'Data visualization, reports, and trend analysis for all stakeholders.',
    icon: '📊',
  },
  {
    title: 'Communication Center',
    description: 'Messaging and announcements to connect farmers, government, and support.',
    icon: '💬',
  },
  {
    title: 'Real-time Updates',
    description: 'Live data synchronization and notifications across all modules.',
    icon: '🔔',
  },
];

export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-green-900 to-green-700 text-white flex flex-col">
      {/* Navigation Bar */}
      <nav className="w-full flex items-center justify-between px-6 py-4 bg-black bg-opacity-80 border-b border-green-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold text-white">G</span>
          </div>
          <span className="text-xl font-bold text-green-400">GreenLands</span>
        </div>
        <div className="flex gap-4">
          <Dialog.Root open={loginOpen} onOpenChange={setLoginOpen}>
            <Dialog.Trigger asChild>
              <button className="px-5 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold shadow transition">Sign In</button>
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
              <button className="px-5 py-2 rounded-lg bg-green-700 hover:bg-green-800 text-white font-semibold shadow transition">Sign Up</button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50">
                <Register />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-green-400 drop-shadow-lg">Welcome to GreenLands</h1>
        <p className="max-w-2xl mx-auto text-lg md:text-2xl mb-8 text-gray-200">
          GreenLands is a next-generation land management platform connecting farmers, government organizations, and stakeholders with robust data visualization, analytics, and real-time collaboration.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-10">
          <a href="#services" className="px-8 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold shadow-lg transition">Explore Services</a>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 bg-black bg-opacity-60">
        <h2 className="text-3xl font-bold text-green-300 mb-8 text-center">Our Services</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.title} className="bg-green-950 bg-opacity-80 rounded-xl shadow-lg p-6 flex flex-col items-center text-center border border-green-800 hover:scale-105 transition">
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-green-400 mb-2">{service.title}</h3>
              <p className="text-gray-200">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 px-4 bg-gradient-to-b from-green-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-300 mb-4">About GreenLands</h2>
          <p className="text-lg text-gray-200 mb-4">
            Our mission is to empower sustainable agriculture and efficient land management through technology. GreenLands provides a unified platform for data-driven decisions, transparent communication, and actionable insights for both farmers and government organizations.
          </p>
          <p className="text-md text-gray-400">
            Whether you are a farmer looking to optimize your yield, a government official managing policies, or a stakeholder seeking reliable analytics, GreenLands is your trusted partner for a greener, smarter future.
          </p>
        </div>
      </section>
    </div>
  );
} 