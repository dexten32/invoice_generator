const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

/**
 * GET /api/services
 * Returns all services ordered by name.
 */
router.get('/', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        defaultPrice: true,
        gstRate: true,
      },
    });
    // Convert Decimal fields to numbers for JSON serialization
    const serialized = services.map((s) => ({
      ...s,
      defaultPrice: Number(s.defaultPrice),
      gstRate: Number(s.gstRate),
    }));
    return res.status(200).json({ services: serialized });
  } catch (err) {
    console.error('[Services] GET error:', err);
    return res.status(500).json({ message: 'Failed to fetch services.' });
  }
});

/**
 * GET /api/services/:id
 * Returns a single service by ID.
 */
router.get('/:id', async (req, res) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: req.params.id },
    });
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }
    return res.status(200).json({
      service: {
        ...service,
        defaultPrice: Number(service.defaultPrice),
        gstRate: Number(service.gstRate),
      },
    });
  } catch (err) {
    console.error('[Services] GET /:id error:', err);
    return res.status(500).json({ message: 'Failed to fetch service.' });
  }
});

/**
 * POST /api/services
 * Creates a new service.
 */
router.post('/', async (req, res) => {
  const { name, price, description, category } = req.body;

  const parsedPrice = Number(price);
  if (!name || isNaN(parsedPrice) || parsedPrice <= 0) {
    return res.status(400).json({ message: 'Name and a valid positive price are required.' });
  }

  try {
    const service = await prisma.service.create({
      data: {
        name,
        defaultPrice: Math.round(parsedPrice * 100) / 100,
        description: description || '',
        category: category || 'Service',
        gstRate: 18, // Default GST rate for new services
      },
    });
    return res.status(201).json({
      service: {
        ...service,
        defaultPrice: Number(service.defaultPrice),
        gstRate: Number(service.gstRate),
      },
    });
  } catch (err) {
    console.error('[Services] POST error:', err);
    return res.status(500).json({ message: 'Failed to create service.' });
  }
});

/**
 * DELETE /api/services/:id
 * Deletes a service by ID.
 */
router.delete('/:id', async (req, res) => {
  try {
    await prisma.service.delete({
      where: { id: req.params.id },
    });
    return res.status(200).json({ message: 'Service deleted successfully.' });
  } catch (err) {
    console.error('[Services] DELETE error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Service not found.' });
    }
    return res.status(500).json({ message: 'Failed to delete service.' });
  }
});

module.exports = router;
