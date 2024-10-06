const express = require('express');
const router = express.Router();
const Ransomware = require('../models/Ransomware');
const validateRansomware = require('../middleware/validateRansomware');

// CREATE: Add new ransomware record (with validation)
router.post('/', validateRansomware, async (req, res, next) => {
    try {
        const newRansomware = new Ransomware(req.body);
        const savedRansomware = await newRansomware.save();
        res.status(201).json(savedRansomware);
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
});

// READ: Get all ransomware records
router.get('/', async (req, res, next) => {
    try {
        const ransomwareRecords = await Ransomware.find();
        res.json(ransomwareRecords);
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
});

// READ: Get a single ransomware record by ID
router.get('/:id', async (req, res, next) => {
    try {
        const ransomware = await Ransomware.findById(req.params.id);
        if (!ransomware) {
            return res.status(404).json({ message: 'Ransomware not found' });
        }
        res.json(ransomware);
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
});

// UPDATE: Update a ransomware record by ID (with validation)
router.put('/:id', validateRansomware, async (req, res, next) => {
    try {
        const updatedRansomware = await Ransomware.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRansomware) {
            return res.status(404).json({ message: 'Ransomware not found' });
        }
        res.json(updatedRansomware);
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
});

// DELETE: Remove a ransomware record by ID
router.delete('/:id', async (req, res, next) => {
    try {
        const deletedRansomware = await Ransomware.findByIdAndDelete(req.params.id);
        if (!deletedRansomware) {
            return res.status(404).json({ message: 'Ransomware not found' });
        }
        res.json({ message: 'Ransomware deleted' });
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
});

module.exports = router;
