import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './ProductsPage.css';
import {
  Plus, Trash2, Tag, IndianRupee, Search,
  Filter, ArrowUpRight, ShoppingBag,
  PlusCircle, Box, Archive, ChevronRight, Package
} from 'lucide-react';

import { useApiData } from '../hooks/useApiData';

const CATEGORIES = ['Service', 'Physical Product', 'Digital Goods', 'Subscription'];

const CATEGORY_STYLES = {
  'Service': { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  'Physical Product': { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  'Digital Goods': { bg: '#faf5ff', color: '#7c3aed', border: '#ddd6fe' },
  'Subscription': { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
};

const ProductsPage = () => {
  const { data: servicesData, isLoading, error, refetch } = useApiData('/services');
  const products = servicesData?.services || [];

  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', category: 'Service' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const addProduct = async (e) => {
    e.preventDefault();
    const parsedPrice = Number(newProduct.price);
    if (!newProduct.name || isNaN(parsedPrice) || parsedPrice <= 0) return;
    setIsActionLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(newProduct),
      });
      if (response.ok) {
        setNewProduct({ name: '', price: '', description: '', category: 'Service' });
        setIsFormVisible(false);
        refetch();
      }
    } catch (err) {
      console.error('Add product error:', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setIsActionLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/services/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
      });
      if (response.ok) {
        if (expandedId === id) setExpandedId(null);
        refetch();
      }
    } catch (err) {
      console.error('Delete product error:', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pp-page">

      {/* ── Header ─────────────────────────────────── */}
      <div className="pp-header">
        <div>
          <div className="pp-eyebrow"><Box size={13} strokeWidth={2.5} /> Inventory Control</div>
          <h1 className="pp-title">Product Catalog</h1>
          <p className="pp-subtitle">Manage your catalog items and pricing for fast invoice generation.</p>
        </div>
        <div className="pp-header-actions">
          <button className="pp-btn-outline">
            <Archive size={14} strokeWidth={2} style={{ marginRight: 6 }} /> Categories
          </button>
          <button className="pp-btn-primary" onClick={() => setIsFormVisible(true)}>
            <PlusCircle size={15} strokeWidth={2.5} style={{ marginRight: 6 }} /> Create Product
          </button>
        </div>
      </div>

      {/* ── Slide-over Form ─────────────────────────── */}
      {isFormVisible && (
        <>
          <div className="pp-overlay" onClick={() => setIsFormVisible(false)} />
          <div className="pp-slide-panel">
            <div className="pp-panel-header">
              <div>
                <h2 className="pp-panel-title">New Product</h2>
                <p className="pp-panel-sub">Catalog Expansion</p>
              </div>
              <button className="pp-close-btn" onClick={() => setIsFormVisible(false)}>✕</button>
            </div>

            <form onSubmit={addProduct} className="pp-form-scroll">
              <div>
                <label className="pp-label">Product Title <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ position: 'relative', marginTop: 5 }}>
                  <Tag size={14} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    className="pp-input"
                    style={{ paddingLeft: 34 }}
                    placeholder="e.g. Premium Consulting Package"
                    value={newProduct.name}
                    required
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="pp-label">Base Price (₹) <span style={{ color: '#ef4444' }}>*</span></label>
                  <div style={{ position: 'relative', marginTop: 5 }}>
                    <IndianRupee size={14} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      className="pp-input"
                      style={{ paddingLeft: 34 }}
                      type="number"
                      placeholder="0.00"
                      value={newProduct.price}
                      required
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="pp-label">Category</label>
                  <select
                    className="pp-input"
                    style={{ marginTop: 5, cursor: 'pointer' }}
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="pp-label">Description</label>
                <textarea
                  className="pp-input"
                  style={{ marginTop: 5, height: 100, resize: 'vertical', lineHeight: 1.6 }}
                  placeholder="Features, scope, and value proposition…"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>

              <button type="submit" className="pp-submit-btn" style={{ marginTop: 8, opacity: isActionLoading ? 0.7 : 1 }} disabled={isActionLoading}>
                {isActionLoading ? 'Adding...' : 'Add to Catalog'} <ArrowUpRight size={14} style={{ marginLeft: 6 }} />
              </button>
            </form>
          </div>
        </>
      )}

      {/* ── Search ──────────────────────────────────── */}
      <div className="pp-search-row">
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            className="pp-search-input"
            placeholder="Search by product name or description…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="pp-filter-btn">
          <Filter size={14} strokeWidth={2} style={{ marginRight: 6 }} /> Filters
        </button>
      </div>

      {/* ── Product Table ───────────────────────────── */}
      <div className="pp-table-wrap">
        {isLoading ? (
          <div className="pp-empty" style={{ padding: '40px 0' }}>
            <div className="ie-spinner" style={{ width: 18, height: 18, borderTopColor: '#94a3b8' }} />
            <p className="pp-empty-sub" style={{ marginTop: 10 }}>Fething products...</p>
          </div>
        ) : error ? (
          <div className="pp-empty" style={{ padding: '40px 0' }}>
             <p className="pp-empty-sub" style={{ color: '#ef4444' }}>Backend Connection Error. Please verify the port 4000 server is active.</p>
             <button className="pp-btn-outline" onClick={refetch} style={{ marginTop: 10 }}>Try Again</button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="pp-empty">
            <div className="pp-empty-icon"><ShoppingBag size={28} color="#cbd5e1" /></div>
            <p className="pp-empty-title">No products found</p>
            <p className="pp-empty-sub">Create your first catalog item to speed up invoice generation.</p>
            <button className="pp-btn-primary" onClick={() => setIsFormVisible(true)}>
              <Plus size={14} style={{ marginRight: 6 }} /> Create Product
            </button>
          </div>
        ) : (
          <table className="pp-table">
            <thead>
              <tr>
                <th className="pp-th" style={{ width: '12%', textAlign: 'left' }}>ID</th>
                <th className="pp-th" style={{ width: '30%' }}>Product</th>
                <th className="pp-th" style={{ width: '18%' }}>Category</th>
                <th className="pp-th" style={{ width: '18%' }}>Unit Price</th>
                <th className="pp-th" style={{ width: '22%' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const isExpanded = expandedId === product.id;
                const cat = CATEGORY_STYLES[product.category] || CATEGORY_STYLES['Service'];
                return (
                  <React.Fragment key={product.id}>
                    <tr
                      className={isExpanded ? "pp-row expanded" : "pp-row collapsed"}
                      onClick={() => setExpandedId(prev => prev === product.id ? null : product.id)}
                    >
                      {/* ID */}
                      <td className="pp-td" style={{ textAlign: 'left' }}>
                        <span className="pp-id-badge">{String(product.id).slice(-5)}</span>
                      </td>

                      {/* Product Name */}
                      <td className="pp-td">
                        <div className="pp-name-cell">
                          <div className="pp-product-icon">
                            <Package size={14} color="#64748b" />
                          </div>
                          <span className="pp-product-name">{product.name}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="pp-td">
                        <span className="pp-cat-badge" style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.border}` }}>
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="pp-td">
                        <span className="pp-price">₹{Number(product.defaultPrice || product.price).toLocaleString('en-IN')}</span>
                      </td>

                      {/* Description preview + chevron */}
                      <td className="pp-td">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                          <span className="pp-desc-preview">
                            {product.description ? product.description.slice(0, 48) + (product.description.length > 48 ? '…' : '') : '—'}
                          </span>
                          <ChevronRight
                            size={14}
                            color="#cbd5e1"
                            style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                          />
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Panel */}
                    {isExpanded && (
                      <tr className="pp-row expanded">
                        <td colSpan={5} style={{ padding: '0 20px 20px' }}>
                          <div className="pp-expanded-body">
                            <div className="pp-detail-grid">
                              <DetailCard label="Full Description" value={product.description || 'No description provided.'} />
                              <DetailCard label="Unit Price" value={`₹${Number(product.defaultPrice || product.price).toLocaleString('en-IN')}`} mono />
                              <DetailCard label="Category" value={product.category} />
                            </div>
                            <div className="pp-expanded-actions">
                              <button
                                className="pp-delete-btn"
                                style={{ opacity: isActionLoading ? 0.6 : 1 }}
                                disabled={isActionLoading}
                                onClick={(e) => { e.stopPropagation(); deleteProduct(product.id); }}
                              >
                                <Trash2 size={13} style={{ marginRight: 6 }} /> {isActionLoading ? 'Removing...' : 'Remove Item'}
                              </button>
                              <button className="pp-edit-btn" onClick={(e) => e.stopPropagation()}>
                                Edit Product <ArrowUpRight size={13} style={{ marginLeft: 6 }} />
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

        {filteredProducts.length > 0 && (
          <div className="pp-table-footer">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} in catalog
          </div>
        )}
      </div>
    </div>
  );
};

const DetailCard = ({ label, value, mono }) => (
  <div className="pp-detail-card">
    <p className="pp-detail-label">{label}</p>
    <p className="pp-detail-value" style={{ fontFamily: mono ? 'monospace' : 'inherit' }}>{value}</p>
  </div>
);

export default ProductsPage;