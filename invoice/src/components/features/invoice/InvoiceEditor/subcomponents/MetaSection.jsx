import React from 'react';
import { LuCalendar } from 'react-icons/lu';
import { Section, Field } from './EditorLayout';

const MetaSection = ({ data, handleChange }) => {
  return (
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
            readOnly={data.isExisting}
            style={data.isExisting ? { background: '#f8fafc', color: '#64748b', cursor: 'default' } : {}}
            onChange={e => handleChange('meta', 'date', e.target.value)} />
        </Field>
        <Field label="Due Statement">
          <input className="ie-input" value={data.meta.dueDate} placeholder="On Receipt"
            readOnly={data.isExisting}
            style={data.isExisting ? { background: '#f8fafc', color: '#64748b', cursor: 'default' } : {}}
            onChange={e => handleChange('meta', 'dueDate', e.target.value)} />
        </Field>
      </div>
    </Section>
  );
};

export default MetaSection;
