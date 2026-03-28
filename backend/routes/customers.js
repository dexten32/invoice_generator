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
        phoneCountryCode: true,
        phoneNumber: true,
        gstNumber: true,
        street: true,
        district: true,
        city: true,
        state: true,
        pincode: true,
        country: true,
      },
    });
    return res.status(200).json({ customers });
  } catch (err) {
    console.error('Error fetching customers:', err);
    return res.status(500).json({ message: 'Failed to fetch customers.', error: err.message });
  }
});

// ... (GET /:id remains mostly unchanged, but will now return all fields)

/**
 * POST /api/customers
 * Creates a new customer.
 */
router.post('/', async (req, res) => {
  const { 
    name, email, 
    phoneCountryCode, phoneNumber, 
    gstNumber,
    street, district, city, state, pincode, country
  } = req.body;

  if (!name) return res.status(400).json({ message: 'Name is required.' });
  if (!gstNumber) return res.status(400).json({ message: 'GST Number is required.' });

  try {
    const customer = await prisma.customer.create({
      data: { 
        name, 
        email: email || null, 
        phoneCountryCode, 
        phoneNumber, 
        gstNumber,
        street, 
        district, 
        city, 
        state, 
        pincode, 
        country
      },
    });
    return res.status(201).json({ customer });
  } catch (err) {
    console.error('Error creating customer:', err);
    return res.status(500).json({ message: 'Failed to create customer.', error: err.message });
  }
});

/**
 * DELETE /api/customers/:id
 * Deletes a customer by ID.
 */
router.delete('/:id', async (req, res) => {
  try {
    await prisma.customer.delete({
      where: { id: req.params.id },
    });
    return res.status(200).json({ message: 'Customer deleted successfully.' });
  } catch (err) {
    console.error('[Customers] DELETE error:', err);
    // Handle case where customer doesn't exist
    if (err.code === 'P2025') {
        return res.status(404).json({ message: 'Customer not found.' });
    }
    return res.status(500).json({ message: 'Failed to delete customer.' });
  }
});

/**
 * PUT /api/customers/:id
 * Updates an existing customer by ID.
 */
router.put('/:id', async (req, res) => {
  const { 
    name, email, 
    phoneCountryCode, phoneNumber, 
    gstNumber,
    street, district, city, state, pincode, country
  } = req.body;

  if (!name) return res.status(400).json({ message: 'Name is required.' });
  if (!gstNumber) return res.status(400).json({ message: 'GST Number is required.' });

  try {
    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: { 
        name, 
        email: email || null, 
        phoneCountryCode, 
        phoneNumber, 
        gstNumber,
        street, 
        district, 
        city, 
        state, 
        pincode, 
        country
      },
    });
    return res.status(200).json({ customer });
  } catch (err) {
    console.error('[Customers] PUT error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Customer not found.' });
    }
    return res.status(500).json({ message: 'Failed to update customer.', error: err.message });
  }
});

module.exports = router;
