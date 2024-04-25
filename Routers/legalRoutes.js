const express = require('express');
const router = express.Router();
const legalController = require('../controllers/legalController');

// Create a new patient
router.post('/', legalController.createLegal);

// Update a patient by id
router.put('/:id', legalController.updateLegalById);

// Get a patient by id
router.get('/:id', legalController.getLegalById);

// Get all patients
router.get('/', legalController.getAllLegal);

// Get a patient by reference_no
router.get('/reference/:referenceNo', legalController.getLegalByReferenceNo);

module.exports = router;
