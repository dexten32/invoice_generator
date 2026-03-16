const express = require('express');
const prisma = require('../lib/prisma');
const fs = require('fs');
const path = require('path');

const router = express.Router();

/**
 * GET /api/companies
 * Gets the first company record (assuming single company for now).
 */
router.get('/', async (req, res) => {
  try {
    const company = await prisma.company.findFirst();
    return res.status(200).json({ company: company || null });

  } catch (err) {
    console.error('[Companies] GET error:', err);
    return res.status(500).json({ message: 'Failed to fetch company profile.' });
  }
});

/**
 * PUT /api/companies
 * Create or update the company profile.
 */
router.put('/', async (req, res) => {
  const { name, number, address1, address2, logo, email, website } = req.body;
  
  try {
    // If a new base64 logo is provided, save it to the physical file system
    // so it autoupdates the default logo.
    if (logo && logo.startsWith('data:image')) {
      const match = logo.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (match) {
        // match[1] is the extension, match[2] is the base64 data
        const base64Data = match[2];
        const buffer = Buffer.from(base64Data, 'base64');
        const frontendAssetPath = path.join(__dirname, '../../invoice/src/assets/cynox_logo.png');
        
        fs.writeFileSync(frontendAssetPath, buffer);
        console.log('[Companies] Saved new logo image to physical filesystem:', frontendAssetPath);
      }
    }


    // Attempt to update the first company found, or create one if none exists.
    const existing = await prisma.company.findFirst();
    
    let result;
    if (existing) {
      result = await prisma.company.update({
        where: { id: existing.id },
        data: {
          companyName: name,
          gstNumber: number,
          address: `${address1}\n${address2}`,
          logo,
          email,
          website,
        },
      });
    } else {
      result = await prisma.company.create({
        data: {
          companyName: name,
          gstNumber: number,
          address: `${address1}\n${address2}`,
          logo,
          email,
          website,
        },
      });
    }
    
    return res.status(200).json({ message: 'Profile updated successfully', company: result });
  } catch (err) {
    console.error('[Companies] PUT error:', err);
    return res.status(500).json({ message: 'Failed to update profile.' });
  }
});

module.exports = router;
