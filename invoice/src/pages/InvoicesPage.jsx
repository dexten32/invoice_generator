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
  const filteredInvoices = invoices.filter(inv =>
    inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.customer?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <th className="ip-th" style={{ textAlign: 'left' }}>Invoice #</th>
                <th className="ip-th">Date</th>
                <th className="ip-th">Customer</th>
                <th className="ip-th">Total Amount</th>
                <th className="ip-th">Status</th>
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
                      <td className="ip-td" style={{ textAlign: 'left' }}>
                        <span className="ip-id-badge">{inv.invoiceNumber}</span>
                      </td>
                      <td className="ip-td">
                        <div className="ip-date-cell">
                          <Calendar size={13} color="#94a3b8" />
                          <span>{issueDate}</span>
                        </div>
                      </td>
                      <td className="ip-td">
                        <div className="ip-customer-cell">
                          <User size={13} color="#94a3b8" />
                          <span>{inv.customer?.name}</span>
                        </div>
                      </td>
                      <td className="ip-td ip-amount-cell">
                        {formattedTotal}
                      </td>
                      <td className="ip-td">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                          <span className={cn("ip-status-badge", inv.status?.toLowerCase())}>
                            <span className="ip-status-dot" />
                            {inv.status || 'SENT'}
                          </span>
                          <ChevronRight
                            size={14}
                            color="#cbd5e1"
                            style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                          />
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Row */}
                    {isExpanded && (
                      <tr className="ip-row expanded">
                        <td colSpan={5} style={{ padding: '0 20px 20px 20px' }}>
                          <div className="ip-expanded-body">
                            <div className="ip-detail-grid">
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
                                className="ip-remake-btn"
                                onClick={(e) => { e.stopPropagation(); handleRemake(inv); }}
                              >
                                <RotateCcw size={13} style={{ marginRight: 6 }} />
                                Remake Invoice
                              </button>
                              <button className="ip-view-btn" onClick={(e) => e.stopPropagation()}>
                                View PDF
                                <Download size={13} style={{ marginLeft: 6 }} />
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
