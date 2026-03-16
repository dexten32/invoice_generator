import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  Plus, Trash2, Tag, DollarSign, Search,
  Filter, ArrowUpRight, ShoppingBag,
  PlusCircle, Box, Archive, ChevronRight, Package
} from 'lucide-react';

const CATEGORIES = ['Service', 'Physical Product', 'Digital Goods', 'Subscription'];

const CATEGORY_STYLES = {
  'Service':          { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  'Physical Product': { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  'Digital Goods':    { bg: '#faf5ff', color: '#7c3aed', border: '#ddd6fe' },
  'Subscription':     { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
};

const ProductsPage = () => {
  const [products, setProducts] = useLocalStorage('products', []);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', category: 'Service' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const addProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    setProducts([{ ...newProduct, id: Date.now() }, ...products]);
    setNewProduct({ name: '', price: '', description: '', category: 'Service' });
    setIsFormVisible(false);
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={s.page}>

      {/* ── Header ─────────────────────────────────── */}
      <div style={s.header}>
        <div>
          <div style={s.eyebrow}><Box size={13} strokeWidth={2.5} /> Inventory Control</div>
          <h1 style={s.title}>Product Catalog</h1>
          <p style={s.subtitle}>Manage your catalog items and pricing for fast invoice generation.</p>
        </div>
        <div style={s.headerActions}>
          <button style={s.btnOutline}>
            <Archive size={14} strokeWidth={2} style={{ marginRight: 6 }} /> Categories
          </button>
          <button style={s.btnPrimary} onClick={() => setIsFormVisible(true)}>
            <PlusCircle size={15} strokeWidth={2.5} style={{ marginRight: 6 }} /> Create Product
          </button>
        </div>
      </div>

      {/* ── Slide-over Form ─────────────────────────── */}
      {isFormVisible && (
        <>
          <div style={s.overlay} onClick={() => setIsFormVisible(false)} />
          <div style={s.slidePanel}>
            <div style={s.panelHeader}>
              <div>
                <h2 style={s.panelTitle}>New Product</h2>
                <p style={s.panelSub}>Catalog Expansion</p>
              </div>
              <button style={s.closeBtn} onClick={() => setIsFormVisible(false)}>✕</button>
            </div>

            <form onSubmit={addProduct} style={s.formScroll}>
              <div>
                <label style={s.label}>Product Title <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ position: 'relative', marginTop: 5 }}>
                  <Tag size={14} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    style={{ ...s.input, paddingLeft: 34 }}
                    placeholder="e.g. Premium Consulting Package"
                    value={newProduct.name}
                    required
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={s.label}>Base Price (₹) <span style={{ color: '#ef4444' }}>*</span></label>
                  <div style={{ position: 'relative', marginTop: 5 }}>
                    <DollarSign size={14} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      style={{ ...s.input, paddingLeft: 34 }}
                      type="number"
                      placeholder="0.00"
                      value={newProduct.price}
                      required
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label style={s.label}>Category</label>
                  <select
                    style={{ ...s.input, marginTop: 5, cursor: 'pointer' }}
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={s.label}>Description</label>
                <textarea
                  style={{ ...s.input, marginTop: 5, height: 100, resize: 'vertical', lineHeight: 1.6 }}
                  placeholder="Features, scope, and value proposition…"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>

              <button type="submit" style={{ ...s.submitBtn, marginTop: 8 }}>
                Add to Catalog <ArrowUpRight size={14} style={{ marginLeft: 6 }} />
              </button>
            </form>
          </div>
        </>
      )}

      {/* ── Search ──────────────────────────────────── */}
      <div style={s.searchRow}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            style={s.searchInput}
            placeholder="Search by product name or description…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button style={s.filterBtn}>
          <Filter size={14} strokeWidth={2} style={{ marginRight: 6 }} /> Filters
        </button>
      </div>

      {/* ── Product Table ───────────────────────────── */}
      <div style={s.tableWrap}>
        {filteredProducts.length === 0 ? (
          <div style={s.empty}>
            <div style={s.emptyIcon}><ShoppingBag size={28} color="#cbd5e1" /></div>
            <p style={s.emptyTitle}>No products found</p>
            <p style={s.emptySub}>Create your first catalog item to speed up invoice generation.</p>
            <button style={s.btnPrimary} onClick={() => setIsFormVisible(true)}>
              <Plus size={14} style={{ marginRight: 6 }} /> Create Product
            </button>
          </div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={{ ...s.th, width: '35%' }}>Product</th>
                <th style={{ ...s.th, width: '18%' }}>Category</th>
                <th style={{ ...s.th, width: '18%' }}>Unit Price</th>
                <th style={{ ...s.th, width: '19%' }}>Description</th>
                <th style={{ ...s.th, width: '10%', textAlign: 'right' }}>ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const isExpanded = expandedId === product.id;
                const cat = CATEGORY_STYLES[product.category] || CATEGORY_STYLES['Service'];
                return (
                  <React.Fragment key={product.id}>
                    <tr
                      style={{
                        ...s.row,
                        background: isExpanded ? '#f8fafc' : 'white',
                        borderBottom: isExpanded ? 'none' : '1px solid #f1f5f9',
                      }}
                      onClick={() => setExpandedId(prev => prev === product.id ? null : product.id)}
                    >
                      {/* Product Name */}
                      <td style={s.td}>
                        <div style={s.nameCell}>
                          <div style={s.productIcon}>
                            <Package size={14} color="#64748b" />
                          </div>
                          <span style={s.productName}>{product.name}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={s.td}>
                        <span style={{ ...s.catBadge, background: cat.bg, color: cat.color, border: `1px solid ${cat.border}` }}>
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td style={s.td}>
                        <span style={s.price}>₹{Number(product.price).toLocaleString('en-IN')}</span>
                      </td>

                      {/* Description preview */}
                      <td style={s.td}>
                        <span style={s.descPreview}>
                          {product.description ? product.description.slice(0, 48) + (product.description.length > 48 ? '…' : '') : '—'}
                        </span>
                      </td>

                      {/* ID + chevron */}
                      <td style={{ ...s.td, textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                          <span style={s.idBadge}>{String(product.id).slice(-5)}</span>
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
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                        <td colSpan={5} style={{ padding: '0 20px 20px' }}>
                          <div style={s.expandedBody}>
                            <div style={s.detailGrid}>
                              <DetailCard label="Full Description" value={product.description || 'No description provided.'} />
                              <DetailCard label="Unit Price" value={`₹${Number(product.price).toLocaleString('en-IN')}`} mono />
                              <DetailCard label="Category" value={product.category} />
                            </div>
                            <div style={s.expandedActions}>
                              <button
                                style={s.deleteBtn}
                                onClick={(e) => { e.stopPropagation(); deleteProduct(product.id); }}
                              >
                                <Trash2 size={13} style={{ marginRight: 6 }} /> Remove Item
                              </button>
                              <button style={s.editBtn} onClick={(e) => e.stopPropagation()}>
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
          <div style={s.tableFooter}>
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} in catalog
          </div>
        )}
      </div>
    </div>
  );
};

const DetailCard = ({ label, value, mono }) => (
  <div style={dc.card}>
    <p style={dc.label}>{label}</p>
    <p style={{ ...dc.value, fontFamily: mono ? 'monospace' : 'inherit' }}>{value}</p>
  </div>
);

const dc = {
  card: { background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 14px' },
  label: { fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 6px' },
  value: { fontSize: 13.5, fontWeight: 600, color: '#334155', margin: 0, wordBreak: 'break-word', lineHeight: 1.5 },
};

const s = {
  page: {
    maxWidth: 1080,
    margin: '0 auto',
    padding: '40px 32px 80px',
    fontFamily: '"DM Sans", system-ui, sans-serif',
    color: '#0f172a',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
    flexWrap: 'wrap',
    gap: 20,
  },
  eyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#64748b',
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 800,
    letterSpacing: '-0.02em',
    margin: '0 0 6px',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    margin: 0,
  },
  headerActions: { display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 },
  btnOutline: {
    display: 'inline-flex', alignItems: 'center',
    padding: '9px 16px', fontSize: 13, fontWeight: 600,
    border: '1px solid #e2e8f0', borderRadius: 8,
    background: 'white', color: '#334155', cursor: 'pointer',
  },
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center',
    padding: '9px 18px', fontSize: 13, fontWeight: 700,
    border: 'none', borderRadius: 8,
    background: '#0f172a', color: 'white', cursor: 'pointer',
  },
  searchRow: { display: 'flex', gap: 10, marginBottom: 24 },
  searchInput: {
    width: '100%', padding: '10px 14px 10px 38px',
    fontSize: 14, border: '1px solid #e2e8f0', borderRadius: 8,
    outline: 'none', color: '#0f172a', background: 'white', boxSizing: 'border-box',
  },
  filterBtn: {
    display: 'inline-flex', alignItems: 'center',
    padding: '9px 16px', fontSize: 13, fontWeight: 600,
    border: '1px solid #e2e8f0', borderRadius: 8,
    background: 'white', color: '#475569', cursor: 'pointer', flexShrink: 0,
  },
  tableWrap: { border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', background: 'white' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '11px 20px', fontSize: 11, fontWeight: 700,
    letterSpacing: '0.08em', textTransform: 'uppercase',
    color: '#94a3b8', background: '#f8fafc',
    borderBottom: '1px solid #e2e8f0', textAlign: 'left',
  },
  row: { cursor: 'pointer' },
  td: { padding: '14px 20px', verticalAlign: 'middle' },
  nameCell: { display: 'flex', alignItems: 'center', gap: 12 },
  productIcon: {
    width: 32, height: 32, borderRadius: 8,
    background: '#f1f5f9', border: '1px solid #e2e8f0',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  productName: { fontSize: 14, fontWeight: 600, color: '#0f172a' },
  catBadge: {
    display: 'inline-flex', alignItems: 'center',
    fontSize: 11, fontWeight: 700,
    letterSpacing: '0.04em', borderRadius: 20,
    padding: '3px 10px',
  },
  price: { fontSize: 14, fontWeight: 700, color: '#0f172a', fontVariantNumeric: 'tabular-nums' },
  descPreview: { fontSize: 13, color: '#64748b' },
  idBadge: {
    fontSize: 11, fontWeight: 700, fontFamily: 'monospace',
    color: '#94a3b8', background: '#f1f5f9',
    padding: '3px 8px', borderRadius: 5, letterSpacing: '0.05em',
  },
  expandedBody: { paddingTop: 16, borderTop: '1px solid #e2e8f0', marginTop: 4 },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 12, marginBottom: 16,
  },
  expandedActions: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    flexWrap: 'wrap', gap: 10, paddingTop: 12, borderTop: '1px solid #f1f5f9',
  },
  deleteBtn: {
    display: 'inline-flex', alignItems: 'center',
    padding: '8px 14px', fontSize: 13, fontWeight: 600,
    border: '1px solid #fecaca', borderRadius: 8,
    background: '#fff5f5', color: '#dc2626', cursor: 'pointer',
  },
  editBtn: {
    display: 'inline-flex', alignItems: 'center',
    padding: '8px 18px', fontSize: 13, fontWeight: 700,
    border: 'none', borderRadius: 8,
    background: '#0f172a', color: 'white', cursor: 'pointer',
  },
  tableFooter: {
    padding: '12px 20px', fontSize: 12, color: '#94a3b8',
    fontWeight: 500, borderTop: '1px solid #f1f5f9', background: '#f8fafc',
  },
  empty: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '80px 20px', gap: 12,
  },
  emptyIcon: {
    width: 60, height: 60, borderRadius: 14,
    background: '#f8fafc', border: '1px solid #e2e8f0',
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  emptyTitle: { fontSize: 17, fontWeight: 700, color: '#1e293b', margin: 0 },
  emptySub: { fontSize: 14, color: '#94a3b8', margin: '0 0 8px' },
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(15,23,42,0.35)', backdropFilter: 'blur(2px)', zIndex: 40,
  },
  slidePanel: {
    position: 'fixed', top: 0, right: 0, bottom: 0, width: 420,
    background: 'white', zIndex: 50, display: 'flex', flexDirection: 'column',
    boxShadow: '-8px 0 40px rgba(15,23,42,0.12)', padding: '28px 28px 0',
  },
  panelHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingBottom: 20, borderBottom: '1px solid #f1f5f9', marginBottom: 24,
  },
  panelTitle: { fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 3px', letterSpacing: '-0.01em' },
  panelSub: { fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 },
  closeBtn: {
    width: 32, height: 32, border: '1px solid #e2e8f0', borderRadius: 8,
    background: 'white', cursor: 'pointer', fontSize: 14, color: '#64748b',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  formScroll: {
    flex: 1, overflowY: 'auto', paddingBottom: 40,
    display: 'flex', flexDirection: 'column', gap: 14,
  },
  label: { fontSize: 12, fontWeight: 600, color: '#475569', letterSpacing: '0.01em' },
  input: {
    width: '100%', padding: '10px 12px', fontSize: 13.5,
    border: '1px solid #e2e8f0', borderRadius: 8, outline: 'none',
    color: '#0f172a', background: 'white', boxSizing: 'border-box',
  },
  submitBtn: {
    width: '100%', padding: '13px',
    fontSize: 14, fontWeight: 700,
    border: 'none', borderRadius: 10,
    background: '#0f172a', color: 'white',
    cursor: 'pointer', display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center',
  },
};

export default ProductsPage;