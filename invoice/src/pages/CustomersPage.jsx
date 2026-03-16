import React, { useState } from 'react';
import { useApiData } from '../hooks/useApiData';
import './CustomersPage.css';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, User, Mail, MapPin, Search, Filter,
  Download, Phone, MoreHorizontal, UserCheck,
  ArrowUpRight, Users, ExternalLink, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const CustomersPage = () => {
  const { data: apiData, isLoading, refetch } = useApiData('/customers');
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phoneCountryCode: '+91',
    phoneNumber: '',
    gstNumber: '',
    street: '',
    district: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedCustomerId, setExpandedCustomerId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedCustomerId(prev => prev === id ? null : id);
  };

  // Common countries list
  const countries = [
    'India', 'United States', 'United Kingdom', 'United Arab Emirates',
    'Canada', 'Australia', 'Singapore', 'Germany', 'France'
  ];

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Digits only
    setNewCustomer({ ...newCustomer, phoneNumber: value });
  };

  const addCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.gstNumber) {
      alert('Name and GST Number are mandatory.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:4000/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newCustomer),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create customer');
      }

      setNewCustomer({
        name: '', email: '', phoneCountryCode: '+91', phoneNumber: '', gstNumber: '',
        street: '', district: '', city: '', state: '', pincode: '', country: 'India'
      });
      setIsFormVisible(false);
      refetch();
    } catch (err) {
      console.error('Add customer error:', err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  const deleteCustomer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;

    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`http://localhost:4000/api/customers/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error('Failed to delete');
      refetch();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const customers = apiData?.customers ?? [];
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
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

                <form onSubmit={addCustomer} className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                  <div className="space-y-6">
                    <div className="group space-y-2">
                      <label className="form-label group-focus-within:form-label-active">Client Name <span className="text-red-500">*</span></label>
                      <div className="form-input-container">
                        <User className="form-input-icon" />
                        <Input
                          placeholder="Legal Entity or Individual"
                          value={newCustomer.name}
                          required
                          className="form-input-field"
                          onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="group space-y-2">
                      <label className="form-label">GST Number <span className="text-red-500">*</span></label>
                      <div className="form-input-container">
                        <ArrowUpRight className="form-input-icon" />
                        <Input
                          placeholder="22AAAAA0000A1Z5"
                          value={newCustomer.gstNumber}
                          required
                          className="form-input-field"
                          onChange={(e) => setNewCustomer({ ...newCustomer, gstNumber: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="group space-y-2">
                      <label className="form-label">Email Address</label>
                      <div className="form-input-container">
                        <Mail className="form-input-icon" />
                        <Input
                          type="email"
                          placeholder="client@company.com"
                          value={newCustomer.email}
                          className="form-input-field"
                          onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="group space-y-2 col-span-1">
                        <label className="form-label">Code</label>
                        <Input
                          placeholder="+91"
                          value={newCustomer.phoneCountryCode}
                          className="form-input-field h-12"
                          onChange={(e) => setNewCustomer({ ...newCustomer, phoneCountryCode: e.target.value })}
                        />
                      </div>
                      <div className="group space-y-2 col-span-3">
                        <label className="form-label">Contact Number (Digits Only)</label>
                        <div className="form-input-container">
                          <Phone className="form-input-icon" />
                          <Input
                            placeholder="9876543210"
                            value={newCustomer.phoneNumber}
                            className="form-input-field"
                            onChange={handlePhoneChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-slate-100 my-4" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address Information</p>

                    <div className="group space-y-2">
                      <label className="form-label">Building / Road / Lane</label>
                      <div className="form-input-container">
                        <MapPin className="form-input-icon" />
                        <Input
                          placeholder="Flat 101, Park Avenue"
                          value={newCustomer.street}
                          className="form-input-field"
                          onChange={(e) => setNewCustomer({ ...newCustomer, street: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="group space-y-2">
                        <label className="form-label">District</label>
                        <Input
                          placeholder="Central"
                          value={newCustomer.district}
                          className="form-input-field h-12"
                          onChange={(e) => setNewCustomer({ ...newCustomer, district: e.target.value })}
                        />
                      </div>
                      <div className="group space-y-2">
                        <label className="form-label">City</label>
                        <Input
                          placeholder="Mumbai"
                          value={newCustomer.city}
                          className="form-input-field h-12"
                          onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="group space-y-2">
                        <label className="form-label">State</label>
                        <Input
                          placeholder="Maharashtra"
                          value={newCustomer.state}
                          className="form-input-field h-12"
                          onChange={(e) => setNewCustomer({ ...newCustomer, state: e.target.value })}
                        />
                      </div>
                      <div className="group space-y-2">
                        <label className="form-label">Pincode</label>
                        <Input
                          placeholder="400001"
                          value={newCustomer.pincode}
                          className="form-input-field h-12"
                          onChange={(e) => setNewCustomer({ ...newCustomer, pincode: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="group space-y-2">
                      <label className="form-label">Country</label>
                      <select
                        className="form-input-field w-full h-12 px-4 rounded-xl border border-slate-200 bg-white"
                        value={newCustomer.country}
                        onChange={(e) => setNewCustomer({ ...newCustomer, country: e.target.value })}
                      >
                        {countries.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>


                  <div className="pt-10 mt-auto">
                    <Button
                      type="submit"
                      loading={isSubmitting}
                      className="w-full h-16 bg-slate-900 hover:bg-black text-white rounded-2xl transition-all shadow-xl font-bold text-lg group"
                    >
                      Create Directory Entry <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                    <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-6">
                      Data is synchronized with your cloud database
                    </p>
                  </div>

                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="lg:col-span-12 space-y-20">
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
                className="empty-state-container dark:bg-slate-900/30 mt-7 dark:border-white/5"
              >
                <div className="w-28 h-28 bg-white rounded-sm shadow-2xl flex items-center justify-center mb-8 relative dark:bg-slate-800">
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
              <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-white/5 rounded-[24px] overflow-hidden shadow-xl mt-8">
                <div className="flex flex-col divide-y divide-slate-100/80 dark:divide-white/5">
                  {filteredCustomers.map((customer, index) => {
                    const isExpanded = expandedCustomerId === customer.id;
                    
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                        key={customer.id}
                        className={cn(
                          "group relative transition-all duration-300",
                          isExpanded ? "bg-white/60 dark:bg-slate-900/60" : "hover:bg-white/50 dark:hover:bg-slate-900/50"
                        )}
                      >
                        {/* Header Row (Always Visible) */}
                        <div 
                          className="flex items-center gap-6 p-6 cursor-pointer select-none"
                          onClick={() => toggleExpand(customer.id)}
                        >
                        {/* Avatar */}
                        <div className={cn(
                          "w-12 h-12 rounded-[16px] flex items-center justify-center font-black text-xl transition-all duration-500 shadow-inner group-hover:rotate-3 shrink-0",
                          isExpanded ? "bg-primary text-white" : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-white group-hover:bg-primary/10 group-hover:text-primary"
                        )}>
                          {customer.name.charAt(0)}
                        </div>

                        {/* Name & Email */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-black text-slate-900 tracking-tight truncate dark:text-white transition-colors group-hover:text-primary">
                            {customer.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <p className="text-sm font-medium text-slate-500 truncate dark:text-slate-400">
                              {customer.email || 'No email provided'}
                            </p>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="hidden md:flex items-center gap-2 mr-6 shrink-0">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest gap-2">Active</span>
                        </div>

                        {/* ID */}
                        <div className="hidden lg:block text-right mr-6 shrink-0">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Client ID</p>
                           <p className="text-sm font-bold text-slate-700 dark:text-slate-300 font-mono">
                             {customer.id.slice(-8).toUpperCase()}
                           </p>
                        </div>

                      </div>

                      {/* Expanded Content Panel */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-white/5"
                          >
                            <div className="p-6 md:p-8">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                {/* Contact Details Card */}
                                <div className="space-y-4">
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5" /> Contact Info
                                  </p>
                                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-white/5">
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                      {customer.phoneCountryCode} {customer.phoneNumber || '—'}
                                    </p>
                                  </div>
                                </div>

                                {/* Address Card */}
                                <div className="space-y-4">
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5" /> Location
                                  </p>
                                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-white/5">
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate" title={[customer.street, customer.city, customer.state].filter(Boolean).join(', ')}>
                                      {[customer.street, customer.city, customer.state].filter(Boolean).join(', ') || '—'}
                                    </p>
                                  </div>
                                </div>

                                {/* GST Card */}
                                <div className="space-y-4">
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <ArrowUpRight className="w-3.5 h-3.5" /> Tax Identity
                                  </p>
                                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-white/5">
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 font-mono">
                                      {customer.gstNumber}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Action Footer */}
                              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/50 dark:border-white/5">
                                <Button
                                  variant="ghost"
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50 font-bold tracking-wide w-full sm:w-auto"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteCustomer(customer.id);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" /> Delete Entry
                                </Button>
                                <Button className="bg-slate-900 hover:bg-black text-white font-bold px-8 rounded-xl shadow-lg shadow-slate-900/20 group w-full sm:w-auto">
                                  Manage Profile <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
