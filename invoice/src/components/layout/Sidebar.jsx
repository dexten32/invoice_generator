import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Users, Package, LayoutDashboard, Settings, User as UserIcon, LogOut, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const navItems = [
    { name: 'Invoice Editor', path: '/', icon: FileText },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Products', path: '/products', icon: Package },
  ];

  return (
    <div className="sidebar-container">
      {/* Decorative Gradient Background */}
      <div className="sidebar-bg-glow">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/30 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[100px] rounded-full" />
      </div>

      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="flex items-center gap-3.5 group cursor-pointer">
          <div className="sidebar-brand-icon">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="sidebar-brand-text">
              Invo<span className="text-primary font-black">Gen</span>
            </h1>
            <span className="sidebar-brand-version">Workspace Pro</span>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="sidebar-nav-list custom-scrollbar">
        <div className="nav-group-label">
          <span>General</span>
          <div className="nav-group-line" />
        </div>
        
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="nav-item-link group"
          >
            {({ isActive }) => (
              <div className={cn(
                "nav-item-container",
                isActive ? "nav-item-active" : "nav-item-inactive"
              )}>
                {/* Active Indicator Backdrop */}
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="nav-item-indicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <div className="relative z-10 flex items-center gap-3.5 w-full">
                  <item.icon className={cn(
                    "w-5 h-5 transition-transform duration-500 group-hover:scale-110",
                    isActive ? "text-white" : "group-hover:text-primary"
                  )} />
                  <span className="font-bold tracking-wide text-[13px]">{item.name}</span>
                  
                  {isActive && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="ml-auto"
                    >
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Account Section */}
      <div className="sidebar-footer">
        <button className="user-profile-btn group">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-200 to-white flex items-center justify-center text-slate-900 font-black text-sm shadow-lg">
              HS
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-xs font-black text-white truncate uppercase tracking-wider">Harsh S.</p>
            <p className="text-[10px] text-slate-500 truncate font-bold">Premium Account</p>
          </div>
          <Settings className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors group-hover:rotate-45 duration-500" />
        </button>
        
        <button className="flex items-center gap-3 mt-4 px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-red-400 transition-colors w-full group">
          <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
