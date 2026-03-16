import React from 'react';
import {
  LuPlus, LuTrash2, LuBuilding2, LuUser, LuCalendar, LuListChecks,
  LuCalculator, LuImage, LuUpload, LuGlobe, LuMail, LuPhone,
  LuMapPin, LuHash, LuChevronDown, LuPackage, LuCircleAlert,
  LuChevronRight,
} from 'react-icons/lu';
import { useApiData } from '@/hooks/useApiData';
import defaultLogo from '@/assets/cynox_logo.png';
import './InvoiceEditor.css';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const StyledSelect = ({ id, value, onChange, disabled, children, placeholder }) => (
  <div style={{ position: 'relative' }}>
    <select id={id} value={value} onChange={onChange} disabled={disabled} className="ie-select">
      {placeholder && <option value="">{placeholder}</option>}
      {children}
    </select>
    <LuChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }} />
  </div>
);

const FetchLoading = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 0', color: '#94a3b8', fontSize: 12 }}>
    <div className="ie-spinner" /> Loading {label}…
  </div>
);

const FetchError = ({ message }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 0', color: '#ef4444', fontSize: 12 }}>
    <LuCircleAlert size={14} /> {message}
  </div>
);

// Collapsible section wrapper
const Section = ({ icon, title, badge, children, defaultOpen = false }) => {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="ie-section">
      <button className="ie-section-trigger" onClick={() => setOpen(o => !o)}>
        <div className="ie-section-left">
          <span className="ie-section-icon">{icon}</span>
          <span className="ie-section-title">{title}</span>
          {badge != null && <span className="ie-section-badge">{badge}</span>}
        </div>
        <LuChevronRight
          size={14}
          color="#94a3b8"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0 }}
        />
      </button>
      {open && <div className="ie-section-body">{children}</div>}
    </div>
  );
};

