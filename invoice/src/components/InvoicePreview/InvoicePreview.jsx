import React from 'react';
import Invoice from '../InvoiceDetails/invoice';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './InvoicePreview.css';

const InvoicePreview = () => {
    const downloadPDF = () => {
        const input = document.querySelector('.invoice-container');
        if (!input) return;

        // Temporarily adjust styling for a cleaner PDF capture.
        const originalShadow = input.style.boxShadow;
        const originalBorder = input.style.border;
        input.style.boxShadow = 'none';
        input.style.border = 'none';

        html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
            // Restore styling
            input.style.boxShadow = originalShadow;
            input.style.border = originalBorder;

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('invoice.pdf');
        });
    };

    return (
        <div className="invoice-preview">
            <div className="preview-header">
                <h2 className="preview-heading">Preview</h2>
                <button className="icon-download-btn" onClick={downloadPDF} title="Download PDF">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                </button>
            </div>
            <Invoice />
        </div>
    );
};

export default InvoicePreview;
