const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

/**
 * GET /api/invoices/next-number
 * Returns the next sequential invoice number.
 */
router.get('/next-number', async (req, res) => {
  try {
    // Fetch all invoice numbers to mathematically find the highest serial
    // (Alphabetical orderBy fails because 'INV-10' sorts before 'INV-2')
    const invoices = await prisma.invoice.findMany({
      select: { invoiceNumber: true }
    });

    let maxSerial = 0;

    for (const inv of invoices) {
      if (inv.invoiceNumber) {
        // Extract trailing digits (e.g. from "INV-001" or "INV0001")
        const match = inv.invoiceNumber.match(/(\d+)$/);
        if (match) {
          const serial = parseInt(match[1], 10);
          if (serial > maxSerial) {
            maxSerial = serial;
          }
        }
      }
    }

    const nextSerial = maxSerial + 1;
    // Format strictly as INV-XXX
    const nextNumber = `INV-${nextSerial.toString().padStart(3, '0')}`;

    return res.status(200).json({ nextNumber });
  } catch (err) {
    console.error('[Invoices] GET next-number error:', err);
    return res.status(500).json({ message: 'Failed to generate next invoice number.' });
  }
});

/**
 * POST /api/invoices
 * Saves an invoice to the database.
 */
router.post('/', async (req, res) => {
  try {
    const { meta, client, items, taxRate, discount } = req.body;

    if (!meta || !meta.invoiceNumber) {
      return res.status(400).json({ message: 'Invoice number is explicitly required to save.' });
    }

    // 0. Verify invoiceNumber uniqueness BEFORE transaction
    const existingInvoice = await prisma.invoice.findUnique({
      where: { invoiceNumber: meta.invoiceNumber }
    });
    if (existingInvoice) {
      return res.status(409).json({ message: `Invoice number ${meta.invoiceNumber} already exists. Please refresh to get the latest number.` });
    }

    if (!client || !client.id) {
      return res.status(400).json({ message: 'Customer ID is required.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invoice must contain at least one item.' });
    }

    // Get the first company (assuming single-tenant for now)
    const company = await prisma.company.findFirst();
    if (!company) {
      return res.status(400).json({ message: 'Company profile not found.' });
    }

    // Verify Customer actually exists to prevent Foreign Key Constraint errors
    const customerExists = await prisma.customer.findUnique({
      where: { id: client.id }
    });
    if (!customerExists) {
      return res.status(404).json({ message: `Customer ID ${client.id} not found in database.` });
    }

    // 1. Compute totals strictly on the backend
    let subtotal = 0;
    const formattedItems = items.map(item => {
      const q = Number(item.quantity) || 1;
      const rate = Number(item.rate) || 0;
      const lineTot = q * rate;
      subtotal += lineTot;
      
      return {
        serviceId: item.serviceId || null,
        serviceNameSnapshot: item.description || 'Custom Item',
        unitPrice: rate,
        quantity: q,
        gstRate: Number(item.gstRate) || 0,
        lineTotal: lineTot,
      };
    });

    const safeDiscount = Number(discount) || 0;
    const safeTaxRate = Number(taxRate) || 0;
    const taxAmount = (subtotal - safeDiscount) * (safeTaxRate / 100);
    const totalAmount = subtotal - safeDiscount + taxAmount;

    // Parse issue date
    let issueDate = new Date();
    if (meta?.date) {
      const parsedDate = new Date(meta.date);
      if (!isNaN(parsedDate)) {
        issueDate = parsedDate;
      }
    }

    // 2. Perform a Prisma Transaction
    const newInvoice = await prisma.$transaction(async (tx) => {
      // Build the core invoice record bridging the relationships and computed totals
      const createdInvoice = await tx.invoice.create({
        data: {
          invoiceNumber: meta?.invoiceNumber || `INV-${Date.now()}`,
          companyId: company.id,
          customerId: client.id,
          issueDate,
          subtotal,
          taxAmount,
          totalAmount,
          status: 'SENT',
          items: {
            // Prisma will beautifully execute separate inserts for each and bind the Foreign Key `invoiceId`
            create: formattedItems
          }
        },
        include: {
          items: true,
          company: true,
          customer: true
        }
      });
      return createdInvoice;
    });

    console.log(`[Invoices] Successfully saved Invoice ID: ${newInvoice.id} with ${newInvoice.items.length} items`);
    return res.status(201).json({ message: 'Invoice saved successfully', invoice: newInvoice });

  } catch (err) {
    console.error('[Invoices] POST /api/invoices transaction error:', err);
    return res.status(500).json({ message: 'Failed to save invoice.', error: err.message });
  }
});

/**
 * GET /api/invoices
 * Returns a list of all invoices.
 */
router.get('/', async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        customer: true,
        company: true,
        items: true,
      },
      orderBy: {
        issueDate: 'desc',
      },
    });

    return res.status(200).json({ invoices });
  } catch (err) {
    console.error('[Invoices] GET error:', err);
    return res.status(500).json({ message: 'Failed to fetch invoices.' });
  }
});

module.exports = router;
