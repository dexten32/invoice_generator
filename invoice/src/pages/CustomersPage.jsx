import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, User, Mail, MapPin, Search, Filter, 
  Download, Phone, MoreHorizontal, UserCheck, 
  ArrowUpRight, Users, ExternalLink 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const CustomersPage = () => {
  const [customers, setCustomers] = useLocalStorage('customers', []);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', address: '', phone: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  const addCustomer = (e) => {
    e.preventDefault();
    if (!newCustomer.name) return;
    setCustomers([{ ...newCustomer, id: Date.now() }, ...customers]);
    setNewCustomer({ name: '', email: '', address: '', phone: '' });
    setIsFormVisible(false);
  };

  const deleteCustomer = (id) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="page-header-container">
        <div className="page-title-group">
          <div className="page-subheader">
            <UserCheck className="w-4 h-4" />
            CRM Database
          </div>
          <h1 className="page-title">
            Client <span>Directory</span>
          </h1>
          <p className="page-description">
            A centralized hub for managing your professional relationships and contact history.
          </p>
        </div>
        
        <div className="action-button-group">
          <Button variant="outline" className="btn-secondary">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button 
            onClick={() => setIsFormVisible(true)}
            className="btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" /> Add New Client
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Form Overlay - Side Panel Style */}
        <AnimatePresence>
          {isFormVisible && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFormVisible(false)}
                className="form-overlay"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="form-panel"
              >
                <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Plus className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 leading-none">New Client</h2>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Directory Addition</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsFormVisible(false)} className="rounded-full hover:bg-red-50 group">
                    <Trash2 className="w-5 h-5 text-slate-300 group-hover:text-red-500 transition-colors" />
                  </Button>
                </div>

                <form onSubmit={addCustomer} className="space-y-8 flex-1">
                  <div className="space-y-6">
                    <div className="group space-y-2">
                      <label className="form-label group-focus-within:form-label-active">Client Name</label>
                      <div className="form-input-container">
                        <User className="form-input-icon" />
                        <Input 
                          placeholder="Legal Entity or Individual" 
                          value={newCustomer.name}
                          className="form-input-field text-lg"
                          onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                        />
                      </div>
                    </div>
                    {/* ... other inputs ... */}
                    <div className="group space-y-2">
                      <label className="form-label">Email Address</label>
                      <div className="form-input-container">
                        <Mail className="form-input-icon" />
                        <Input 
                          type="email"
                          placeholder="client@company.com" 
                          value={newCustomer.email}
                          className="form-input-field"
                          onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="group space-y-2">
                      <label className="form-label">Phone Number</label>
                      <div className="form-input-container">
                        <Phone className="form-input-icon" />
                        <Input 
                          placeholder="+91 XXXXX XXXXX" 
                          value={newCustomer.phone}
                          className="form-input-field"
                          onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="group space-y-2">
                      <label className="form-label">Location / Address</label>
                      <div className="form-input-container">
                        <MapPin className="form-input-icon" />
                        <Input 
                          placeholder="HQ City, Country" 
                          value={newCustomer.address}
                          className="form-input-field"
                          onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-10 mt-auto">
                    <Button type="submit" className="w-full h-16 bg-slate-900 hover:bg-black text-white rounded-2xl transition-all shadow-xl font-bold text-lg group">
                       Create Directory Entry <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                    <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-6">
                      Data is stored on your local workspace
                    </p>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="lg:col-span-12 space-y-12">
          {/* Search Bar Container */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="search-container group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none z-10">
                <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              </div>
              <Input 
                placeholder="Search by directory name, email or location..." 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="filter-btn">
              <Filter className="w-5 h-5 mr-3" /> Filters
            </Button>
          </div>

          {/* Customer Grid */}
          <AnimatePresence mode="popLayout">
            {filteredCustomers.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="empty-state-container dark:bg-slate-900/30 dark:border-white/5"
              >
                <div className="w-28 h-28 bg-white rounded-[32px] shadow-2xl flex items-center justify-center mb-8 relative dark:bg-slate-800">
                   <Users className="w-12 h-12 text-slate-200" />
                   <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                     <Plus className="w-5 h-5 text-white" />
                   </div>
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight dark:text-white">Directory is Empty</h3>
                <p className="text-slate-500 mt-3 font-medium text-lg max-w-sm text-center dark:text-slate-400">Start building your professional network by adding your first client contact.</p>
                <Button 
                  onClick={() => setIsFormVisible(true)}
                  className="mt-10 h-14 px-10 rounded-2xl bg-slate-900 text-white font-bold dark:bg-primary"
                >
                  Get Started
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredCustomers.map((customer, index) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    key={customer.id} 
                    className="glass-card flex flex-col items-stretch"
                  >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[40px] pointer-events-none" />

                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-slate-800 font-black text-2xl group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner group-hover:rotate-6 dark:bg-slate-800 dark:text-white">
                        {customer.name.charAt(0)}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-2xl transition-all"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                          onClick={() => deleteCustomer(customer.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-6 relative z-10 h-full flex flex-col">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors truncate dark:text-white">{customer.name}</h3>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                          ID: {customer.id.toString().slice(-6)}
                        </p>
                      </div>

                      <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-4 text-slate-500 font-bold text-sm dark:text-slate-400">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors shrink-0 dark:bg-blue-900/20">
                            <Mail className="w-4 h-4 text-blue-500" />
                          </div>
                          <span className="truncate">{customer.email || '—'}</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-500 font-bold text-sm dark:text-slate-400">
                          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors shrink-0 dark:bg-orange-900/20">
                            <MapPin className="w-4 h-4 text-orange-500" />
                          </div>
                          <span className="truncate">{customer.address || '—'}</span>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-4 text-slate-500 font-bold text-sm dark:text-slate-400">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors shrink-0 dark:bg-emerald-900/20">
                              <Phone className="w-4 h-4 text-emerald-500" />
                            </div>
                            <span className="truncate">{customer.phone}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto pt-8 border-t border-slate-50 flex justify-between items-center dark:border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Client</span>
                        </div>
                        <button className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-[0.15em] hover:gap-3 transition-all">
                          Manage <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
