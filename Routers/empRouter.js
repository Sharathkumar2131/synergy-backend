const express = require('express');
const router = express.Router();
const usersController = require('../controllers/empController');

router.post('/add', usersController.AddEmp);
router.get('/', usersController.getEmpDetails);
router.get('/:id', usersController.getEmpDetailsById);
router.put('/:id', usersController.UpdateEmp);
router.get('/employees/:userRole', usersController.getEmployeesByRole);
module.exports = router;
