const express = require('express');
const router = express.Router();
const matrimonyController = require('../controllers/matrymonyController');

// Route to create a new matrimony record
router.post('/', matrimonyController.createMatrimonyRecord);

// Route to get all matrimony records
router.get('/', matrimonyController.getAllMatrimonyRecords);

// Route to get a matrimony record by ID
router.get('/:id', matrimonyController.getMatrimonyRecordById);

// Route to update a matrimony record by ID
router.put('/:id', matrimonyController.updateMatrimonyRecordById);

// Route to delete a matrimony record by ID
router.delete('/:id', matrimonyController.deleteMatrimonyRecordById);

router.get('/reference/:reference_no',matrimonyController.getMatrymonyByReferenceNo)

module.exports = router;
