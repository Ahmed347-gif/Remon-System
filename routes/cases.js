const express = require('express');
const router = express.Router();
const Case = require('../models/Case');
const Client = require('../models/Client');

// GET /cases - List all cases with client name
router.get('/', async (req, res) => {
  try {
    const cases = await Case.find()
      .populate('clientId', 'name phone email')
      .sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /cases - Add a new case
router.post('/', async (req, res) => {
  try {
    // Verify client exists
    const client = await Client.findById(req.body.clientId);
    if (!client) {
      return res.status(400).json({ message: 'Client not found' });
    }

    const caseData = new Case(req.body);
    await caseData.save();
    
    // Populate client data for response
    await caseData.populate('clientId', 'name phone email');
    res.status(201).json(caseData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /cases/:id - Update case
router.put('/:id', async (req, res) => {
  try {
    // If clientId is being updated, verify client exists
    if (req.body.clientId) {
      const client = await Client.findById(req.body.clientId);
      if (!client) {
        return res.status(400).json({ message: 'Client not found' });
      }
    }

    const caseData = await Case.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('clientId', 'name phone email');
    
    if (!caseData) {
      return res.status(404).json({ message: 'Case not found' });
    }
    res.json(caseData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /cases/:id - Delete case
router.delete('/:id', async (req, res) => {
  try {
    const caseData = await Case.findByIdAndDelete(req.params.id);
    if (!caseData) {
      return res.status(404).json({ message: 'Case not found' });
    }
    res.json({ message: 'Case deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
