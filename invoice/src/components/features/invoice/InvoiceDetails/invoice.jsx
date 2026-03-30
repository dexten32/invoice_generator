import React from 'react';
import cynoxLogo from '../../../../assets/cynox_logo.png';
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

    const toWords = (amount) => {
        const single = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const double = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        const formatNumber = (num) => {
            if (num === 0) return '';
            if (num < 10) return single[num];
            if (num < 20) return double[num - 10];
            if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + single[num % 10] : '');
            if (num < 1000) return single[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' and ' + formatNumber(num % 100) : '');
            return '';
        };

        const convert = (num) => {
            if (num === 0) return 'Zero';
            let res = '';
            if (num >= 10000000) {
                res += formatNumber(Math.floor(num / 10000000)) + ' Crore ';
                num %= 10000000;
            }
            if (num >= 100000) {
                res += formatNumber(Math.floor(num / 100000)) + ' Lakh ';
                num %= 100000;
            }
            if (num >= 1000) {
                res += formatNumber(Math.floor(num / 1000)) + ' Thousand ';
                num %= 1000;
            }
            res += formatNumber(num);
            return res.trim();
        };

        const integerPart = Math.floor(amount);
        const fractionalPart = Math.round((amount - integerPart) * 100);

        let words = convert(integerPart) + ' Rupees';
        if (fractionalPart > 0) {
            words += ' and ' + convert(fractionalPart) + ' Paise';
        }
        return words + ' Only';
    };

    return (
        <div className="invoice-wrapper">
            <div className="invoice-container select-none">


                {/* Header Row: Logo Top Left, "TAX INVOICE" & Invoice # Top Right */}
                <div className="invoice-header-row">
                    <div className="logo-container">
                        <img src="/cynox_invoice_logo.svg" alt="Cynox Security" className="invoice-logo" />
                    </div>
                    <div className="header-meta-right">
                        <div className="tax-invoice-label">TAX INVOICE</div>
                        <div className="invoice-num-inline">
                            <span className="label">Invoice #</span>
                            <span className="value">{meta.invoiceNumber}</span>
                        </div>
                        {/* <div className="balance-due-header">
                            <div className="balance-label">Balance Due</div>
                            <span className="balance-value">{formatCurrency(total)}</span>
                        </div> */}
                    </div>
                </div>

                {/* Business Info Row: Company Address Left */}
                <div className="business-meta-row">
                    <div className="business-address-block">
                        <h2 className="business-name-header">{business.name || 'Cynox Security'}</h2>

                        {business.address1 && <p>{business.address1}</p>}
                        {business.address2 && <p>{business.address2}</p>}
                        {business.number && <p><strong>GSTIN:</strong> {business.number}</p>}
                        {business.phone && <p>{business.phone}</p>}
                        {business.email && <p>{business.email}</p>}
                        {business.website && <p>{business.website}</p>}
                    </div>
                </div>

                {/* <div className="divider-full" /> */}

                {/* Client / Shipping / Metadata Grid Section */}
                <div className="client-meta-section">
                    <div className="client-left-blocks">
                        <div className="address-block">
                            <p className="block-label">Bill To</p>
                            <h3 className="client-name-bold">{client.name || 'Client Name'}</h3>
                            <p className="client-detail-text">
                                {[client.street, client.district, client.city, client.state, client.pincode, client.country].filter(Boolean).join(', ') || 'Address not provided'}
                            </p>
                            {client.gstNumber && <p className="client-detail-text"><strong>GST:</strong> {client.gstNumber}</p>}
                        </div>

                        <div className="address-block">
                            <p className="block-label">Ship To</p>
                            <h3 className="client-name-bold">{client.name || 'Client Name'}</h3>
                            <p className="client-detail-text">
                                {[client.street, client.district, client.city, client.state, client.pincode, client.country].filter(Boolean).join(', ') || 'Address not provided'}
                            </p>
                        </div>
                    </div>

                    <div className="client-right-metadata">
                        <div className="meta-grid">
                            <div className="meta-row">
                                <span className="meta-label">Invoice Date</span>
                                <span className="meta-value">{meta.date}</span>
                            </div>
                            <div className="meta-row">
                                <span className="meta-label">Terms</span>
                                <span className="meta-value">{meta.terms || 'On Receipt'}</span>
                            </div>
                            <div className="meta-row">
                                <span className="meta-label">Due Date</span>
                                <span className="meta-value">{meta.date}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services Table */}
                <div className="table-container">
                    <table className="items-table">
                        <thead>
                            <tr>
                                <th className="col-id">ID</th>
                                <th className="col-item">ITEM NAME & DESCRIPTION</th>
                                <th className="col-hsn">HSN/SAC</th>
                                <th className="col-qty">QTY</th>
                                <th className="col-rate">RATE</th>
                                <th className="col-amount">AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="col-id">{index + 1}</td>
                                    <td className="col-item">
                                        <span className="item-name">{item.description}</span>
                                        {item.longDescription && <p className="item-desc">{item.longDescription}</p>}
                                    </td>
                                    <td className="col-hsn">{item.hsnSac || '—'}</td>
                                    <td className="col-qty">{item.quantity}</td>
                                    <td className="col-rate">{formatCurrency(item.rate)}</td>
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

                            <div className="total-in-words">
                                <span className="words-label">Amount in Words:</span>
                                <span className="words-value">{toWords(total)}</span>
                            </div>
                        </div>

                        {/* <div className="signature-section">
                            <div className="signature-image">
                                <svg viewBox="0 0 200 60" className="signature-svg">
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
                        </div> */}
                    </div>
                </div>

                <div className="thank-you-section">
                    <p className="thank-you-text">Thanks for your business</p>
                </div>

                <div className="invoice-footer-bottom">
                    <div className="bank-details-section">
                        <h4 className="footer-section-title">CYNOX SECURITY LLP</h4>
                        {business.bankDetails ? (
                            <div className="bank-details-grid">
                                <div className="bank-row">
                                    <span className="bank-label">Bank Name:</span>
                                    <span className="bank-value">{business.bankDetails.bankName || 'N/A'}</span>
                                </div>
                                <div className="bank-row">
                                    <span className="bank-label">Account No:</span>
                                    <span className="bank-value">{business.bankDetails.accountNumber || 'N/A'}</span>
                                </div>
                                <div className="bank-row">
                                    <span className="bank-label">IFSC Code:</span>
                                    <span className="bank-value">{business.bankDetails.ifscCode || 'N/A'}</span>
                                </div>
                                <div className="bank-row">
                                    <span className="bank-label">Location:</span>
                                    <span className="bank-value">{business.bankDetails.location || 'N/A'}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="no-data-text">Bank details not provided</p>
                        )}
                    </div>

                    <div className="signature-section-new">
                        {business.signature?.image && (
                            <div className="signature-image-wrapper">
                                <img src={business.signature.image} alt="Signature" className="signature-img" />
                            </div>
                        )}
                        <div className="signature-line-new" />
                        <p className="signature-name-new">{business.signature?.name || 'Authorized Signatory'}</p>
                        <p className="signature-label-new">Authorized Signature</p>
                    </div>
                </div>

                <div className="footer-notes">
                    <h4 className="footer-section-title">Terms & Conditions</h4>
                    <p className="terms-text">{footerNotes}</p>
                </div>

            </div>
        </div >
    );
};

export default Invoice;
