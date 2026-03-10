export const DEFAULT_INVOICE_DATA = {
    business: {
        name: 'Your Business Name',
        number: 'GSTINXXXXXXXXXXXX',
        address1: '123 Business Street',
        address2: 'City, State, Zip',
        email: 'contact@business.com',
        website: 'www.business.com',
        logo: null,
    },
    client: {
        name: 'Client Name',
        address1: '456 Client Ave',
        address2: 'City, State, Zip',
        phone: '9876543210',
        email: 'name@client.com'
    },
    meta: {
        invoiceNumber: 'INV0001',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        dueDate: 'On Receipt'
    },
    items: [
        {
            id: Date.now(),
            description: 'Sample Service',
            longDescription: 'Description of the service provided.',
            rate: 1000,
            quantity: 1
        }
    ],
    taxRate: 18,
    discount: 0,
    footerNotes: 'Thank you for your business!'
};
