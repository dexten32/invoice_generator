import React, { useState } from 'react';
import InvoiceEditor from './components/InvoiceEditor/InvoiceEditor';
import InvoicePreview from './components/InvoicePreview/InvoicePreview';
import './App.css';

function App() {
  const [invoiceData, setInvoiceData] = useState({
    business: {
      name: 'Your Business Name',
      number: 'GSTINXXXXXXXXXXXX',
      address1: '123 Business Street',
      address2: 'City, State, Zip',
      email: 'contact@business.com',
      website: 'www.business.com',
      logo: null,
    },
    client: {
      name: 'Client Name',
      address1: '456 Client Ave',
      address2: 'City, State, Zip',
      phone: '9876543210',
      email: 'name@client.com'
    },
    meta: {
      invoiceNumber: 'INV0001',
      date: 'Mar 10, 2026',
      dueDate: 'On Receipt'
    },
    items: [
      { id: Date.now(), description: 'Sample Service', longDescription: 'Description of the service provided.', rate: 1000, quantity: 1 }
    ],
    taxRate: 18,
    discount: 0,
    footerNotes: 'Thank you for your business!'
  });

  return (
    <div className="app-container">
      <InvoiceEditor data={invoiceData} onChange={setInvoiceData} />
      <InvoicePreview data={invoiceData} />
    </div>
  );
}

export default App;
