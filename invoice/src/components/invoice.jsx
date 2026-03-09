import React from 'react';
import './invoice.css';

const Invoice = () => {
    return (
        <div className="invoice-wrapper">
            <div className="invoice-container">

                {/* Top Header Section */}
                <div className="invoice-header">
                    <div className="header-left">
                        <div className="logo-container">
                            {/* Imported Logo */}
                            <img src="../assets/cynox_logo.png" alt="Cynox Logo" className="invoice-logo" />
                        </div>

                        <div className="business-info">
                            <h2 className="business-name">business</h2>
                            <p className="business-number">
                                <strong>Business Number</strong> 324235346363
                            </p>
                            <p>hehe</p>
                            <p>hehe</p>
                            <p>111111</p>
                            <p>234567823267</p>
                            <p><a href="http://hehehehehehe.com" className="link">hehehehehehe.com</a></p>
                            <p><a href="mailto:name@business.com" className="link">name@business.com</a></p>
                        </div>
                    </div>

                    <div className="header-right">
                        <div className="meta-group">
                            <span className="meta-label">INVOICE</span>
                            <span className="meta-value">INV0001</span>
                        </div>
                        <div className="meta-group">
                            <span className="meta-label">DATE</span>
                            <span className="meta-value">Mar 9, 2026</span>
                        </div>
                        <div className="meta-group">
                            <span className="meta-label">DUE</span>
                            <span className="meta-value">On Receipt</span>
                        </div>
                        <div className="meta-group balance-due-top">
                            <span className="meta-label">BALANCE DUE</span>
                            <span className="meta-value">INR ₹232,576.82</span>
                        </div>
                    </div>
                </div>

                <div className="divider-full" />

                {/* Bill To Section */}
                <div className="bill-to-section">
                    <p className="section-label">BILL TO</p>
                    <h3 className="client-name">client</h3>
                    <p>hehe2</p>
                    <p>hoho</p>
                    <p>999999</p>
                    <p className="contact-line">
                        <span className="icon">📞</span> 1234567890
                    </p>
                    <p className="contact-line">
                        <span className="icon">📱</span> 123124243242
                    </p>
                    <p className="contact-line">
                        <span className="icon">📠</span> 23423423454
                    </p>
                    <p><a href="mailto:name@client.com" className="link">name@client.com</a></p>
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
                            <tr>
                                <td className="col-desc">
                                    <strong>hehehe</strong>
                                    <p className="item-desc">description</p>
                                </td>
                                <td className="col-rate">₹199,999.00</td>
                                <td className="col-qty">1</td>
                                <td className="col-amount">₹199,999.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Totals and Signature Section */}
                <div className="bottom-section">

                    <div className="totals-wrapper">
                        <div className="totals-table">
                            <div className="total-row">
                                <span className="total-label">SUBTOTAL</span>
                                <span className="total-value">₹199,999.00</span>
                            </div>
                            <div className="total-row">
                                <span className="total-label">DISCOUNT</span>
                                <span className="total-value">-₹2,900.00</span>
                            </div>
                            <div className="total-row">
                                <span className="total-label">TAX (18%)</span>
                                <span className="total-value">₹35,477.82</span>
                            </div>

                            <div className="divider-thin" />

                            <div className="total-row">
                                <span className="total-label">TOTAL</span>
                                <span className="total-value">₹232,576.82</span>
                            </div>

                            <div className="divider-thin" />

                            <div className="total-row balance-due-bottom">
                                <span className="total-label">BALANCE DUE</span>
                                <span className="total-value">INR ₹232,576.82</span>
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
                            <p className="signature-date">Mar 9, 2026</p>
                        </div>
                    </div>
                </div>

                <div className="footer-notes">
                    <p>hehehehehe</p>
                </div>

            </div>
        </div>
    );
};

export default Invoice;
