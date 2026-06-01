import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Gamepad2,
  LayoutDashboard,
  Cpu,
  BarChart3,
  Star,
  History,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/predict', label: 'Predict', icon: Cpu },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/recommend', label: 'Recommender', icon: Star },
  { to: '/history', label: 'History', icon: History },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '1.25rem 1.25rem 1.5rem', borderBottom: '1px solid #1e1e3a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <Gamepad2 size={24} color="#7c3aed" />
          <div>
            <div
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '1.375rem',
                fontWeight: 700,
                color: '#f1f5f9',
                lineHeight: 1,
              }}
            >
              VGSI
            </div>
            <div
              style={{
                fontSize: '0.6875rem',
                color: '#475569',
                letterSpacing: '0.04em',
              }}
            >
              Sales Intelligence
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.75rem 0' }}>
        {navItems.map((item) => {
          const isActive =
            item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to);
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 1.25rem',
                margin: '0.125rem 0.5rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#f1f5f9' : '#94a3b8',
                background: isActive ? 'rgba(124, 58, 237, 0.08)' : 'transparent',
                borderLeft: isActive ? '3px solid #7c3aed' : '3px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(124, 58, 237, 0.04)';
                  e.currentTarget.style.color = '#f1f5f9';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid #1e1e3a',
          fontSize: '0.6875rem',
          color: '#475569',
          lineHeight: 1.6,
        }}
      >
        <div>vgsales.csv</div>
        <div>136+ games tracked</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        style={{
          display: 'none',
          position: 'fixed',
          top: '0.75rem',
          left: '0.75rem',
          zIndex: 1001,
          background: '#0f0f1a',
          border: '1px solid #1e1e3a',
          borderRadius: 8,
          padding: '0.5rem',
          color: '#f1f5f9',
          cursor: 'pointer',
        }}
        className="mobile-menu-btn"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 998,
          }}
          className="mobile-backdrop"
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          minHeight: '100vh',
          background: '#0a0a0f',
          borderRight: '1px solid #1e1e3a',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          flexShrink: 0,
          zIndex: 999,
        }}
        className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}
      >
        {/* Mobile Close */}
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              zIndex: 1000,
            }}
          >
            <X size={20} />
          </button>
        )}
        {sidebarContent}
      </aside>

      {/* Mobile Styles */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: block !important; }
          .sidebar {
            position: fixed !important;
            left: -260px;
            transition: left 0.25s ease;
          }
          .sidebar.sidebar-open {
            left: 0 !important;
          }
        }
      `}</style>
    </>
  );
}
