import React from 'react';
import Invoice from '../InvoiceDetails/invoice';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { LuFileDown } from 'react-icons/lu';
import './InvoicePreview.css';

const InvoicePreview = ({ data, onReset }) => {
    const isReadyToExport = data?.client?.id && data?.items?.some(item => item.serviceId);
    const [isExporting, setIsExporting] = React.useState(false);
    
    const downloadPDF = async (e) => {
        if (e) e.preventDefault();
        
        setIsExporting(true);

        // Use setTimeout to ensure any button click animation/state updates
        // don't interfere with the DOM capture process.
        setTimeout(() => {
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
                
                // Format the filename to just the invoice number
                const invoiceNum = data?.meta?.invoiceNumber || 'Invoice';
                const fileName = `${invoiceNum}.pdf`;
                
                pdf.save(fileName);
                
                // Save the invoice to the backend to increment the numbering automatically
                fetch('http://localhost:4000/api/invoices', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
                    },
                    body: JSON.stringify(data)
                }).then(async (res) => {
                    if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.message || 'Failed to save invoice');
                    }
                    // Trigger the reset callback to clear details for a new invoice
                    if (onReset) onReset();
                }).catch(err => {
                    console.error('Error saving invoice:', err);
                    alert(`Failed to save invoice to database: ${err.message}`);
                })
                .finally(() => setIsExporting(false));
            });
        }, 100);
    };

    return (
        <div className="invoice-preview">
            <div className="preview-header-wrapper">
                <div className="preview-header">
                    <h2 className="preview-heading">Preview</h2>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadPDF}
                        disabled={!isReadyToExport || isExporting}
                        className={`gap-2 px-4 font-bold ${
                            isReadyToExport && !isExporting ? 'hover:bg-slate-100 text-slate-700 border-slate-200' : 'text-slate-400 border-slate-100 bg-slate-50 cursor-not-allowed'
                        }`}
                        title={!isReadyToExport ? "Select a client and at least one item to export" : "Export to PDF"}
                    >
                        <LuFileDown size="18px" /> {isExporting ? 'Exporting...' : 'Export PDF'}
                    </Button>
                </div>
            </div>
            <Invoice data={data} />
        </div>
    );
};

export default InvoicePreview;
