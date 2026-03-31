import React from 'react';
import Invoice from '../InvoiceDetails/invoice';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { LuFileDown, LuCircleAlert } from 'react-icons/lu';
import './InvoicePreview.css';

const InvoicePreview = ({ data, onReset, showToast }) => {
    const hasQuantityError = data?.items?.some(item => item.quantity > 1000);
    const isReadyToExport = data?.client?.id && data?.items?.some(item => item.serviceId) && !hasQuantityError;
    const [isExporting, setIsExporting] = React.useState(false);
    const [scale, setScale] = React.useState(1);
    const wrapperRef = React.useRef(null);

    // Calculate scale function to fit the fixed 850px invoice into the viewport
    const calculateScale = React.useCallback(() => {
        if (!wrapperRef.current) return;
        const width = wrapperRef.current.clientWidth;
        const padding = 32; // Horizontal padding
        const newScale = Math.min(1, (width - padding) / 850);
        setScale(newScale);
    }, []);

    React.useEffect(() => {
        calculateScale();
        window.addEventListener('resize', calculateScale);
        return () => window.removeEventListener('resize', calculateScale);
    }, [calculateScale]);

    const downloadPDF = async (e) => {
        if (e) e.preventDefault();
        
        setIsExporting(true);

        // Capture after slight delay to ensure UI stability
        setTimeout(() => {
            const input = document.querySelector('.invoice-container');
            if (!input) {
                setIsExporting(false);
                return;
            }

            // Temporarily reset any transforms that might interfere with html2canvas
            const originalTransform = input.style.transform;
            input.style.transform = 'none';

            html2canvas(input, { 
                scale: 3, // High scale for professional quality
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                width: 850,
                windowWidth: 850, // Force desktop-like rendering during capture
                scrollX: 0,
                scrollY: 0,
                onclone: (clonedDoc) => {
                    // Find the invoice-container in the cloned document
                    const clonedInput = clonedDoc.querySelector('.invoice-container');
                    const clonedWrapper = clonedDoc.querySelector('.preview-scale-wrapper');
                    
                    if (clonedInput) {
                        // Ensure it's full width and NOT scaled in the clone
                        clonedInput.style.width = '850px';
                        clonedInput.style.transform = 'none';
                        clonedInput.style.position = 'relative';
                        clonedInput.style.margin = '0';
                        clonedInput.style.boxShadow = 'none';
                        clonedInput.style.border = 'none';
                    }
                    if (clonedWrapper) {
                        // Remove transform and fixed width from wrapper in the clone
                        clonedWrapper.style.transform = 'none';
                        clonedWrapper.style.width = '850px';
                        clonedWrapper.style.minWidth = '850px';
                    }
                }
            }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                
                const invoiceNum = data?.meta?.invoiceNumber || 'Invoice';
                const fileName = `${invoiceNum}.pdf`;
                
                pdf.save(fileName);
                
                if (!data.isExisting) {
                    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/invoices`, {
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
                        if (onReset) onReset();
                    }).catch(err => {
                        console.error('Error saving invoice:', err);
                        if (showToast) showToast(`Error: ${err.message}`);
                    })
                    .finally(() => setIsExporting(false));
                } else {
                    setIsExporting(false);
                }
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
                        title={hasQuantityError ? "Quantity exceeds limit of 1000" : !isReadyToExport ? "Select a client and at least one item to export" : "Export to PDF"}
                    >
                        <LuFileDown size="18px" /> {isExporting ? 'Exporting...' : hasQuantityError ? 'Quantity too high' : 'Export PDF'}
                    </Button>
                </div>
                {hasQuantityError && (
                    <div style={{ marginTop: 8, padding: '8px 12px', background: '#fff1f2', border: '1px solid #fecaca', borderRadius: 8, color: '#e11d48', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <LuCircleAlert size={14} />
                        <span>Quantity exceeds limit of 1000 units.</span>
                    </div>
                )}
            </div>
            <div className="preview-content-outer" ref={wrapperRef}>
                <div 
                    className="preview-scale-wrapper" 
                    style={{ transform: `scale(${scale})` }}
                >
                    <Invoice data={data} />
                </div>
            </div>
        </div>
    );
};

export default InvoicePreview;
