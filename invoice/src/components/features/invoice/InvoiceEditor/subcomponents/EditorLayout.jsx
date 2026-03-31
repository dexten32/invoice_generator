import React from 'react';
import { LuChevronDown, LuChevronRight, LuCircleAlert } from 'react-icons/lu';

export const StyledSelect = ({ id, value, onChange, disabled, children, placeholder }) => (
  <div style={{ position: 'relative' }}>
    <select id={id} value={value} onChange={onChange} disabled={disabled} className="ie-select">
      {placeholder && <option value="">{placeholder}</option>}
      {children}
    </select>
    <LuChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }} />
  </div>
);

export const FetchLoading = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 0', color: '#94a3b8', fontSize: 12 }}>
    <div className="ie-spinner" /> Loading {label}…
  </div>
);

export const FetchError = ({ message }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 0', color: '#ef4444', fontSize: 12 }}>
    <LuCircleAlert size={14} /> {message}
  </div>
);

// Collapsible section wrapper
export const Section = ({ icon, title, badge, children, defaultOpen = false }) => {
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

export const Label = ({ children, required }) => (
  <label className="ie-label">
    {children}{required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
  </label>
);

export const Field = ({ label, required, children, flex }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: flex ?? 'unset' }}>
    <Label required={required}>{label}</Label>
    {children}
  </div>
);
