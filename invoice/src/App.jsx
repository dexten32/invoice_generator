import React from 'react'
import Invoice from './components/invoice'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <div className="editor-side">
        <h2>Invoice Editor</h2>
        <p>This space is reserved for editing the invoice details.</p>
      </div>
      <div className="preview-side">
        <Invoice />
      </div>
    </div>
  )
}

export default App
