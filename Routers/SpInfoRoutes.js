const express = require('express');
const router = express.Router();
const providerController = require('../controllers/SpInfoController'); // Adjust the path if needed

// Define routes for service providers
router.post('/spinfo', providerController.createSpInfo);
router.get('/spinfo', providerController.getSpInfo);
router.get('/spinfo/:id', providerController.getSpInfoById);
router.put('/spinfo/:id', providerController.updateSpInfoById);
router.delete('/spinfo/:id', providerController.deleteSpInfoById);

module.exports = router;
