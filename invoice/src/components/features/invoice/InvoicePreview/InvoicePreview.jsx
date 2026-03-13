import React from 'react';
import Invoice from '../InvoiceDetails/invoice';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { LuFileDown } from 'react-icons/lu';
import './InvoicePreview.css';

const InvoicePreview = ({ data }) => {
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
                pdf.save('invoice.pdf');
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
                        className="gap-2 px-4 hover:bg-slate-100 text-slate-700 font-bold border-slate-200"
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
