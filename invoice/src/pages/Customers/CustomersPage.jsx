import React, { useState } from 'react';
import { useApiData } from '../../hooks/useApiData';
import './CustomersPage.css';

import {
  Plus, Trash2, User, Mail, MapPin, Search, Filter,
  Download, Phone, UserCheck,
  ArrowUpRight, Users, ExternalLink, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [expandedCustomerId, setExpandedCustomerId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedCustomerId(prev => prev === id ? null : id);
  };

  const countries = [
    'India', 'United States', 'United Kingdom', 'United Arab Emirates',
    'Canada', 'Australia', 'Singapore', 'Germany', 'France'
  ];

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setNewCustomer({ ...newCustomer, phoneNumber: value });
  };

  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.gstNumber) {
      alert('Name and GST Number are mandatory.');
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('auth_token');
      const url = editingCustomer
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/customers/${editingCustomer.id}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/customers`;
      
      const method = editingCustomer ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newCustomer),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to save customer');
      }

      setNewCustomer({
        name: '', email: '', phoneCountryCode: '+91', phoneNumber: '', gstNumber: '',
        street: '', district: '', city: '', state: '', pincode: '', country: 'India'
      });
      setEditingCustomer(null);
      setIsFormVisible(false);
      refetch();
    } catch (err) {
      console.error('Save customer error:', err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/customers/${id}`, {
        method: 'DELETE',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
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
    <div className="cp-page">

      {/* ── Page Header ────────────────────────────── */}
      <div className="cp-header">
        <div>
          <div className="cp-eyebrow">
            <UserCheck size={13} strokeWidth={2.5} />
            CRM Database
          </div>
          <h1 className="cp-title">Client Directory</h1>
          <p className="cp-subtitle">
            Manage professional relationships and contact records.
          </p>
        </div>
        <div className="cp-header-actions">
          <button className="cp-btn-outline">
            <Download size={14} strokeWidth={2} style={{ marginRight: 6 }} />
            Export
          </button>
          <button className="cp-btn-primary" onClick={() => { setEditingCustomer(null); setNewCustomer({ name: '', email: '', phoneCountryCode: '+91', phoneNumber: '', gstNumber: '', street: '', district: '', city: '', state: '', pincode: '', country: 'India' }); setIsFormVisible(true); }}>
            <Plus size={15} strokeWidth={2.5} style={{ marginRight: 6 }} />
            Add Client
          </button>
        </div>
      </div>

      {/* ── Slide-over Form Panel ───────────────────── */}
      {isFormVisible && (
        <>
          <div className="cp-overlay" onClick={() => setIsFormVisible(false)} />
          <div className="cp-slide-panel">
            <div className="cp-panel-header">
              <div>
                <h2 className="cp-panel-title">{editingCustomer ? 'Edit Client' : 'New Client'}</h2>
                <p className="cp-panel-sub">{editingCustomer ? 'Update Directory Entry' : 'Directory Addition'}</p>
              </div>
              <button className="cp-close-btn" onClick={() => { setIsFormVisible(false); setEditingCustomer(null); }}>✕</button>
            </div>

            <form onSubmit={handleSaveCustomer} className="cp-form-scroll">
              <FormField label="Client Name" required icon={<User size={15} color="#94a3b8" />}>
                <input
                  className="cp-input"
                  placeholder="Legal Entity or Individual"
                  value={newCustomer.name}
                  required
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                />
              </FormField>

              <FormField label="GST Number" required icon={<ArrowUpRight size={15} color="#94a3b8" />}>
                <input
                  className="cp-input"
                  placeholder="22AAAAA0000A1Z5"
                  value={newCustomer.gstNumber}
                  required
                  onChange={(e) => setNewCustomer({ ...newCustomer, gstNumber: e.target.value })}
                />
              </FormField>

              <FormField label="Email Address" icon={<Mail size={15} color="#94a3b8" />}>
                <input
                  className="cp-input"
                  type="email"
                  placeholder="client@company.com"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                />
              </FormField>

              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 10 }}>
                <div>
                  <label className="cp-label">Code</label>
                  <input
                    className="cp-input"
                    style={{ textAlign: 'center' }}
                    placeholder="+91"
                    value={newCustomer.phoneCountryCode}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phoneCountryCode: e.target.value })}
                  />
                </div>
                <FormField label="Contact Number" icon={<Phone size={15} color="#94a3b8" />}>
                  <input
                    className="cp-input"
                    placeholder="9876543210"
                    value={newCustomer.phoneNumber}
                    onChange={handlePhoneChange}
                  />
                </FormField>
              </div>

              <div className="cp-divider" />
              <p className="cp-section-label">Address Information</p>

              <FormField label="Street / Building" icon={<MapPin size={15} color="#94a3b8" />}>
                <input
                  className="cp-input"
                  placeholder="Flat 101, Park Avenue"
                  value={newCustomer.street}
                  onChange={(e) => setNewCustomer({ ...newCustomer, street: e.target.value })}
                />
              </FormField>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label className="cp-label">District</label>
                  <input className="cp-input" placeholder="Central" value={newCustomer.district}
                    onChange={(e) => setNewCustomer({ ...newCustomer, district: e.target.value })} />
                </div>
                <div>
                  <label className="cp-label">City</label>
                  <input className="cp-input" placeholder="Mumbai" value={newCustomer.city}
                    onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label className="cp-label">State</label>
                  <input className="cp-input" placeholder="Maharashtra" value={newCustomer.state}
                    onChange={(e) => setNewCustomer({ ...newCustomer, state: e.target.value })} />
                </div>
                <div>
                  <label className="cp-label">Pincode</label>
                  <input className="cp-input" placeholder="400001" value={newCustomer.pincode}
                    onChange={(e) => setNewCustomer({ ...newCustomer, pincode: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="cp-label">Country</label>
                <select className="cp-input" style={{ cursor: 'pointer' }}
                  value={newCustomer.country}
                  onChange={(e) => setNewCustomer({ ...newCustomer, country: e.target.value })}>
                  {countries.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <button type="submit" className="cp-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingCustomer ? 'Update Directory Entry' : 'Create Directory Entry'}
              </button>
            </form>
          </div>
        </>
      )}

      {/* ── Search Bar ─────────────────────────────── */}
      <div className="cp-search-row">
        <div className="cp-search-wrap">
          <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            className="cp-search-input"
            placeholder="Search by name or email…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="cp-filter-btn">
          <Filter size={14} strokeWidth={2} style={{ marginRight: 6 }} /> Filters
        </button>
      </div>

      {/* ── Customer List ───────────────────────────── */}
      <div className="cp-table-wrap">
        {filteredCustomers.length === 0 ? (
          <div className="cp-empty">
            <div className="cp-empty-icon"><Users size={28} color="#cbd5e1" /></div>
            <p className="cp-empty-title">No clients found</p>
            <p className="cp-empty-sub">Add your first client to get started.</p>
            <button className="cp-btn-primary" onClick={() => { setEditingCustomer(null); setNewCustomer({ name: '', email: '', phoneCountryCode: '+91', phoneNumber: '', gstNumber: '', street: '', district: '', city: '', state: '', pincode: '', country: 'India' }); setIsFormVisible(true); }}>
              <Plus size={14} style={{ marginRight: 6 }} /> Add Client
            </button>
          </div>
        ) : (
          <table className="cp-table">
            <thead>
              <tr>
                <th className="cp-th mob-col-id">ID</th>
                <th className="cp-th mob-col-name">Client Name</th>
                <th className="cp-th mobile-hide">Email</th>
                <th className="cp-th mobile-hide">Phone</th>
                <th className="cp-th mob-col-amount">Status</th>
                <th className="cp-th mobile-only-cell" style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => {
                const isExpanded = expandedCustomerId === customer.id;
                return (
                  <React.Fragment key={customer.id}>
                    <tr
                      className={cn("cp-row", isExpanded ? "expanded" : "collapsed")}
                      onClick={() => toggleExpand(customer.id)}
                    >
                      <td className="cp-td mob-col-id">
                        <span className="cp-id-badge">{customer.id.slice(-6).toUpperCase()}</span>
                      </td>
                      <td className="cp-td mob-col-name">
                        <div className="cp-name-cell">
                          <div className="cp-avatar">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="cp-client-name">{customer.name}</span>
                        </div>
                      </td>
                      <td className="cp-td mobile-hide">
                        <span className="cp-cell-muted">{customer.email || '—'}</span>
                      </td>
                      <td className="cp-td mobile-hide">
                        <span className="cp-cell-muted">
                          {customer.phoneNumber
                            ? `${customer.phoneCountryCode} ${customer.phoneNumber}`
                            : '—'}
                        </span>
                      </td>
                      <td className="cp-td mob-col-amount">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                          <span className="cp-status-badge">
                            <span className="cp-status-dot" />
                            Active
                          </span>
                        </div>
                      </td>
                      <td className="cp-td mobile-only-cell">
                         <ChevronRight
                            size={14}
                            color="#cbd5e1"
                            style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                          />
                      </td>
                    </tr>

                    {/* Expanded Row */}
                    {isExpanded && (
                      <tr className="cp-row expanded">
                        <td colSpan={6} style={{ padding: '0 20px 20px 20px' }}>
                          <div className="cp-expanded-body">
                            <div className="cp-detail-grid">
                              <DetailCard
                                icon={<MapPin size={13} color="#94a3b8" />}
                                label="Registered Address"
                                value={[customer.street, customer.city, customer.state, customer.pincode].filter(Boolean).join(', ') || '—'}
                              />
                              <DetailCard
                                icon={<ArrowUpRight size={13} color="#94a3b8" />}
                                label="GST / Tax ID"
                                value={customer.gstNumber || 'Unregistered'}
                                mono
                              />
                              <DetailCard
                                icon={<Mail size={13} color="#94a3b8" />}
                                label="Full Email"
                                value={customer.email || '—'}
                              />
                            </div>

                            <div className="cp-expanded-actions">
                              <button
                                className="cp-delete-btn"
                                onClick={(e) => { e.stopPropagation(); deleteCustomer(customer.id); }}
                              >
                                <Trash2 size={13} style={{ marginRight: 6 }} />
                                Remove Client
                              </button>
                              <button 
                                className="cp-profile-btn" 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setEditingCustomer(customer);
                                  setNewCustomer({
                                    name: customer.name,
                                    email: customer.email || '',
                                    phoneCountryCode: customer.phoneCountryCode || '+91',
                                    phoneNumber: customer.phoneNumber || '',
                                    gstNumber: customer.gstNumber || '',
                                    street: customer.street || '',
                                    district: customer.district || '',
                                    city: customer.city || '',
                                    state: customer.state || '',
                                    pincode: customer.pincode || '',
                                    country: customer.country || 'India'
                                  });
                                  setIsFormVisible(true);
                                }}
                              >
                                Edit Profile
                                <ArrowUpRight size={13} style={{ marginLeft: 6 }} />
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
            {filteredCustomers.length > 0 && (
              <tfoot>
                <tr className="cp-footer-row">
                  <td colSpan={6} className="cp-footer-td">
                    {filteredCustomers.length} client{filteredCustomers.length !== 1 ? 's' : ''} in directory
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        )}
      </div>
    </div>
  );
};

/* ── Sub-components ──────────────────────────── */
const FormField = ({ label, required, icon, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
    <label className="cp-label">
      {label}{required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
    </label>
    <div style={{ position: 'relative' }}>
      {icon && <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>{icon}</span>}
      {React.cloneElement(children, {
        className: children.props.className ? `cp-input ${children.props.className}` : 'cp-input',
        style: { ...children.props.style, paddingLeft: icon ? 36 : 12 }
      })}
    </div>
  </div>
);

const DetailCard = ({ icon, label, value, mono }) => (
  <div className="cp-detail-card">
    <p className="cp-detail-label">{icon} {label}</p>
    <p className="cp-detail-value" style={{ fontFamily: mono ? 'monospace' : 'inherit' }}>{value}</p>
  </div>
);

export default CustomersPage;