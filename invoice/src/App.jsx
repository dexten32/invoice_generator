import React from 'react';
import InvoiceEditor from './components/InvoiceEditor';
import InvoicePreview from './components/InvoicePreview';
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
