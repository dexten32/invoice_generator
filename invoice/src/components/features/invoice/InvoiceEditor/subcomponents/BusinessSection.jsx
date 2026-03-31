import React from 'react';
import { LuBuilding2, LuPhone, LuMail, LuGlobe, LuImage, LuUpload } from 'react-icons/lu';
import { Section, Field } from './EditorLayout';

const BusinessSection = ({
  data,
  isEditingBusiness,
  setIsEditingBusiness,
  isSavingBusiness,
  updateBusinessProfile,
  handleLogoUpload,
  handleSignatureUpload,
  handleChange,
  handleNestedChange,
  defaultLogo
}) => {
  const isExisting = data.isExisting;

  return (
    <>
      <Section icon={<LuBuilding2 size={15} />} title="Business Information">
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

        <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
          {!isEditingBusiness ? (
            !isExisting && (
              <button className="ie-btn-outline" onClick={() => setIsEditingBusiness(true)}>
                Edit Business Profile
              </button>
            )
          ) : (
            <>
              <button
                className="ie-btn-outline"
                style={{ background: '#0f172a', color: 'white', border: 'none', opacity: isSavingBusiness ? 0.7 : 1 }}
                onClick={updateBusinessProfile}
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <Field label="Phone Number">
            <div className="ie-input-icon-wrap">
              <LuPhone size={13} color="#94a3b8" className="ie-input-icon" />
              <input
                className="ie-input"
                style={{
                  paddingLeft: 32,
                  background: isEditingBusiness ? 'white' : '#f8fafc',
                  color: isEditingBusiness ? '#0f172a' : '#64748b'
                }}
                value={data.business.phone}
                placeholder="+91 98765 43210"
                readOnly={!isEditingBusiness}
                onChange={e => handleChange('business', 'phone', e.target.value)}
              />
            </div>
          </Field>
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

        <div className="ie-divider" />
        <h3 className="ie-section-subtitle" style={{ fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 10 }}>Bank Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label="Bank Name">
            <input
              className="ie-input"
              value={data.business.bankDetails?.bankName || ''}
              placeholder="HDFC Bank"
              readOnly={!isEditingBusiness}
              style={{ background: isEditingBusiness ? 'white' : '#f8fafc', color: isEditingBusiness ? '#0f172a' : '#64748b' }}
              onChange={e => handleNestedChange('business', 'bankDetails', 'bankName', e.target.value)}
            />
          </Field>
          <Field label="Account Number">
            <input
              className="ie-input"
              value={data.business.bankDetails?.accountNumber || ''}
              placeholder="50100XXXXXXXXX"
              readOnly={!isEditingBusiness}
              style={{ background: isEditingBusiness ? 'white' : '#f8fafc', color: isEditingBusiness ? '#0f172a' : '#64748b' }}
              onChange={e => handleNestedChange('business', 'bankDetails', 'accountNumber', e.target.value)}
            />
          </Field>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label="IFSC Code">
            <input
              className="ie-input"
              value={data.business.bankDetails?.ifscCode || ''}
              placeholder="HDFC000XXXX"
              readOnly={!isEditingBusiness}
              style={{ background: isEditingBusiness ? 'white' : '#f8fafc', color: isEditingBusiness ? '#0f172a' : '#64748b' }}
              onChange={e => handleNestedChange('business', 'bankDetails', 'ifscCode', e.target.value)}
            />
          </Field>
          <Field label="Bank Location">
            <input
              className="ie-input"
              value={data.business.bankDetails?.location || ''}
              placeholder="Mumbai, India"
              readOnly={!isEditingBusiness}
              style={{ background: isEditingBusiness ? 'white' : '#f8fafc', color: isEditingBusiness ? '#0f172a' : '#64748b' }}
              onChange={e => handleNestedChange('business', 'bankDetails', 'location', e.target.value)}
            />
          </Field>
        </div>
      </Section>

      <Section icon={<LuImage size={15} />} title="Authorized Signature">
        <Field label="Signee Name">
          <input
            className="ie-input"
            value={data.business.signature?.name || ''}
            placeholder="e.g. Authorized Signatory Name"
            readOnly={!isEditingBusiness}
            style={{ background: isEditingBusiness ? 'white' : '#f8fafc', color: isEditingBusiness ? '#0f172a' : '#64748b' }}
            onChange={e => handleNestedChange('business', 'signature', 'name', e.target.value)}
          />
        </Field>

        <input
          id="signature-upload"
          type="file"
          accept="image/*"
          onChange={handleSignatureUpload}
          hidden
          disabled={!isEditingBusiness}
        />

        <div
           className="ie-logo-upload"
           style={{
             cursor: isEditingBusiness ? 'pointer' : 'default',
             opacity: isEditingBusiness ? 1 : 0.8,
             minHeight: 80,
             marginTop: 10
           }}
           onClick={() => isEditingBusiness && document.getElementById('signature-upload').click()}
        >
          {data.business.signature?.image ? (
            <div style={{ position: 'relative', textAlign: 'center' }}>
              <img src={data.business.signature.image} alt="Signature" style={{ maxHeight: 60, width: 'auto' }} />
              {isEditingBusiness && <div className="ie-logo-overlay"><LuUpload size={12} /> Change</div>}
            </div>
          ) : (
            <div className="ie-logo-placeholder">
              <LuImage size={20} color="#cbd5e1" />
              <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                {isEditingBusiness ? 'Upload Signature Image' : 'No Signature Provided'}
              </span>
            </div>
          )}
        </div>
        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, textAlign: 'center' }}>
          Authorized Signature
        </p>

        {isEditingBusiness && (
          <div style={{ display: 'flex', gap: 10, marginTop: 15, justifyContent: 'center' }}>
            <button
              className="ie-btn-outline"
              style={{ background: '#0f172a', color: 'white', border: 'none', opacity: isSavingBusiness ? 0.7 : 1 }}
              onClick={updateBusinessProfile}
              disabled={isSavingBusiness}
            >
              {isSavingBusiness ? 'Saving…' : 'Save Changes'}
            </button>
            <button className="ie-btn-outline" onClick={() => setIsEditingBusiness(false)} disabled={isSavingBusiness}>
              Cancel
            </button>
          </div>
        )}
      </Section>
    </>
  );
};

export default BusinessSection;
