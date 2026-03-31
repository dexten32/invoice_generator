import React from 'react';
import { LuCalculator } from 'react-icons/lu';
import { useApiData } from '@/hooks/useApiData';
import defaultLogo from '@/assets/cynox_logo.png';
import './InvoiceEditor.css';

// Subcomponents
import { Label } from './subcomponents/EditorLayout';
import BusinessSection from './subcomponents/BusinessSection';
import ClientSection from './subcomponents/ClientSection';
import MetaSection from './subcomponents/MetaSection';
import ItemsSection from './subcomponents/ItemsSection';

const InvoiceEditor = ({ data, onChange, showToast }) => {
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
          phone: c.phone || prev.business.phone || '',
          bankDetails: {
            bankName: c.bankName || prev.business.bankDetails?.bankName || '',
            accountNumber: c.accountNumber || prev.business.bankDetails?.accountNumber || '',
            ifscCode: c.ifscCode || prev.business.bankDetails?.ifscCode || '',
            location: c.bankLocation || prev.business.bankDetails?.location || '',
          },
          signature: {
            name: c.signatureName || prev.business.signature?.name || '',
            image: c.signatureImage || prev.business.signature?.image || '',
          }
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/companies`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(data.business),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      showToast('Business profile updated successfully!');
      refetchCompany();
      setIsEditingBusiness(false);
    } catch (err) {
      console.error('Update error:', err);
      showToast('Failed to update business profile.');
    } finally {
      setIsSavingBusiness(false);
    }
  };

  const customers = customersData?.customers ?? [];
  const services = servicesData?.services ?? [];

  const handleChange = (section, field, value) =>
    onChange(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));

  const handleNestedChange = (section, nestedField, field, value) => {
    onChange(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nestedField]: {
          ...prev[section][nestedField],
          [field]: value
        }
      }
    }));
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => handleNestedChange('business', 'signature', 'image', reader.result);
      reader.readAsDataURL(file);
    }
  };

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
          ? { 
              ...item, 
              serviceId, 
              description: service?.name ?? '', 
              longDescription: service?.description ?? '', 
              rate: service?.defaultPrice ?? 0, 
              gstRate: service?.gstRate ?? 0,
              hsnSac: service?.sac ?? ''
            }
          : item
      ),
    }));
  };

  const handleItemChange = (id, field, value) =>
    onChange(prev => ({ ...prev, items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item) }));

  const addItem = () =>
    onChange(prev => ({ ...prev, items: [...prev.items, { id: Date.now(), serviceId: '', description: '', longDescription: '', rate: 0, quantity: 1, gstRate: 0, hsnSac: '' }] }));

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

  return (
    <div className="ie-editor">
      <div className="ie-header">
        <div className="ie-header-icon"><LuCalculator size={18} color="#fff" /></div>
        <div>
          <h2 className="ie-header-title">Invoice Editor</h2>
          <p className="ie-header-sub">Manage business, client and line items</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <BusinessSection 
          data={data}
          isEditingBusiness={isEditingBusiness}
          setIsEditingBusiness={setIsEditingBusiness}
          isSavingBusiness={isSavingBusiness}
          updateBusinessProfile={updateBusinessProfile}
          handleLogoUpload={handleLogoUpload}
          handleSignatureUpload={handleSignatureUpload}
          handleChange={handleChange}
          handleNestedChange={handleNestedChange}
          defaultLogo={defaultLogo}
        />

        <ClientSection 
          data={data}
          customersLoading={customersLoading}
          customersError={customersError}
          customers={customers}
          handleCustomerSelect={handleCustomerSelect}
        />

        <MetaSection data={data} handleChange={handleChange} />

        <ItemsSection 
          data={data}
          servicesLoading={servicesLoading}
          servicesError={servicesError}
          services={services}
          handleServiceSelect={handleServiceSelect}
          handleItemChange={handleItemChange}
          addItem={addItem}
          removeItem={removeItem}
          showToast={showToast}
          onChange={onChange}
        />

        <div className="ie-section">
          <div style={{ padding: '14px 16px 6px' }}>
            <Label>Footer / Payment Notes</Label>
          </div>
          <div style={{ padding: '0 16px 16px' }}>
            <textarea
              className="ie-input"
              style={{ resize: 'vertical', minHeight: 80, lineHeight: 1.6, background: data.isExisting ? '#f8fafc' : 'white', color: data.isExisting ? '#64748b' : '#0f172a' }}
              value={data.footerNotes}
              readOnly={data.isExisting}
              placeholder="e.g. Bank Account Details or Terms & Conditions"
              onChange={e => onChange(prev => ({ ...prev, footerNotes: e.target.value }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceEditor;