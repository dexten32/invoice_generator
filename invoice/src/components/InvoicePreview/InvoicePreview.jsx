import React from 'react';
import Invoice from '../InvoiceDetails/invoice';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button, DownloadTrigger, FormatByte } from '@chakra-ui/react';
import { LuFileDown } from 'react-icons/lu';
import './InvoicePreview.css';

const InvoicePreview = () => {
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

    // Simulated size for the FormatByte component
    const pdfSize = 124500;

    return (
        <div className="invoice-preview">
            <div className="preview-header-wrapper">
                <div className="preview-header">
                    <h2 className="preview-heading">Preview</h2>
                    <DownloadTrigger
                        data={new Blob([""], { type: "application/pdf" })}
                        fileName="invoice.pdf"
                        mimeType="application/pdf"
                        asChild
                    >
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={downloadPDF}
                            className="gap-2 px-4 hover:bg-muted hover:text-foreground"
                            colorPalette="gray"
                            color="gray.700"
                            fontWeight="bold"

                        >
                            <LuFileDown size="18px" /> Download (
                            <FormatByte value={pdfSize} unitDisplay="narrow" />)
                        </Button>
                    </DownloadTrigger>
                </div>
            </div>
            <Invoice />
        </div>
    );
};

export default InvoicePreview;
