const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

/**
 * GET /api/customers
 * Returns all customers ordered by name.
 */
router.get('/', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        gstNumber: true,
      },
    });
    return res.status(200).json({ customers });
  } catch (err) {
    console.error('[Customers] GET error:', err);
    return res.status(500).json({ message: 'Failed to fetch customers.' });
  }
});

/**
 * GET /api/customers/:id
 * Returns a single customer by ID.
 */
router.get('/:id', async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id },
    });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }
    return res.status(200).json({ customer });
  } catch (err) {
    console.error('[Customers] GET /:id error:', err);
    return res.status(500).json({ message: 'Failed to fetch customer.' });
  }
});

module.exports = router;
