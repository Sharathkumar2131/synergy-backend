const express = require('express');
const router = express.Router();
const providerController = require('../controllers/ServiceProviderController'); // Adjust the path if needed

// Define routes for service providers
router.post('/providers', providerController.createProvider);
router.get('/providers', providerController.getProviders);
router.get('/providers/:id', providerController.getProviderById);
router.put('/providers/:id', providerController.updateProviderById);
router.delete('/providers/:id', providerController.deleteProviderById);

module.exports = router;
