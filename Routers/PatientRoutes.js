const express = require('express');
const router = express.Router();
const patientController = require('../controllers/PatientController');

// Create a new patient
router.post('/', patientController.createPatient);

// Update a patient by id
router.put('/:id', patientController.updatePatientById);

// Get a patient by id
router.get('/:id', patientController.getPatientById);

// Get all patients
router.get('/', patientController.getAllPatients);

// Get a patient by reference_no
router.get('/reference/:referenceNo', patientController.getPatientByReferenceNo);

module.exports = router;
