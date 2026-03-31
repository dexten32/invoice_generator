const express = require('express');
const invoiceService = require('../services/invoiceService');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * GET /api/invoices/next-number
 * Returns the next sequential invoice number.
 */
router.get('/next-number', async (req, res) => {
  try {
    const nextNumber = await invoiceService.getNextInvoiceNumber();
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
    const newInvoice = await invoiceService.createInvoice(req.body, req.user.id);
    return res.status(201).json({ message: 'Invoice saved successfully', invoice: newInvoice });
  } catch (err) {
    console.error('[Invoices] POST error:', err.message);
    const status = err.message.includes('not found') ? 404 : 400;
    return res.status(status).json({ message: err.message });
  }
});

/**
 * GET /api/invoices
 * Returns a list of all invoices with creator info.
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const invoices = await invoiceService.getAllInvoices();
    return res.status(200).json({ invoices });
  } catch (err) {
    console.error('[Invoices] GET error:', err);
    return res.status(500).json({ message: 'Failed to fetch invoices.' });
  }
});

module.exports = router;

