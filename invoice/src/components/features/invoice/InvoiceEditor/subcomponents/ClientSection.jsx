import React from 'react';
import { LuUser, LuMail, LuPhone, LuMapPin, LuHash } from 'react-icons/lu';
import { Section, Field, StyledSelect, FetchLoading, FetchError } from './EditorLayout';

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

const ClientSection = ({
  data,
  customersLoading,
  customersError,
  customers,
  handleCustomerSelect
}) => {
  return (
    <Section icon={<LuUser size={15} />} title="Client Information">
      <Field label="Select Customer">
        {customersLoading && <FetchLoading label="customers" />}
        {customersError && <FetchError message="Cannot connect to backend. Start the server on port 4000." />}
        {!customersLoading && !customersError && (
          <StyledSelect
            id="customer-select"
            value={data.client?.id ?? ''}
            onChange={handleCustomerSelect}
            disabled={customersLoading || data.isExisting}
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
  );
};

export default ClientSection;
