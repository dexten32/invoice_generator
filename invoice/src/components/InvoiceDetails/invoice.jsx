import React from 'react';
import cynoxLogo from '../../assets/cynox_logo.png';
import './invoice.css';

const Invoice = ({ data }) => {
    if (!data) return null;

    const { business, client, meta, items, taxRate, discount, footerNotes } = data;

    // Dynamic calculations
    const subtotal = items.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
    const taxAmount = (subtotal - discount) * (taxRate / 100);
    const total = subtotal - discount + taxAmount;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="invoice-wrapper">
            <div className="invoice-container select-none">

                {/* Top Header Section */}
                <div className="invoice-header">
                    <div className="header-left">
                        <div className="logo-container">
                            {business.logo ? (
                                <img src={business.logo} alt="Logo" className="invoice-logo" />
                            ) : (
                                <div className="logo-placeholder">LOGO</div>
                            )}
                        </div>

                        <div className="business-info">
                            <h2 className="business-name">{business.name || 'Business Name'}</h2>
                            {business.number && (
                                <p className="business-number">
                                    <strong>Business Number</strong> {business.number}
                                </p>
                            )}
                            {business.address1 && <p>{business.address1}</p>}
                            {business.address2 && <p>{business.address2}</p>}
                            {business.phone && <p>{business.phone}</p>}
                            {business.email && <p><a href={`mailto:${business.email}`} className="link">{business.email}</a></p>}
                            {business.website && <p><a href={`http://${business.website}`} className="link">{business.website}</a></p>}
                        </div>
                    </div>

                    <div className="header-right">
                        <div className="meta-group">
                            <span className="meta-label">INVOICE</span>
                            <span className="meta-value">{meta.invoiceNumber}</span>
                        </div>
                        <div className="meta-group">
                            <span className="meta-label">DATE</span>
                            <span className="meta-value">{meta.date}</span>
                        </div>
                        <div className="meta-group">
                            <span className="meta-label">DUE</span>
                            <span className="meta-value">{meta.dueDate}</span>
                        </div>
                        <div className="meta-group balance-due-top">
                            <span className="meta-label">BALANCE DUE</span>
                            <span className="meta-value">{formatCurrency(total)}</span>
                        </div>
                    </div>
                </div>

                <div className="divider-full" />

                {/* Bill To Section */}
                <div className="bill-to-section">
                    <p className="section-label">BILL TO</p>
                    <h3 className="client-name">{client.name || 'Client Name'}</h3>
                    {client.address1 && <p>{client.address1}</p>}
                    {client.address2 && <p>{client.address2}</p>}
                    {client.phone && (
                        <p className="contact-line">
                            <span className="icon">📞</span> {client.phone}
                        </p>
                    )}
                    {client.email && <p><a href={`mailto:${client.email}`} className="link">{client.email}</a></p>}
                </div>

                {/* Services Table */}
                <div className="table-container">
                    <table className="items-table">
                        <thead>
                            <tr>
                                <th className="col-desc">DESCRIPTION</th>
                                <th className="col-rate">RATE</th>
                                <th className="col-qty">QTY</th>
                                <th className="col-amount">AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td className="col-desc">
                                        <strong>{item.description}</strong>
                                        {item.longDescription && <p className="item-desc">{item.longDescription}</p>}
                                    </td>
                                    <td className="col-rate">{formatCurrency(item.rate)}</td>
                                    <td className="col-qty">{item.quantity}</td>
                                    <td className="col-amount">{formatCurrency(item.rate * item.quantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals and Signature Section */}
                <div className="bottom-section">

                    <div className="totals-wrapper">
                        <div className="totals-table">
                            <div className="total-row">
                                <span className="total-label">SUBTOTAL</span>
                                <span className="total-value">{formatCurrency(subtotal)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="total-row">
                                    <span className="total-label">DISCOUNT</span>
                                    <span className="total-value">-{formatCurrency(discount)}</span>
                                </div>
                            )}
                            <div className="total-row">
                                <span className="total-label">TAX ({taxRate}%)</span>
                                <span className="total-value">{formatCurrency(taxAmount)}</span>
                            </div>

                            <div className="divider-thin" />

                            <div className="total-row">
                                <span className="total-label">TOTAL</span>
                                <span className="total-value">{formatCurrency(total)}</span>
                            </div>

                            <div className="divider-thin" />

                            <div className="total-row balance-due-bottom">
                                <span className="total-label">BALANCE DUE</span>
                                <span className="total-value">{formatCurrency(total)}</span>
                            </div>
                        </div>

                        <div className="signature-section">
                            <div className="signature-image">
                                <svg viewBox="0 0 200 60" className="signature-svg">
                                    {/* Simulate a signature matching the "Harsh" one in the image */}
                                    <path d="M20,40 Q30,15 45,40 T65,35" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                                    <path d="M25,25 Q45,25 60,25" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                                    <path d="M60,40 Q70,30 80,40 T95,35" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                                    <path d="M90,38 Q100,28 110,38" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                                    <path d="M110,40 Q130,28 140,42 Q150,28 160,38" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div className="signature-line" />
                            <p className="signature-label">DATE SIGNED</p>
                            <p className="signature-date">{meta.date}</p>
                        </div>
                    </div>
                </div>

                <div className="footer-notes">
                    <p>{footerNotes}</p>
                </div>

            </div>
        </div>
    );
};

export default Invoice;
