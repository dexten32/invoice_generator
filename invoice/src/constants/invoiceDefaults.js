export const DEFAULT_INVOICE_DATA = {
    business: {
        name: 'Cynox Security LLP',
        number: 'GSTINXXXXXXXXXXXX',
        address1: '123 Business Street',
        address2: 'City, State, Zip',
        email: 'contact@business.com',
        website: 'www.business.com',
        phone: '',
        logo: '/cynox_invoice_logo.svg',
        bankDetails: {
            bankName: '',
            accountNumber: '',
            ifscCode: '',
            location: '',
        },
        signature: {
            name: '',
            image: '',
        }
    },
    client: {
        id: '',
        name: 'Client Name',
        address1: '456 Client Ave',
        address2: 'City, State, Zip',
        phone: '9876543210',
        email: 'name@client.com',
        gstNumber: '',
    },
    meta: {
        invoiceNumber: '',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        dueDate: 'On Receipt'
    },
    items: [
        {
            id: Date.now(),
            serviceId: '',
            description: 'Sample Service',
            longDescription: 'Description of the service provided.',
            rate: 1000,
            quantity: 1,
            hsnSac: '',
            gstRate: 18,
        }
    ],
    taxRate: 18,
    discount: 0,
    footerNotes: 'All services are rendered based on the agreed scope; any additional work will be billed separately.\nThe client is responsible for providing timely access to systems, networks, and relevant information.\nAll fees are exclusive of taxes, which will be added as applicable and are the responsibility of the client.\nOwnership of all deliverables remains with Cynox Security LLP until full payment is received'
};

