const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

/**
 * GET /api/invoices/next-number
 * Returns the next sequential invoice number.
 */
router.get('/next-number', async (req, res) => {
  try {
    // Find the latest invoice number
    // We sort by invoiceNumber descending and take the first one
    const latestInvoice = await prisma.invoice.findFirst({
      orderBy: {
        invoiceNumber: 'desc',
      },
    });

    let nextNumber = 'INV-001';

    if (latestInvoice && latestInvoice.invoiceNumber) {
      // Basic parser: INV-001 -> match "001"
      const match = latestInvoice.invoiceNumber.match(/(\d+)$/);
      if (match) {
        const currentSerial = parseInt(match[1], 10);
        const nextSerial = currentSerial + 1;
        // Pad to 3 digits (or more if needed)
        nextNumber = `INV-${nextSerial.toString().padStart(3, '0')}`;
      }
    }

    return res.status(200).json({ nextNumber });
  } catch (err) {
    console.error('[Invoices] GET next-number error:', err);
    return res.status(500).json({ message: 'Failed to generate next invoice number.' });
  }
});

module.exports = router;
