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

module.exports = router;
