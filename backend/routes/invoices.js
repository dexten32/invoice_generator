const express = require('express');
const prisma = require('../lib/prisma');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * GET /api/invoices/next-number
 * Returns the next sequential invoice number.
 */
router.get('/next-number', async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      select: { invoiceNumber: true }
    });

    let maxSerial = 0;
    for (const inv of invoices) {
      if (inv.invoiceNumber) {
        const match = inv.invoiceNumber.match(/(\d+)$/);
        if (match) {
          const serial = parseInt(match[1], 10);
          if (serial > maxSerial) maxSerial = serial;
        }
      }
    }

    const nextSerial = maxSerial + 1;
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
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { meta, client, items, taxRate, discount } = req.body;
    const userId = req.user.id;

    // ... (rest of the validation and computation logic remains same) ...
     if (!meta || !meta.invoiceNumber) {
      return res.status(400).json({ message: 'Invoice number is explicitly required to save.' });
    }

    const existingInvoice = await prisma.invoice.findUnique({
      where: { invoiceNumber: meta.invoiceNumber }
    });
    if (existingInvoice) {
      return res.status(409).json({ message: `Invoice number ${meta.invoiceNumber} already exists.` });
    }

    if (!client || !client.id) {
      return res.status(400).json({ message: 'Customer ID is required.' });
    }

    const company = await prisma.company.findFirst();
    if (!company) {
      return res.status(400).json({ message: 'Company profile not found.' });
    }

    const customerExists = await prisma.customer.findUnique({
      where: { id: client.id }
    });
    if (!customerExists) {
      return res.status(404).json({ message: `Customer ID ${client.id} not found.` });
    }

    let subtotal = 0;
    const formattedItems = items.map(item => {
      const q = Number(item.quantity) || 1;
      const rate = Number(item.rate) || 0;
      const lineTot = Math.round(q * rate * 100) / 100;
      subtotal += lineTot;
      return {
        serviceId: item.serviceId || null,
        serviceNameSnapshot: item.description || 'Custom Item',
        unitPrice: rate,
        quantity: q,
        gstRate: Number(item.gstRate) || 0,
        hsnSacSnapshot: item.hsnSac || null,
        lineTotal: lineTot,
      };
    });

    const safeDiscount = Number(discount) || 0;
    const safeTaxRate = Number(taxRate) || 0;
    
    // Final rounding before DB insertion
    const finalSubtotal = Math.round(subtotal * 100) / 100;
    const taxAmount = Math.round((finalSubtotal - safeDiscount) * (safeTaxRate / 100) * 100) / 100;
    const totalAmount = Math.round((finalSubtotal - safeDiscount + taxAmount) * 100) / 100;

    let issueDate = new Date();
    if (meta?.date) {
      const parsedDate = new Date(meta.date);
      if (!isNaN(parsedDate)) issueDate = parsedDate;
    }

    const newInvoice = await prisma.$transaction(async (tx) => {
      return await tx.invoice.create({
        data: {
          invoiceNumber: meta?.invoiceNumber,
          companyId: company.id,
          customerId: client.id,
          createdById: userId, // Link to the user who created it
          issueDate,
          subtotal: finalSubtotal,
          taxAmount,
          totalAmount,
          status: 'SENT',
          items: { create: formattedItems }
        },
        include: {
          items: true,
          company: true,
          customer: true,
          createdBy: {
            select: { id: true, name: true, email: true }
          }
        }
      });
    });

    return res.status(201).json({ message: 'Invoice saved successfully', invoice: newInvoice });
  } catch (err) {
    console.error('[Invoices] POST error:', err);
    return res.status(500).json({ message: 'Failed to save invoice.', error: err.message });
  }
});

/**
 * GET /api/invoices
 * Returns a list of all invoices with creator info.
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        customer: true,
        company: true,
        items: true,
        createdBy: {
          select: { id: true, name: true, email: true } // Include creator info
        }
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
