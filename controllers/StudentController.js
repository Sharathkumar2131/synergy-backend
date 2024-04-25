const sql = require('mssql');

const config = {
    user: 'sharath',
    password: 'Tsc@2131',
    server: 'DESKTOP-L26TOEP',
    port: 1433,
    database: 'synergy',
    options: {
        trustedConnection: true,
        encrypt: false,
    },
};

// Create a new student
exports.createStudent = async (req, res) => {
    const {
        referenceNo,
        consultancy,
        svAdvisor,
        advisorPosition,
        place,
        advisorMobileNumber,
        studentName,
        studentMobileNumber,
        dateOfBirth,
        age,
        gender,
        fatherName,
        fatherOccupation,
        fatherMobileNumber,
        motherName,
        motherOccupation,
        motherMobileNumber,
        spouseName,
        spouseOccupation,
        spouseMobileNumber,
        qualifications,
        caste,
        reservationCategory,
        address,
        courseOffered,
        preferredCollegeUniversity,
        planToStudy,
        country
    } = req.body;

    try {
        const pool = await sql.connect(config);
        const request = pool.request();

        // Set parameters based on provided values
        request.input('referenceNo', sql.NVarChar(50), referenceNo);
        request.input('consultancy', sql.NVarChar(255), consultancy);
        request.input('svAdvisor', sql.NVarChar(255), svAdvisor);
        request.input('advisorPosition', sql.NVarChar(100), advisorPosition);
        request.input('place', sql.NVarChar(255), place);
        request.input('advisorMobileNumber', sql.NVarChar(20), advisorMobileNumber);
        request.input('studentName', sql.NVarChar(255), studentName);
        request.input('studentMobileNumber', sql.NVarChar(20), studentMobileNumber);

        // Validate and parse dateOfBirth if provided
        if (dateOfBirth) {
            const parsedDateOfBirth = new Date(dateOfBirth);
            if (!isNaN(parsedDateOfBirth)) {
                request.input('dateOfBirth', sql.Date, parsedDateOfBirth);
            } else {
                request.input('dateOfBirth', sql.Date, null);
            }
        } else {
            request.input('dateOfBirth', sql.Date, null);
        }

        request.input('age', sql.Int, age);
        request.input('gender', sql.NVarChar(10), gender);
        request.input('fatherName', sql.NVarChar(255), fatherName);
        request.input('fatherOccupation', sql.NVarChar(255), fatherOccupation);
        request.input('fatherMobileNumber', sql.NVarChar(20), fatherMobileNumber);
        request.input('motherName', sql.NVarChar(255), motherName);
        request.input('motherOccupation', sql.NVarChar(255), motherOccupation);
        request.input('motherMobileNumber', sql.NVarChar(20), motherMobileNumber);
        request.input('spouseName', sql.NVarChar(255), spouseName);
        request.input('spouseOccupation', sql.NVarChar(255), spouseOccupation);
        request.input('spouseMobileNumber', sql.NVarChar(20), spouseMobileNumber);
        request.input('qualifications', sql.NVarChar(sql.MAX), qualifications);
        request.input('caste', sql.NVarChar(100), caste);
        request.input('reservationCategory', sql.NVarChar(100), reservationCategory);
        request.input('address', sql.NVarChar(sql.MAX), address);
        request.input('courseOffered', sql.NVarChar(255), courseOffered);
        request.input('preferredCollegeUniversity', sql.NVarChar(255), preferredCollegeUniversity);
        request.input('planToStudy', sql.NVarChar(255), planToStudy);
        request.input('country', sql.NVarChar(100), country);

        // Execute the SQL query
        await request.query(`
            INSERT INTO students (
                referenceNo, consultancy, svAdvisor, advisorPosition, place, advisorMobileNumber,
                studentName, studentMobileNumber, dateOfBirth, age, gender,
                fatherName, fatherOccupation, fatherMobileNumber,
                motherName, motherOccupation, motherMobileNumber,
                spouseName, spouseOccupation, spouseMobileNumber,
                qualifications, caste, reservationCategory, address,
                courseOffered, preferredCollegeUniversity, planToStudy, country
            )
            VALUES (
                @referenceNo, @consultancy, @svAdvisor, @advisorPosition, @place, @advisorMobileNumber,
                @studentName, @studentMobileNumber, @dateOfBirth, @age, @gender,
                @fatherName, @fatherOccupation, @fatherMobileNumber,
                @motherName, @motherOccupation, @motherMobileNumber,
                @spouseName, @spouseOccupation, @spouseMobileNumber,
                @qualifications, @caste, @reservationCategory, @address,
                @courseOffered, @preferredCollegeUniversity, @planToStudy, @country
            );
        `);

        res.status(201).json({ message: 'Student created successfully' });
    } catch (error) {
        console.error('Error creating student', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.updateStudentById = async (req, res) => {
    const { id } = req.params;
    const updatedFields = req.body;

    try {
        const pool = await sql.connect(config);
        const existingStudent = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM students WHERE id = @id;');

        if (!existingStudent.recordset[0]) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const currentStudent = existingStudent.recordset[0];

        // Merge updatedFields with currentStudent to retain unchanged values
        const updatedStudent = { ...currentStudent, ...updatedFields };

        // Build the dynamic SQL query for partial update
        const updateQuery = Object.keys(updatedFields)
            .map(key => `${key} = @${key}`)
            .join(', ');

        const request = pool.request();
        Object.keys(updatedFields).forEach(key => {
            request.input(key, sql.NVarChar, updatedFields[key]);
        });
        request.input('id', sql.Int, id);

        await request.query(`
            UPDATE students
            SET ${updateQuery}
            WHERE id = @id;
        `);

        res.status(200).json({ message: 'Student updated successfully' });
    } catch (error) {
        console.error('Error updating student', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Get a student by id
exports.getStudentById = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM students WHERE id = @id;');

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.error('Error fetching student by id', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// controllers/studentController.js

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM students;');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching all students', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get student by referenceNo
exports.getStudentByReferenceNo = async (req, res) => {
    const { referenceNo } = req.params;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('referenceNo', sql.NVarChar(50), referenceNo)
            .query('SELECT * FROM students WHERE referenceNo = @referenceNo;');

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.error('Error fetching student by referenceNo', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

