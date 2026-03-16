import React from 'react';
import {
  LuPlus, LuTrash2, LuBuilding2, LuUser, LuCalendar, LuListChecks,
  LuCalculator, LuImage, LuUpload, LuGlobe, LuMail, LuPhone,
  LuMapPin, LuHash, LuChevronDown, LuPackage, LuCircleAlert,
  LuChevronRight,
} from 'react-icons/lu';
import { useApiData } from '@/hooks/useApiData';
import './InvoiceEditor.css';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const StyledSelect = ({ id, value, onChange, disabled, children, placeholder }) => (
  <div style={{ position: 'relative' }}>
    <select id={id} value={value} onChange={onChange} disabled={disabled} style={s.select}>
      {placeholder && <option value="">{placeholder}</option>}
      {children}
    </select>
    <LuChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }} />
  </div>
);

const FetchLoading = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 0', color: '#94a3b8', fontSize: 12 }}>
    <div style={s.spinner} /> Loading {label}…
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
    <div style={s.section}>
      <button style={s.sectionTrigger} onClick={() => setOpen(o => !o)}>
        <div style={s.sectionLeft}>
          <span style={s.sectionIcon}>{icon}</span>
          <span style={s.sectionTitle}>{title}</span>
          {badge != null && <span style={s.sectionBadge}>{badge}</span>}
        </div>
        <LuChevronRight
          size={14}
          color="#94a3b8"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0 }}
        />
      </button>
      {open && <div style={s.sectionBody}>{children}</div>}
    </div>
  );
};

const Label = ({ children, required }) => (
  <label style={s.label}>
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

  const { data: customersData, isLoading: customersLoading, error: customersError } = useApiData('/customers');
  const { data: servicesData, isLoading: servicesLoading, error: servicesError } = useApiData('/services');
  const { data: companyData, refetch: refetchCompany } = useApiData('/companies');

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
          logo: c.logo || prev.business.logo,
        }
      }));
    }
  }, [companyData, onChange]);

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
    <div style={s.editor}>

      {/* ── Header ── */}
      <div style={s.header}>
        <div style={s.headerIcon}><LuCalculator size={18} color="#fff" /></div>
        <div>
          <h2 style={s.headerTitle}>Invoice Editor</h2>
          <p style={s.headerSub}>Manage business, client and line items</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

        {/* ── Business Information ── */}
        <Section icon={<LuBuilding2 size={15} />} title="Business Information">
          {/* Logo */}
          <div
            style={s.logoUpload}
            onClick={() => document.getElementById('logo-input').click()}
          >
            {data.business.logo ? (
              <div style={{ position: 'relative' }}>
                <img src={data.business.logo} alt="Logo" style={s.logoImg} />
                <div style={s.logoOverlay}><LuUpload size={12} /> Change</div>
              </div>
            ) : (
              <div style={s.logoPlaceholder}>
                <LuImage size={20} color="#cbd5e1" />
                <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Upload Logo</span>
              </div>
            )}
            <input id="logo-input" type="file" accept="image/*" onChange={handleLogoUpload} hidden />
          </div>

          <button style={isSavingBusiness ? { ...s.btnOutline, opacity: 0.7 } : s.btnOutline} onClick={updateBusinessProfile} disabled={isSavingBusiness}>
            <LuUpload size={13} style={{ marginRight: 6 }} />
            {isSavingBusiness ? 'Saving…' : 'Update Business Profile'}
          </button>

          <div style={s.divider} />

          <Field label="Business Name">
            <input style={s.input} value={data.business.name} placeholder="Acme Corp"
              onChange={e => handleChange('business', 'name', e.target.value)} />
          </Field>
          <Field label="Tax Number / GSTIN">
            <input style={s.input} value={data.business.number} placeholder="29AAAAA0000A1Z5"
              onChange={e => handleChange('business', 'number', e.target.value)} />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Address Line 1">
              <input style={s.input} value={data.business.address1} placeholder="Street address"
                onChange={e => handleChange('business', 'address1', e.target.value)} />
            </Field>
            <Field label="Address Line 2">
              <input style={s.input} value={data.business.address2} placeholder="City, State"
                onChange={e => handleChange('business', 'address2', e.target.value)} />
            </Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Email Address">
              <div style={s.inputIconWrap}>
                <LuMail size={13} color="#94a3b8" style={s.inputIcon} />
                <input style={{ ...s.input, paddingLeft: 32 }} type="email" value={data.business.email}
                  onChange={e => handleChange('business', 'email', e.target.value)} />
              </div>
            </Field>
            <Field label="Website">
              <div style={s.inputIconWrap}>
                <LuGlobe size={13} color="#94a3b8" style={s.inputIcon} />
                <input style={{ ...s.input, paddingLeft: 32 }} value={data.business.website} placeholder="www.yoursite.com"
                  onChange={e => handleChange('business', 'website', e.target.value)} />
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
            <div style={s.clientCard}>
              <ClientRow icon={<LuMail size={13} />} label="Email" value={data.client.email || 'N/A'} />
              <ClientRow icon={<LuPhone size={13} />} label="Phone" value={`${data.client.phoneCountryCode} ${data.client.phoneNumber || 'N/A'}`} />
              <ClientRow icon={<LuMapPin size={13} />} label="Address" value={[data.client.street, data.client.city, data.client.state, data.client.pincode, data.client.country].filter(Boolean).join(', ') || 'N/A'} />
              <ClientRow icon={<LuHash size={13} />} label="GSTIN" value={data.client.gstNumber || 'N/A'} mono />
              <div style={s.clientFooter}>
                <div style={s.activePill}>
                  <span style={s.activeDot} /> Active Client
                </div>
              </div>
            </div>
          )}
        </Section>

        {/* ── Invoice Meta ── */}
        <Section icon={<LuCalendar size={15} />} title="Invoice Details">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <Field label="Invoice #">
              <input style={s.input} value={data.meta.invoiceNumber} placeholder="INV-001"
                onChange={e => handleChange('meta', 'invoiceNumber', e.target.value)} />
            </Field>
            <Field label="Date">
              <input style={s.input} value={data.meta.date}
                onChange={e => handleChange('meta', 'date', e.target.value)} />
            </Field>
            <Field label="Due Statement">
              <input style={s.input} value={data.meta.dueDate} placeholder="On Receipt"
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
              <div key={item.id} style={s.itemCard}>
                <div style={s.itemCardHeader}>
                  <span style={s.itemBadge}>ITEM #{index + 1}</span>
                  <button style={s.itemDeleteBtn} onClick={() => removeItem(item.id)}>
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
                    style={{ ...s.input, resize: 'vertical', minHeight: 60, lineHeight: 1.5 }}
                    value={item.longDescription}
                    placeholder="Optional notes or details…"
                    onChange={e => handleItemChange(item.id, 'longDescription', e.target.value)}
                  />
                </Field>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr', gap: 8 }}>
                  <Field label="Rate (₹)">
                    <input style={{ ...s.input, textAlign: 'right' }} type="number" value={item.rate}
                      onChange={e => handleItemChange(item.id, 'rate', parseFloat(e.target.value) || 0)} />
                  </Field>
                  <Field label="Qty">
                    <input style={{ ...s.input, textAlign: 'center' }} type="number" value={item.quantity}
                      onChange={e => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)} />
                  </Field>
                  <Field label="GST %">
                    <input style={{ ...s.input, textAlign: 'center' }} type="number" value={item.gstRate}
                      onChange={e => handleItemChange(item.id, 'gstRate', parseFloat(e.target.value) || 0)} />
                  </Field>
                  <Field label="Amount">
                    <div style={s.amountBox}>
                      ₹{(item.rate * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </Field>
                </div>

                {item.gstRate > 0 && (
                  <div style={{ textAlign: 'right', fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                    + ₹{((item.rate * item.quantity * item.gstRate) / 100).toLocaleString('en-IN')} GST ({item.gstRate}%)
                  </div>
                )}
              </div>
            ))}
          </div>

          <button style={s.addItemBtn} onClick={addItem}>
            <LuPlus size={14} style={{ marginRight: 6 }} /> Add Line Item
          </button>

          <div style={s.divider} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Global Tax Rate (%)">
              <input style={s.input} type="number" value={data.taxRate} placeholder="18"
                onChange={e => onChange(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))} />
            </Field>
            <Field label="Discount (₹)">
              <input style={s.input} type="number" value={data.discount} placeholder="0"
                onChange={e => onChange(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))} />
            </Field>
          </div>
        </Section>

        {/* ── Footer Notes ── */}
        <div style={s.section}>
          <div style={{ padding: '14px 16px 6px' }}>
            <Label>Footer / Payment Notes</Label>
          </div>
          <div style={{ padding: '0 16px 16px' }}>
            <textarea
              style={{ ...s.input, resize: 'vertical', minHeight: 80, lineHeight: 1.6 }}
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

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
  editor: {
    fontFamily: '"DM Sans", system-ui, sans-serif',
    color: '#0f172a',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    height: '100%',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '20px 16px 16px',
    borderBottom: '1px solid #e2e8f0',
    marginBottom: 8,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 9,
    background: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 800,
    letterSpacing: '-0.01em',
    margin: '0 0 2px',
    color: '#0f172a',
  },
  headerSub: {
    fontSize: 11,
    color: '#94a3b8',
    margin: 0,
    fontWeight: 500,
  },
  // Sections
  section: {
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    overflow: 'hidden',
    background: 'white',
  },
  sectionTrigger: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 14px',
    background: 'white',
    border: 'none',
    cursor: 'pointer',
    gap: 8,
  },
  sectionLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  sectionIcon: {
    display: 'flex',
    alignItems: 'center',
    color: '#475569',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#0f172a',
    letterSpacing: '-0.01em',
  },
  sectionBadge: {
    fontSize: 10,
    fontWeight: 700,
    background: '#f1f5f9',
    color: '#475569',
    border: '1px solid #e2e8f0',
    borderRadius: 20,
    padding: '1px 7px',
  },
  sectionBody: {
    padding: '4px 14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    borderTop: '1px solid #f1f5f9',
  },
  // Form elements
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: '#475569',
    letterSpacing: '0.01em',
  },
  input: {
    width: '100%',
    padding: '9px 11px',
    fontSize: 13,
    border: '1px solid #e2e8f0',
    borderRadius: 7,
    outline: 'none',
    color: '#0f172a',
    background: 'white',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  select: {
    width: '100%',
    padding: '9px 32px 9px 11px',
    fontSize: 13,
    border: '1px solid #e2e8f0',
    borderRadius: 7,
    outline: 'none',
    color: '#0f172a',
    background: 'white',
    cursor: 'pointer',
    appearance: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  inputIconWrap: { position: 'relative' },
  inputIcon: { position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' },
  divider: { height: 1, background: '#f1f5f9', margin: '4px 0' },
  // Logo
  logoUpload: {
    width: '100%',
    height: 80,
    border: '1px dashed #e2e8f0',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    background: '#f8fafc',
    overflow: 'hidden',
  },
  logoImg: {
    maxHeight: 64,
    maxWidth: '100%',
    objectFit: 'contain',
  },
  logoPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(15,23,42,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    color: 'white',
    fontSize: 11,
    fontWeight: 600,
    borderRadius: 4,
  },
  // Buttons
  btnOutline: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '9px 14px',
    fontSize: 12,
    fontWeight: 600,
    border: '1px solid #e2e8f0',
    borderRadius: 7,
    background: 'white',
    color: '#334155',
    cursor: 'pointer',
  },
  addItemBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '10px',
    fontSize: 13,
    fontWeight: 600,
    border: '1px dashed #cbd5e1',
    borderRadius: 8,
    background: '#f8fafc',
    color: '#475569',
    cursor: 'pointer',
  },
  // Client card
  clientCard: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: '4px 12px 0',
  },
  clientFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0 8px',
  },
  activePill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 10,
    fontWeight: 700,
    color: '#16a34a',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#22c55e',
    display: 'inline-block',
  },
  // Line items
  itemCard: {
    border: '1px solid #e2e8f0',
    borderRadius: 9,
    padding: '12px',
    background: 'white',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  itemCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemBadge: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: '#475569',
    background: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: 20,
    padding: '2px 9px',
  },
  itemDeleteBtn: {
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #fecaca',
    borderRadius: 7,
    background: '#fff5f5',
    color: '#dc2626',
    cursor: 'pointer',
  },
  amountBox: {
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 11px',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 7,
    fontSize: 13,
    fontWeight: 700,
    color: '#0f172a',
  },
  spinner: {
    width: 12,
    height: 12,
    border: '2px solid #e2e8f0',
    borderTop: '2px solid #94a3b8',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
};

export default InvoiceEditor;