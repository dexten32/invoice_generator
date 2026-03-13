import React from 'react';
import InvoiceEditor from '../components/features/invoice/InvoiceEditor/InvoiceEditor';
import InvoicePreview from '../components/features/invoice/InvoicePreview/InvoicePreview';
import { useInvoice } from '../hooks/useInvoice';

const EditorPage = () => {
  const [invoiceData, setInvoiceData] = useInvoice();

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="w-full lg:w-3/5">
        <InvoiceEditor data={invoiceData} onChange={setInvoiceData} />
      </div>
      <div className="w-full lg:w-2/5 sticky top-8">
        <InvoicePreview data={invoiceData} />
      </div>
    </div>
  );
};

export default EditorPage;
