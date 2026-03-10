import React from 'react';
import InvoiceEditor from './components/InvoiceEditor/InvoiceEditor';
import InvoicePreview from './components/InvoicePreview/InvoicePreview';
import { useInvoice } from './hooks/useInvoice';
import './App.css';

function App() {
  const [invoiceData, setInvoiceData] = useInvoice();

  return (
    <div className="app-container">
      <InvoiceEditor data={invoiceData} onChange={setInvoiceData} />
      <InvoicePreview data={invoiceData} />
    </div>
  );
}

export default App;
