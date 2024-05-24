const express = require('express');
const router = express.Router();
const usersController = require('../controllers/empController');

router.post('/add', usersController.AddEmp);
router.get('/', usersController.getEmpDetails);
router.get('/:id', usersController.getEmpDetailsById);
// router.put('/:chaId', usersController.updateCha);

module.exports = router;
