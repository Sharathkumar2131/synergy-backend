const express = require('express');
const router = express.Router();
const studentController = require('../controllers/StudentController');

// POST /students - Create a new student
router.post('/', studentController.createStudent);

// PUT /students/:id - Update a student by id
router.put('/:id', studentController.updateStudentById);

// GET /students/:id - Get a student by id
router.get('/:id', studentController.getStudentById);

router.get('/', studentController.getAllStudents);

// GET student by referenceNo
router.get('/reference/:referenceNo', studentController.getStudentByReferenceNo);


module.exports = router;