const Label = ({ children, required }) => (
  <label className="ie-label">
    {children}{required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
  </label>
);

const Field = ({ label, required, children, flex }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: flex ?? 'unset' }}>
    <Label required={required}>{label}</Label>
    {children}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const InvoiceEditor = ({ data, onChange }) => {
  if (!data) return null;

  const [isSavingBusiness, setIsSavingBusiness] = React.useState(false);
  const [isEditingBusiness, setIsEditingBusiness] = React.useState(false);

  const { data: customersData, isLoading: customersLoading, error: customersError } = useApiData('/customers');
  const { data: servicesData, isLoading: servicesLoading, error: servicesError } = useApiData('/services');
  const { data: companyData, refetch: refetchCompany } = useApiData('/companies');
  const { data: nextNumData } = useApiData('/invoices/next-number');

  React.useEffect(() => {
    if (companyData?.company) {
      const c = companyData.company;
      const [addr1, addr2] = (c.address || '').split('\n');
      onChange(prev => ({
        ...prev,
        business: {
          ...prev.business,
          name: c.companyName || prev.business.name,
          number: c.gstNumber || prev.business.number,
          address1: addr1 || prev.business.address1,
          address2: addr2 || prev.business.address2,
          logo: c.logo || prev.business.logo || defaultLogo,
          email: c.email || prev.business.email,
          website: c.website || prev.business.website,
        }
      }));
    }
  }, [companyData, onChange]);

  React.useEffect(() => {
    if (nextNumData?.nextNumber && !data.meta.invoiceNumber) {
      onChange(prev => ({
        ...prev,
        meta: {
          ...prev.meta,
          invoiceNumber: nextNumData.nextNumber
        }
      }));
    }
  }, [nextNumData, onChange, data.meta.invoiceNumber]);

  const updateBusinessProfile = async () => {
    setIsSavingBusiness(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:4000/api/companies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(data.business),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      refetchCompany();
    } catch (err) {
      console.error('Update error:', err);
    } finally {
      setIsSavingBusiness(false);
    }
  };

  const customers = customersData?.customers ?? [];
  const services = servicesData?.services ?? [];

  const handleChange = (section, field, value) =>
    onChange(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));

  const handleCustomerSelect = (e) => {
    const id = e.target.value;
    const customer = customers.find(c => c.id === id);
    if (!customer) {
      onChange(prev => ({ ...prev, client: { id: '', name: '', email: '', phoneCountryCode: '', phoneNumber: '', gstNumber: '', street: '', district: '', city: '', state: '', pincode: '', country: '' } }));
      return;
    }
    onChange(prev => ({
      ...prev,
      client: {
        id: customer.id, name: customer.name, email: customer.email ?? '',
        phoneCountryCode: customer.phoneCountryCode ?? '', phoneNumber: customer.phoneNumber ?? '',
        gstNumber: customer.gstNumber ?? '', street: customer.street ?? '',
        district: customer.district ?? '', city: customer.city ?? '',
        state: customer.state ?? '', pincode: customer.pincode ?? '', country: customer.country ?? '',
      },
    }));
  };

  const handleServiceSelect = (itemId, serviceId) => {
    const service = services.find(sv => sv.id === serviceId);
    onChange(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? { ...item, serviceId, description: service?.name ?? '', longDescription: service?.description ?? '', rate: service?.defaultPrice ?? 0, gstRate: service?.gstRate ?? 0 }
          : item
      ),
    }));
  };

  const handleItemChange = (id, field, value) =>
    onChange(prev => ({ ...prev, items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item) }));

  const addItem = () =>
    onChange(prev => ({ ...prev, items: [...prev.items, { id: Date.now(), serviceId: '', description: '', longDescription: '', rate: 0, quantity: 1, gstRate: 0 }] }));

  const removeItem = (id) =>
    onChange(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => handleChange('business', 'logo', reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="ie-editor">

      {/* ── Header ── */}
      <div className="ie-header">
        <div className="ie-header-icon"><LuCalculator size={18} color="#fff" /></div>
        <div>
          <h2 className="ie-header-title">Invoice Editor</h2>
          <p className="ie-header-sub">Manage business, client and line items</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

        {/* ── Business Information ── */}
        <Section icon={<LuBuilding2 size={15} />} title="Business Information">
          {/* Logo */}
          <div
            className="ie-logo-upload"
            onClick={() => isEditingBusiness && document.getElementById('logo-input').click()}
            style={{ cursor: isEditingBusiness ? 'pointer' : 'default', opacity: isEditingBusiness ? 1 : 0.8 }}
          >
            {data.business.logo || defaultLogo ? (
              <div style={{ position: 'relative' }}>
                <img src={data.business.logo || defaultLogo} alt="Logo" className="ie-logo-img" />
                {isEditingBusiness && <div className="ie-logo-overlay"><LuUpload size={12} /> Change</div>}
              </div>
            ) : (
              <div className="ie-logo-placeholder">
                <LuImage size={20} color="#cbd5e1" />
                <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                  {isEditingBusiness ? 'Upload Logo' : 'No Logo Provided'}
                </span>
              </div>
            )}
            <input id="logo-input" type="file" accept="image/*" onChange={handleLogoUpload} hidden disabled={!isEditingBusiness} />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {!isEditingBusiness ? (
              <button className="ie-btn-outline" onClick={() => setIsEditingBusiness(true)}>
                Edit Business Profile
              </button>
            ) : (
              <>
                <button
                  className="ie-btn-outline"
                  style={{ background: '#0f172a', color: 'white', border: 'none', opacity: isSavingBusiness ? 0.7 : 1 }}
                  onClick={async () => {
                    await updateBusinessProfile();
                    setIsEditingBusiness(false);
                  }}
                  disabled={isSavingBusiness}
                >
                  {isSavingBusiness ? 'Saving…' : 'Save Changes'}
                </button>
                <button className="ie-btn-outline" onClick={() => setIsEditingBusiness(false)} disabled={isSavingBusiness}>
                  Cancel
                </button>
              </>
            )}
          </div>

          <div className="ie-divider" />

          <Field label="Business Name">
            <input
              className="ie-input"
              value={data.business.name}
              placeholder="Acme Corp"
              readOnly={!isEditingBusiness}
              style={{ background: isEditingBusiness ? 'white' : '#f8fafc', color: isEditingBusiness ? '#0f172a' : '#64748b' }}
              onChange={e => handleChange('business', 'name', e.target.value)}
            />
          </Field>
          <Field label="Tax Number / GSTIN">
            <input
              className="ie-input"
              value={data.business.number}
              placeholder="29AAAAA0000A1Z5"
              readOnly={!isEditingBusiness}
              style={{ background: isEditingBusiness ? 'white' : '#f8fafc', color: isEditingBusiness ? '#0f172a' : '#64748b' }}
              onChange={e => handleChange('business', 'number', e.target.value)}
            />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Address Line 1">
              <input
                className="ie-input"
                value={data.business.address1}
                placeholder="Street address"
                readOnly={!isEditingBusiness}
                style={{ background: isEditingBusiness ? 'white' : '#f8fafc', color: isEditingBusiness ? '#0f172a' : '#64748b' }}
                onChange={e => handleChange('business', 'address1', e.target.value)}
              />
            </Field>
            <Field label="Address Line 2">
              <input
                className="ie-input"
                value={data.business.address2}
                placeholder="City, State"
                readOnly={!isEditingBusiness}
                style={{ background: isEditingBusiness ? 'white' : '#f8fafc', color: isEditingBusiness ? '#0f172a' : '#64748b' }}
                onChange={e => handleChange('business', 'address2', e.target.value)}
              />
            </Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Email Address">
              <div className="ie-input-icon-wrap">
                <LuMail size={13} color="#94a3b8" className="ie-input-icon" />
                <input
                  className="ie-input"
                  style={{
                    paddingLeft: 32,
                    background: isEditingBusiness ? 'white' : '#f8fafc',
                    color: isEditingBusiness ? '#0f172a' : '#64748b'
                  }}
                  type="email"
                  value={data.business.email}
                  readOnly={!isEditingBusiness}
                  onChange={e => handleChange('business', 'email', e.target.value)}
                />
              </div>
            </Field>
            <Field label="Website">
              <div className="ie-input-icon-wrap">
                <LuGlobe size={13} color="#94a3b8" className="ie-input-icon" />
                <input
                  className="ie-input"
                  style={{
                    paddingLeft: 32,
                    background: isEditingBusiness ? 'white' : '#f8fafc',
                    color: isEditingBusiness ? '#0f172a' : '#64748b'
                  }}
                  value={data.business.website}
                  placeholder="www.yoursite.com"
                  readOnly={!isEditingBusiness}
                  onChange={e => handleChange('business', 'website', e.target.value)}
                />
              </div>
            </Field>
          </div>
        </Section>

        {/* ── Client Information ── */}
        <Section icon={<LuUser size={15} />} title="Client Information">
          <Field label="Select Customer">
            {customersLoading && <FetchLoading label="customers" />}
            {customersError && <FetchError message="Cannot connect to backend. Start the server on port 4000." />}
            {!customersLoading && !customersError && (
              <StyledSelect
                id="customer-select"
                value={data.client?.id ?? ''}
                onChange={handleCustomerSelect}
                placeholder={customers.length === 0 ? '— No customers in database —' : '— Choose a customer —'}
              >
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </StyledSelect>
            )}
          </Field>

          {data.client?.name && (
            <div className="ie-client-card">
              <ClientRow icon={<LuMail size={13} />} label="Email" value={data.client.email || 'N/A'} />
              <ClientRow icon={<LuPhone size={13} />} label="Phone" value={`${data.client.phoneCountryCode} ${data.client.phoneNumber || 'N/A'}`} />
              <ClientRow icon={<LuMapPin size={13} />} label="Address" value={[data.client.street, data.client.city, data.client.state, data.client.pincode, data.client.country].filter(Boolean).join(', ') || 'N/A'} />
              <ClientRow icon={<LuHash size={13} />} label="GSTIN" value={data.client.gstNumber || 'N/A'} mono />
              <div className="ie-client-footer">
                <div className="ie-active-pill">
                  <span className="ie-active-dot" /> Active Client
                </div>
              </div>
            </div>
          )}
        </Section>

        {/* ── Invoice Meta ── */}
        <Section icon={<LuCalendar size={15} />} title="Invoice Details">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <Field label="Invoice #">
              <input
                className="ie-input"
                value={data.meta.invoiceNumber}
                placeholder="INV-001"
                readOnly
                style={{ background: '#f8fafc', color: '#64748b', cursor: 'default' }}
              />
            </Field>
            <Field label="Date">
              <input className="ie-input" value={data.meta.date}
                onChange={e => handleChange('meta', 'date', e.target.value)} />
            </Field>
            <Field label="Due Statement">
              <input className="ie-input" value={data.meta.dueDate} placeholder="On Receipt"
                onChange={e => handleChange('meta', 'dueDate', e.target.value)} />
            </Field>
          </div>
        </Section>

        {/* ── Line Items ── */}
        <Section icon={<LuListChecks size={15} />} title="Line Items" badge={data.items.length} defaultOpen>
          {servicesLoading && <FetchLoading label="services" />}
          {servicesError && <FetchError message="Cannot connect to backend. Start the server on port 4000." />}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.items.map((item, index) => (
              <div key={item.id} className="ie-item-card">
                <div className="ie-item-card-header">
                  <span className="ie-item-badge">ITEM #{index + 1}</span>
                  <button className="ie-item-delete-btn" onClick={() => removeItem(item.id)}>
                    <LuTrash2 size={13} />
                  </button>
                </div>

                <Field label="Service / Product">
                  <StyledSelect
                    id={`service-${item.id}`}
                    value={item.serviceId ?? ''}
                    onChange={e => handleServiceSelect(item.id, e.target.value)}
                    disabled={servicesLoading}
                    placeholder={servicesLoading ? 'Loading…' : services.length === 0 ? '— No services —' : '— Choose a service —'}
                  >
                    {services.map(sv => (
                      <option key={sv.id} value={sv.id}>
                        {sv.name} — ₹{Number(sv.defaultPrice).toLocaleString('en-IN')} ({sv.gstRate}% GST)
                      </option>
                    ))}
                  </StyledSelect>
                </Field>

                <Field label="Additional Notes">
                  <textarea
                    className="ie-input"
                    style={{ resize: 'vertical', minHeight: 60, lineHeight: 1.5 }}
                    value={item.longDescription}
                    placeholder="Optional notes or details…"
                    onChange={e => handleItemChange(item.id, 'longDescription', e.target.value)}
                  />
                </Field>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: 8 }}>
                  <Field label="Rate (₹)">
                    <input className="ie-input" style={{ textAlign: 'right', background: '#f8fafc', color: '#64748b', cursor: 'default' }} type="number" value={item.rate}
                      readOnly />
                  </Field>
                  <Field label="Qty">
                    <input className="ie-input" style={{ textAlign: 'center' }} type="number" value={item.quantity}
                      onChange={e => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)} />
                  </Field>
                  <Field label="Amount">
                    <div className="ie-amount-box">
                      ₹{(item.rate * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </Field>
                </div>

                {/* Removed per-item GST display as per user request */}

              </div>
            ))}
          </div>

          <button className="ie-add-item-btn" onClick={addItem}>
            <LuPlus size={14} style={{ marginRight: 6 }} /> Add Line Item
          </button>

          <div className="ie-divider" />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="GST (%)">
              <input className="ie-input" type="number" value={data.taxRate} placeholder="18"
                onChange={e => onChange(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))} />
            </Field>
            <Field label="Discount (₹)">
              <input className="ie-input" type="number" value={data.discount} placeholder="0"
                onChange={e => onChange(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))} />
            </Field>
          </div>
        </Section>

        {/* ── Footer Notes ── */}
        <div className="ie-section">
          <div style={{ padding: '14px 16px 6px' }}>
            <Label>Footer / Payment Notes</Label>
          </div>
          <div style={{ padding: '0 16px 16px' }}>
            <textarea
              className="ie-input"
              style={{ resize: 'vertical', minHeight: 80, lineHeight: 1.6 }}
              value={data.footerNotes}
              placeholder="e.g. Bank Account Details or Terms & Conditions"
              onChange={e => onChange(prev => ({ ...prev, footerNotes: e.target.value }))}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const ClientRow = ({ icon, label, value, mono }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
    <div style={{ width: 28, height: 28, borderRadius: 7, background: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#64748b', marginTop: 1 }}>
      {icon}
    </div>
    <div style={{ minWidth: 0 }}>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 2px' }}>{label}</p>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#334155', margin: 0, fontFamily: mono ? 'monospace' : 'inherit', wordBreak: 'break-word' }}>{value}</p>
    </div>
  </div>
);

export default InvoiceEditor;