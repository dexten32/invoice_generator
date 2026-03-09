import React from 'react';
import './invoice.css';

const Invoice = () => {
    return (
        <div className="invoice-wrapper">
            <div className="invoice-container">
                {/* Header */}
                <header className="invoice-header">
                    <div className="company-name">
                        <h2>Bajaj Tech</h2>
                    </div>
                    <div className="invoice-title">
                        <h1>INVOICE</h1>
                    </div>
                </header>

                <hr className="divider" />

                {/* Invoice Meta and Details */}
                <div className="invoice-details">
                    <div className="company-details">
                        <strong>From</strong>
                        <p>Bajaj Tech</p>
                    </div>

                    <div className="customer-details">
                        <strong>Bill To</strong>
                        <p>ABC Pvt Ltd</p>
                    </div>

                    <div className="invoice-meta">
                        <div className="meta-row">
                            <strong>Invoice #:</strong>
                            <span>INV-001</span>
                        </div>
                        <div className="meta-row">
                            <strong>Date:</strong>
                            <span>Today</span>
                        </div>
                    </div>
                </div>

                {/* Services Table */}
                <div className="services-section">
                    <table className="services-table">
                        <thead>
                            <tr>
                                <th className="text-left">Service</th>
                                <th className="text-center">Quantity</th>
                                <th className="text-right">Unit Price</th>
                                <th className="text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="text-left">Web Development</td>
                                <td className="text-center">1</td>
                                <td className="text-right">₹20000</td>
                                <td className="text-right">₹20000</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Total Section */}
                <div className="totals-section">
                    <div className="totals-row">
                        <span>Subtotal:</span>
                        <span>₹20000</span>
                    </div>
                    <div className="totals-row">
                        <span>GST (18%):</span>
                        <span>₹3600</span>
                    </div>
                    <div className="totals-row grand-total">
                        <span>Grand Total:</span>
                        <span>₹23600</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Invoice;
