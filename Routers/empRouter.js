const express = require('express');
const router = express.Router();
const usersController = require('../controllers/empController');

router.post('/add', usersController.AddEmp);
router.get('/', usersController.getEmpDetails);
router.get('/:id', usersController.getEmpDetailsById);
router.put('/:id', usersController.UpdateEmp);
router.get('/employees/:userRole', usersController.getEmployeesByRole);
router.get('/employee/:empid', usersController.getEmployeesByEmpId);
router.put('/employee/:empid', usersController.updateEmployee);
router.delete('/employee/:empid', usersController.deleteEmployee);
module.exports = router;
