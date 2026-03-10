import React from 'react';
import InvoiceEditor from './components/InvoiceEditor/InvoiceEditor';
import InvoicePreview from './components/InvoicePreview/InvoicePreview';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <InvoiceEditor />
      <InvoicePreview />
    </div>
  );
}

export default App;
