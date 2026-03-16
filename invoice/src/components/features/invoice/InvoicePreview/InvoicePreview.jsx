import React from 'react';
import Invoice from '../InvoiceDetails/invoice';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { LuFileDown } from 'react-icons/lu';
import './InvoicePreview.css';

const InvoicePreview = ({ data, onReset }) => {
    const isReadyToExport = data?.client?.id && data?.items?.some(item => item.serviceId);
    const downloadPDF = (e) => {
        if (e) e.preventDefault();

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
                
                // Format the filename: CompanyName-InvoiceNumber.pdf
                const clientName = data?.client?.name || 'Client';
                const invoiceNum = data?.meta?.invoiceNumber || 'Invoice';
                const safeClientName = clientName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                const fileName = `${safeClientName}-${invoiceNum}.pdf`;
                
                pdf.save(fileName);
                
                // Trigger the reset callback to clear details for a new invoice
                if (onReset) onReset();
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
                        disabled={!isReadyToExport}
                        className={`gap-2 px-4 font-bold ${
                            isReadyToExport ? 'hover:bg-slate-100 text-slate-700 border-slate-200' : 'text-slate-400 border-slate-100 bg-slate-50 cursor-not-allowed'
                        }`}
                        title={!isReadyToExport ? "Select a client and at least one item to export" : "Export to PDF"}
                    >
                        <LuFileDown size="18px" /> Export PDF
                    </Button>
                </div>
            </div>
            <Invoice data={data} />
        </div>
    );
};

export default InvoicePreview;
