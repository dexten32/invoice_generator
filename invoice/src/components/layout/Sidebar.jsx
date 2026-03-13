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
    <div className="flex flex-col h-screen w-72 bg-slate-950 text-slate-100 border-r border-white/5 relative z-50 overflow-hidden shadow-[20px_0_50px_-20px_rgba(0,0,0,0.5)]">
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/30 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[100px] rounded-full" />
      </div>

      {/* Brand Header */}
      <div className="p-8 relative">
        <div className="flex items-center gap-3.5 group cursor-pointer">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center shadow-xl shadow-primary/30 group-hover:scale-105 transition-transform duration-500">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tight text-white leading-none">
              Invo<span className="text-primary font-black">Gen</span>
            </h1>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1.5 opacity-70">Workspace Pro</span>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar relative">
        <div className="px-4 mb-4 text-[11px] font-black text-slate-600 uppercase tracking-[0.25em] flex items-center gap-2">
          <span>General</span>
          <div className="h-px flex-1 bg-slate-800/50" />
        </div>
        
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="block group"
          >
            {({ isActive }) => (
              <div className={cn(
                "flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-500 relative overflow-hidden",
                isActive 
                  ? "bg-primary text-white shadow-[0_10px_20px_-5px_rgba(var(--primary),0.3)]" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}>
                {/* Active Indicator Backdrop */}
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute inset-0 bg-primary z-0"
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
      <div className="p-6 mt-auto relative border-t border-white/5 bg-black/20">
        <button className="flex items-center gap-3.5 w-full p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300 group">
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
