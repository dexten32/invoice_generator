import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InvoiceEditor from '../components/features/invoice/InvoiceEditor/InvoiceEditor';
import InvoicePreview from '../components/features/invoice/InvoicePreview/InvoicePreview';
import { useInvoice } from '../hooks/useInvoice';

const EditorPage = () => {
  const [invoiceData, setInvoiceData] = useInvoice();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle "Remake" functionality from Invoices Page
  React.useEffect(() => {
    if (location.state?.remakeData) {
      const data = location.state.remakeData;
      
      // Map database record to frontend state structure
      const mappedData = {
        business: invoiceData.business, // Keep current business profile
        client: {
          id: data.customer?.id || '',
          name: data.customer?.name || '',
          email: data.customer?.email || '',
          phoneCountryCode: data.customer?.phoneCountryCode || '',
          phoneNumber: data.customer?.phoneNumber || '',
          gstNumber: data.customer?.gstNumber || '',
          street: data.customer?.street || '',
          district: data.customer?.district || '',
          city: data.customer?.city || '',
          state: data.customer?.state || '',
          pincode: data.customer?.pincode || '',
          country: data.customer?.country || '',
        },
        meta: {
          invoiceNumber: data.invoiceNumber,
          date: new Date(data.issueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          dueDate: 'On Receipt' // Default or extracted if saved
        },
        items: data.items.map(item => ({
          id: item.id || Date.now() + Math.random(),
          serviceId: item.serviceId || '',
          description: item.serviceNameSnapshot,
          longDescription: '', // Not saved in DB currently
          rate: Number(item.unitPrice),
          quantity: item.quantity,
          gstRate: Number(item.gstRate),
        })),
        taxRate: Number(data.items[0]?.gstRate) || 18,
        discount: 0,
        footerNotes: 'Thank you for your business!'
      };

      setInvoiceData(mappedData);
      
      // Clear state so it doesn't re-trigger on navigation
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, setInvoiceData, navigate, location.pathname, invoiceData.business]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="w-full lg:w-1/2">
        <InvoiceEditor data={invoiceData} onChange={setInvoiceData} />
      </div>
      <div className="w-full lg:w-1/2 sticky top-8">
        <InvoicePreview data={invoiceData} onReset={() => {
            fetch('http://localhost:4000/api/invoices/next-number')
              .then(res => res.json())
              .then(resData => {
                  setInvoiceData(prev => ({
                      ...prev,
                      client: { id: '', name: '', address1: '', address2: '', phone: '', email: '', gstNumber: '' },
                      meta: { ...prev.meta, invoiceNumber: resData.nextNumber || '' },
                      items: [{ id: Date.now(), serviceId: '', description: '', longDescription: '', rate: 0, quantity: 1, gstRate: 0 }]
                  }));
              })
              .catch(err => console.error('Failed to refetch next invoice number:', err));
        }} />
      </div>
    </div>
  );
};

export default EditorPage;
