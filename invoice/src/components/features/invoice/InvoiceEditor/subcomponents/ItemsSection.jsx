import React from 'react';
import { LuListChecks, LuTrash2, LuPlus } from 'react-icons/lu';
import { Section, Field, StyledSelect, FetchLoading, FetchError } from './EditorLayout';

const ItemsSection = ({
  data,
  servicesLoading,
  servicesError,
  services,
  handleServiceSelect,
  handleItemChange,
  addItem,
  removeItem,
  showToast,
  onChange
}) => {
  return (
    <Section icon={<LuListChecks size={15} />} title="Line Items" badge={data.items.length} defaultOpen>
      {servicesLoading && <FetchLoading label="services" />}
      {servicesError && <FetchError message="Cannot connect to backend. Start the server on port 4000." />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.items.map((item, index) => (
          <div key={item.id} className="ie-item-card">
            <div className="ie-item-card-header">
              <span className="ie-item-badge">ITEM #{index + 1}</span>
              {!data.isExisting && (
                <button className="ie-item-delete-btn" onClick={() => removeItem(item.id)}>
                  <LuTrash2 size={13} />
                </button>
              )}
            </div>

            <Field label="Service / Product">
              <StyledSelect
                id={`service-${item.id}`}
                value={item.serviceId ?? ''}
                onChange={e => handleServiceSelect(item.id, e.target.value)}
                disabled={servicesLoading || data.isExisting}
                placeholder={servicesLoading ? 'Loading…' : services.length === 0 ? '— No services —' : '— Choose a service —'}
              >
                {services.map(sv => (
                  <option key={sv.id} value={sv.id}>
                    {sv.name} — ₹{Number(sv.defaultPrice).toLocaleString('en-IN')} ({sv.gstRate}% GST)
                  </option>
                ))}
              </StyledSelect>
            </Field>

            <Field label="HSN / SAC">
              <input
                className="ie-input"
                style={{ background: data.isExisting ? '#f8fafc' : 'white', color: data.isExisting ? '#64748b' : '#0f172a' }}
                value={item.hsnSac || ''}
                readOnly={data.isExisting}
                placeholder="e.g. 9987 or 8517"
                onChange={e => handleItemChange(item.id, 'hsnSac', e.target.value)}
              />
            </Field>

            <Field label="Additional Notes">
              <textarea
                className="ie-input"
                style={{ resize: 'vertical', minHeight: 60, lineHeight: 1.5, background: data.isExisting ? '#f8fafc' : 'white', color: data.isExisting ? '#64748b' : '#0f172a' }}
                value={item.longDescription}
                readOnly={data.isExisting}
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
                <input className="ie-input" style={{ textAlign: 'center', background: data.isExisting ? '#f8fafc' : 'white', color: data.isExisting ? '#64748b' : '#0f172a' }}
                  type="number" value={item.quantity}
                  readOnly={data.isExisting}
                  min="1"
                  max="1000"
                  onChange={e => {
                    let val = parseFloat(e.target.value) || 0;
                    if (val > 1000) {
                      showToast("Value entered is too large and can't be proceeds with it");
                      val = 1000;
                    }
                    if (val < 0) val = 0; // Prevent negative quantity
                    handleItemChange(item.id, 'quantity', val);
                  }} />
                {item.quantity > 1000 && (
                  <div className="ie-error-msg">Limit Exceeded: 1000 Max</div>
                )}
              </Field>
              <Field label="Amount">
                <div className="ie-amount-box">
                  ₹{(item.rate * item.quantity).toLocaleString('en-IN')}
                </div>
              </Field>
            </div>
          </div>
        ))}
      </div>

      {!data.isExisting && (
        <button className="ie-add-item-btn" onClick={addItem}>
          <LuPlus size={14} style={{ marginRight: 6 }} /> Add Line Item
        </button>
      )}

      <div className="ie-divider" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Field label="GST (%)">
          <input className="ie-input" type="number" value={data.taxRate} placeholder="18"
            readOnly={data.isExisting}
            style={data.isExisting ? { background: '#f8fafc', color: '#64748b', cursor: 'default' } : {}}
            onChange={e => {
              const val = parseFloat(e.target.value) || 0;
              if (val > 100) {
                showToast("Value entered is too large and can't be proceeds with it");
                onChange(prev => ({ ...prev, taxRate: 18 }));
              } else {
                onChange(prev => ({ ...prev, taxRate: val }));
              }
            }} />
        </Field>
        <Field label="Discount (₹)">
          <input className="ie-input" type="number" value={data.discount} placeholder="0"
            readOnly={data.isExisting}
            style={data.isExisting ? { background: '#f8fafc', color: '#64748b', cursor: 'default' } : {}}
            onChange={e => {
              let val = parseFloat(e.target.value) || 0;
              const currentSubtotal = data.items.reduce((sum, item) => sum + (item.rate * item.quantity), 0);

              if (val > 10000000) {
                showToast("Value entered is too large and can't be proceeds with it");
                val = 0;
              }
              if (val > currentSubtotal) {
                showToast("Discount cannnot exceed subtotal value");
                val = currentSubtotal;
              }
              if (val < 0) val = 0;

              onChange(prev => ({ ...prev, discount: val }));
            }} />
        </Field>
      </div>
    </Section>
  );
};

export default ItemsSection;
