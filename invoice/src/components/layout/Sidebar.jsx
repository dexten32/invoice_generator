import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FileText, Users, Package, LayoutDashboard,
  Settings, LogOut, ChevronRight, Menu, X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import './Sidebar.css';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: 'Invoice Editor', path: '/', icon: FileText },
    { name: 'Invoices',       path: '/invoices',  icon: LayoutDashboard },
    { name: 'Customers',      path: '/customers', icon: Users },
    { name: 'Products',       path: '/products',  icon: Package },
  ];

  const displayName = user?.name || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarContent = (
    <div className="sb-sidebar" style={{ width: collapsed ? 64 : 220, transition: 'width 0.25s ease' }}>

      {/* ── Brand ── */}
      <div className="sb-brand">
        <div className="sb-brand-icon">
          <LayoutDashboard size={16} color="#fff" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="sb-brand-text">
            <span className="sb-brand-name">Invo<span style={{ color: '#3b82f6' }}>Gen</span></span>
            <span className="sb-brand-sub">Workspace Pro</span>
          </div>
        )}
        <button
          className="sb-collapse-btn"
          style={{ marginLeft: 'auto' }}
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <ChevronRight
            size={13}
            color="#64748b"
            style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.25s ease' }}
          />
        </button>
      </div>

      {/* ── Nav ── */}
      <nav className="sb-nav">
        {!collapsed && <p className="sb-nav-label">General</p>}
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => cn("sb-nav-item", isActive && "sb-nav-item-active")}
            style={{
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: collapsed ? '10px 0' : '9px 12px',
            }}
            onClick={() => setMobileOpen(false)}
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={16}
                  strokeWidth={isActive ? 2.5 : 2}
                  color={isActive ? '#3b82f6' : '#64748b'}
                  style={{ flexShrink: 0, transition: 'color 0.15s' }}
                />
                {!collapsed && (
                  <span className="sb-nav-link-text" style={{
                    color: isActive ? '#0f172a' : '#475569',
                    fontWeight: isActive ? 700 : 500,
                  }}>
                    {item.name}
                  </span>
                )}
                {!collapsed && isActive && (
                  <div className="sb-active-dot" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="sb-footer">
        <div className="sb-divider" />

        <div className="sb-user-row" style={{
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '10px 0' : '10px 12px',
        }}>
          <div className="sb-avatar-wrap">
            <div className="sb-avatar">{initials}</div>
            <div className="sb-online-dot" />
          </div>
          {!collapsed && (
            <div className="sb-user-info">
              <p className="sb-user-name">{displayName}</p>
              <p className="sb-user-email">{user?.email || ''}</p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <button className="sb-footer-btn" style={{
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '9px 0' : '9px 12px',
          }}>
            <Settings size={14} color="#64748b" strokeWidth={2} />
            {!collapsed && <span className="sb-footer-btn-text">Settings</span>}
          </button>

          <button
            className="sb-footer-btn"
            style={{
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: collapsed ? '9px 0' : '9px 12px',
            }}
            onClick={logout}
          >
            <LogOut size={14} color="#94a3b8" strokeWidth={2} />
            {!collapsed && <span className="sb-footer-btn-text" style={{ color: '#94a3b8' }}>Sign Out</span>}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div data-sidebar-mobile-bar className="sb-mobile-bar">
        <button className="sb-menu-btn" onClick={() => setMobileOpen(true)}>
          <Menu size={18} color="#334155" />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="sb-brand-icon" style={{ width: 28, height: 28 }}>
            <LayoutDashboard size={14} color="#fff" />
          </div>
          <span className="sb-brand-name">Invo<span style={{ color: '#3b82f6' }}>Gen</span></span>
        </div>
        <div style={{ width: 36 }} />
      </div>

      {/* ── Mobile drawer backdrop ── */}
      {mobileOpen && (
        <div className="sb-backdrop" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Mobile drawer ── */}
      <div data-sidebar-drawer className="sb-mobile-drawer" style={{
        transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
      }}>
        <button className="sb-close-btn" onClick={() => setMobileOpen(false)}>
          <X size={16} color="#64748b" />
        </button>
        <div className="sb-sidebar" style={{ width: '100%', height: '100%', borderRight: 'none' }}>
          <div className="sb-brand">
            <div className="sb-brand-icon">
              <LayoutDashboard size={16} color="#fff" strokeWidth={2.5} />
            </div>
            <div className="sb-brand-text">
              <span className="sb-brand-name">Invo<span style={{ color: '#3b82f6' }}>Gen</span></span>
              <span className="sb-brand-sub">Workspace Pro</span>
            </div>
          </div>

          <nav className="sb-nav">
            <p className="sb-nav-label">General</p>
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => cn("sb-nav-item", isActive && "sb-nav-item-active")}
                style={{ padding: '9px 12px' }}
                onClick={() => setMobileOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      size={16}
                      strokeWidth={isActive ? 2.5 : 2}
                      color={isActive ? '#3b82f6' : '#64748b'}
                      style={{ flexShrink: 0 }}
                    />
                    <span className="sb-nav-link-text" style={{
                      color: isActive ? '#0f172a' : '#475569',
                      fontWeight: isActive ? 700 : 500,
                    }}>
                      {item.name}
                    </span>
                    {isActive && <div className="sb-active-dot" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="sb-footer">
            <div className="sb-divider" />
            <div className="sb-user-row" style={{ padding: '10px 12px' }}>
              <div className="sb-avatar-wrap">
                <div className="sb-avatar">{initials}</div>
                <div className="sb-online-dot" />
              </div>
              <div className="sb-user-info">
                <p className="sb-user-name">{displayName}</p>
                <p className="sb-user-email">{user?.email || ''}</p>
              </div>
            </div>
            <button className="sb-footer-btn" style={{ padding: '9px 12px' }} onClick={logout}>
              <LogOut size={14} color="#94a3b8" />
              <span className="sb-footer-btn-text" style={{ color: '#94a3b8' }}>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Desktop sidebar ── */}
      <div data-sidebar-desktop className="sb-desktop-wrap">
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;