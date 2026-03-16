import React from 'react';
import InvoiceEditor from '../components/features/invoice/InvoiceEditor/InvoiceEditor';
import InvoicePreview from '../components/features/invoice/InvoicePreview/InvoicePreview';
import { useInvoice } from '../hooks/useInvoice';

const EditorPage = () => {
  const [invoiceData, setInvoiceData] = useInvoice();

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="w-full lg:w-1/2">
        <InvoiceEditor data={invoiceData} onChange={setInvoiceData} />
      </div>
      <div className="w-full lg:w-1/2 sticky top-8">
        <InvoicePreview data={invoiceData} onReset={() => setInvoiceData({
            ...invoiceData,
            client: { id: '', name: '', address1: '', address2: '', phone: '', email: '', gstNumber: '' },
            meta: { ...invoiceData.meta, invoiceNumber: '' }, // This forces a refetch of the next invoice number
            items: [{ id: Date.now(), serviceId: '', description: '', longDescription: '', rate: 0, quantity: 1, gstRate: 0 }]
        })} />
      </div>
    </div>
  );
};

export default EditorPage;
