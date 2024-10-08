const express = require('express');
const router = express.Router();
const Ransomware = require('../models/Ransomware');
const validateRansomware = require('../middleware/validateRansomware');
const { Op } = require('sequelize');

// CREATE: Add new ransomware record (with validation)
router.post('/', validateRansomware, async (req, res, next) => {
    try {
        const { name, extensions, encryptionAlgorithm } = req.body;

        // Convert the name string to an array of strings
        let nameArray;
        if (typeof name === 'string') {
            nameArray = name.split(',').map(item => item.trim()); // Convert string to array
        } else if (Array.isArray(name)) {
            nameArray = name; // If it's already an array, use it directly
        } else {
            return res.status(400).json({ message: 'Invalid format for name' });
        }

        // Check if any element of nameArray exists in the 'name' field of any record
        const duplicateRecord = await Ransomware.findOne({
            where: {
                name: {
                    [Op.overlap]: nameArray // Use PostgreSQL overlap operator
                }
            }
        });

        if (duplicateRecord) {
            return res.status(400).json({ message: 'Ransomware with one or more of these names already exists' });
        }

        // No duplicates found, create the new record
        const newRansomware = await Ransomware.create({
            name: nameArray, // Store the array of names
            extensions,
            encryptionAlgorithm,
        });

        res.status(201).json({ success: true, data: newRansomware });
    } catch (error) {
        console.error('Error creating record:', error);
        next(error); // Pass the error to the error handler
    }
});

// READ: Get all ransomware records
router.get('/', async (req, res, next) => {
    try {
        const ransomwareRecords = await Ransomware.findAll(); // Use Sequelize to fetch all records
        res.json({ success: true, data: ransomwareRecords });
    } catch (error) {
        console.error('Error fetching records:', error);
        next(error); // Pass the error to the error handler
    }
});

// READ: Get a single ransomware record by ID
router.get('/:id', async (req, res, next) => {
    try {
        const ransomware = await Ransomware.findByPk(req.params.id); // Use findByPk for primary key
        if (!ransomware) {
            return res.status(404).json({ message: 'Ransomware not found' });
        }
        res.json({ success: true, data: ransomware });
    } catch (error) {
        console.error('Error fetching record:', error);
        next(error); // Pass the error to the error handler
    }
});

// UPDATE: Update a ransomware record by ID (with validation)
router.put('/:id', validateRansomware, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, extensions, encryptionAlgorithm } = req.body;

        let nameArray;
        if (typeof name === 'string') {
            nameArray = name.split(',').map(item => item.trim()); // Convert string to array
        } else if (Array.isArray(name)) {
            nameArray = name; // If it's already an array, use it directly
        } else {
            return res.status(400).json({ message: 'Invalid format for name' });
        }

        // Check for duplicates in other records (exclude current record)
        const duplicateRecord = await Ransomware.findOne({
            where: {
                id: {
                    [Op.ne]: id // Exclude the current record by ID
                },
                name: {
                    [Op.overlap]: nameArray // Check for overlapping array elements
                }
            }
        });

        if (duplicateRecord) {
            return res.status(400).json({ message: 'Ransomware with one or more of these names already exists' });
        }

        // Find the record by ID and update
        const ransomware = await Ransomware.findByPk(id);
        if (!ransomware) {
            return res.status(404).json({ message: 'Ransomware not found' });
        }

        ransomware.name = nameArray;
        ransomware.extensions = extensions;
        ransomware.encryptionAlgorithm = encryptionAlgorithm;

        const updatedRansomware = await ransomware.save(); // Save the updated record
        res.json({ success: true, data: updatedRansomware });
    } catch (error) {
        console.error('Error updating record:', error);
        next(error); // Pass the error to the error handler
    }
});

// DELETE: Remove a ransomware record by ID
router.delete('/:id', async (req, res, next) => {
    try {
        const deletedRansomware = await Ransomware.destroy({
            where: { id: req.params.id } // Use Sequelize destroy method
        });
        if (!deletedRansomware) {
            return res.status(404).json({ message: 'Ransomware not found' });
        }
        res.json({ success: true, message: 'Ransomware deleted' });
    } catch (error) {
        console.error('Error deleting record:', error);
        next(error); // Pass the error to the error handler
    }
});

module.exports = router;
