import React from 'react';

const socialLinks = [
  {
    name: 'WhatsApp',
    url: 'https://wa.me/1234567890',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.007-.372-.009-.571-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.363.71.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
    ),
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com/',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
    ),
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
    ),
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 0 0-8.384 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.117 2.823 5.254a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.058 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 24 4.557z"/></svg>
    ),
  },
];

export default function Footer({ collapsed }) {
  // Responsive left margin for sticky footer on desktop
  const leftMargin = collapsed ? 'lg:left-20' : 'lg:left-64';
  const width = collapsed ? 'lg:w-[calc(100%-5rem)]' : 'lg:w-[calc(100%-16rem)]';
  return (
    <footer
      className={`bg-black bg-opacity-80 text-gray-200 py-8 border-t border-green-800 w-full ${leftMargin} ${width}`}
      style={{
        // fallback for browsers that don't support arbitrary width classes
        width: '100%',
        transition: 'left 0.3s,width 0.3s',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <div className="text-green-400 font-bold text-xl mb-2">GreenLands</div>
          <div className="text-sm text-gray-400 mb-2">Empowering sustainable agriculture and land management.</div>
          <div className="text-xs text-gray-500">&copy; {new Date().getFullYear()} GreenLands. All rights reserved.</div>
        </div>
        <div className="flex items-center gap-6">
          {socialLinks.map(link => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              className="hover:text-green-400 transition"
            >
              {link.icon}
            </a>
          ))}
        </div>
        <div className="text-center md:text-right mt-4 md:mt-0">
          <div className="mb-2">Need help? <a href="mailto:support@greenlands.com" className="text-green-400 hover:underline">Contact Support</a></div>
          <div className="flex gap-2 justify-center md:justify-end">
            <a href="/support" className="text-xs text-gray-400 hover:text-green-400">Support Center</a>
            <span>|</span>
            <a href="/faq" className="text-xs text-gray-400 hover:text-green-400">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
} 