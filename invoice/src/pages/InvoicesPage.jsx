import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiData } from '../hooks/useApiData';
import {
  FileText, Search, Filter, Download, 
  RotateCcw, ChevronRight, Calendar, User, 
  ArrowUpRight, ListChecks, CheckCircle2, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import './InvoicesPage.css';

const InvoicesPage = () => {
  const { data: apiData, isLoading } = useApiData('/invoices');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedInvoiceId, setExpandedInvoiceId] = useState(null);
  const navigate = useNavigate();

  const toggleExpand = (id) => {
    setExpandedInvoiceId(prev => prev === id ? null : id);
  };

  const handleRemake = (invoice) => {
    // Navigate back to the editor with the invoice data in state
    navigate('/', { state: { remakeData: invoice } });
  };

  const invoices = apiData?.invoices ?? [];
  const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
  const totalInvoices = invoices.length;

  const filteredInvoices = invoices
    .filter(inv =>
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.invoiceNumber.localeCompare(a.invoiceNumber, undefined, { numeric: true, sensitivity: 'base' }));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="ip-page">
      {/* Page Header */}
      <div className="ip-header">
        <div>
          <div className="ip-eyebrow">
            <FileText size={13} strokeWidth={2.5} />
            Billing History
          </div>
          <h1 className="ip-title">Invoice Archive</h1>
          <p className="ip-subtitle">
            Review and manage previously generated invoices.
          </p>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="ip-stats-dashboard">
        <div className="ip-stat-card primary">
          <div className="ip-stat-icon">
            <ArrowUpRight size={20} />
          </div>
          <div className="ip-stat-info">
            <span className="ip-stat-label">Total Revenue</span>
            <h2 className="ip-stat-value">{formatCurrency(totalRevenue)}</h2>
          </div>
        </div>
        <div className="ip-stat-card">
          <div className="ip-stat-icon grey">
            <FileText size={20} />
          </div>
          <div className="ip-stat-info">
            <span className="ip-stat-label">Total Invoices</span>
            <h2 className="ip-stat-value">{totalInvoices}</h2>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="ip-search-row">
        <div className="ip-search-wrap">
          <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            className="ip-search-input"
            placeholder="Search by invoice # or customer…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="ip-filter-btn">
          <Filter size={14} strokeWidth={2} style={{ marginRight: 6 }} /> Filters
        </button>
      </div>

      {/* Invoice List */}
      <div className="ip-table-wrap">
        {isLoading ? (
          <div className="ip-loading">
            <div className="ip-spinner" /> Loading Archive…
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="ip-empty">
            <div className="ip-empty-icon"><FileText size={28} color="#cbd5e1" /></div>
            <p className="ip-empty-title">No invoices found</p>
            <p className="ip-empty-sub">Your generated invoices will appear here.</p>
          </div>
        ) : (
          <table className="ip-table">
            <thead>
              <tr>
                <th className="ip-th mob-col-id">Invoice #</th>
                <th className="ip-th mobile-hide">Date</th>
                <th className="ip-th mob-col-name">Customer</th>
                <th className="ip-th mob-col-amount">Total Amount</th>
                <th className="ip-th mobile-hide" style={{ textAlign: 'left' }}>Status</th>
                <th className="ip-th mobile-hide" style={{ textAlign: 'left' }}>Created By</th>
                <th className="ip-th mobile-only-cell" style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => {
                const isExpanded = expandedInvoiceId === inv.id;
                const formattedTotal = new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR'
                }).format(inv.totalAmount);
                
                const issueDate = new Date(inv.issueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                return (
                  <React.Fragment key={inv.id}>
                    <tr
                      className={cn("ip-row", isExpanded ? "expanded" : "collapsed")}
                      onClick={() => toggleExpand(inv.id)}
                    >
                      <td className="ip-td mob-col-id">
                        <span className="ip-id-badge">{inv.invoiceNumber}</span>
                      </td>
                      <td className="ip-td mobile-hide">
                        <div className="ip-date-cell">
                          <Calendar size={13} color="#94a3b8" />
                          <span>{issueDate}</span>
                        </div>
                      </td>
                      <td className="ip-td mob-col-name">
                        <div className="ip-customer-cell">
                          <User size={13} color="#94a3b8" />
                          <span>{inv.customer?.name}</span>
                        </div>
                      </td>
                      <td className="ip-td mob-col-amount">
                        <span className="ip-total-cell">{formattedTotal}</span>
                      </td>
                      <td className="ip-td mobile-hide">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 8 }}>
                          <span className={cn("ip-status-badge", inv.status?.toLowerCase())}>
                            <span className="ip-status-dot" />
                            {inv.status || 'SENT'}
                          </span>
                        </div>
                      </td>
                      <td className="ip-td mobile-hide">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                          <div className="ip-creator-badge">
                            <div className="ip-creator-avatar">
                              {inv.createdBy?.name?.charAt(0) || 'U'}
                            </div>
                            <span>{inv.createdBy?.name || 'System'}</span>
                          </div>
                          <ChevronRight
                            size={14}
                            color="#cbd5e1"
                            style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                          />
                        </div>
                      </td>
                      {/* Show Chevron on mobile since Created By is hidden */}
                      <td className="ip-td mobile-only-cell">
                         <ChevronRight
                            size={14}
                            color="#cbd5e1"
                            style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                          />
                      </td>
                    </tr>

                    {/* Expanded Row */}
                    {isExpanded && (
                      <tr className="ip-row expanded">
                        <td colSpan={7} className="ip-expanded-row-cell">
                          <div className="ip-expanded-row-content">
                            <div className="ip-detail-grid">
                              <DetailCard
                                icon={<Calendar size={13} color="#94a3b8" />}
                                label="Issue Date"
                                value={issueDate}
                              />
                              <DetailCard
                                icon={<Clock size={13} color="#94a3b8" />}
                                label="Status"
                                value={inv.status || 'SENT'}
                              />
                              <DetailCard
                                icon={<ListChecks size={13} color="#94a3b8" />}
                                label="Items Summary"
                                value={`${inv.items?.length || 0} Line Items`}
                              />
                              <DetailCard
                                icon={<ArrowUpRight size={13} color="#94a3b8" />}
                                label="Subtotal"
                                value={`₹${Number(inv.subtotal).toLocaleString('en-IN')}`}
                              />
                              <DetailCard
                                icon={<CheckCircle2 size={13} color="#94a3b8" />}
                                label="Total Tax"
                                value={`₹${Number(inv.taxAmount).toLocaleString('en-IN')}`}
                              />
                            </div>

                            <div className="ip-expanded-actions">
                              <button 
                                className="ip-view-btn" 
                                onClick={(e) => { e.stopPropagation(); handleRemake(inv); }}
                                title="Remake Invoice"
                              >
                                <RotateCcw size={13} style={{ marginRight: 6 }} />
                                Remake Invoice
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
          </table>
        )}
      </div>
    </div>
  );
};

/* Sub-components */
const DetailCard = ({ icon, label, value }) => (
  <div className="ip-detail-card">
    <p className="ip-detail-label">{icon} {label}</p>
    <p className="ip-detail-value">{value}</p>
  </div>
);

export default InvoicesPage;
