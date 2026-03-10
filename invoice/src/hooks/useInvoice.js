import { useState } from 'react';
import { DEFAULT_INVOICE_DATA } from '../constants/invoiceDefaults';

/**
 * Custom hook to manage invoice state and logic
 */
export const useInvoice = () => {
    const [invoiceData, setInvoiceData] = useState(DEFAULT_INVOICE_DATA);

    // Any future business logic related to invoice data can go here
    // e.g., validation, complex transformations, syncing to local storage

    return [invoiceData, setInvoiceData];
};
