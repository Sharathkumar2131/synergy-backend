const sql = require('mssql');

const config = {
    user: 'sharath',
    password: 'Tsc@2131',
    server: '103.168.173.174',
    port: 1433,
    database: 'synergy',
    options: {
        trustedConnection: true,
        encrypt: false,
    },
};

// Create a new patient
exports.createPatient = async (req, res) => {
    const {
        reference_no,
        advisor_place,
        sv_advisor,
        advisor_mobile,
        name,
        mobile_no,
        dob,
        age,
        gender,
        f_name,
        f_mobile,
        m_name,
        m_mobile,
        sp_name,
        sp_mobile,
        address,
        required_treatment,
        treatment_history,
        adhaar_no,
        health_card,
        arogyasri_no,
        health_insurance,
        insurance_company,
        policy_no
    } = req.body;

    try {
        const pool = await sql.connect(config);
        const request = pool.request();

        // Set parameters based on provided values
        request.input('reference_no', sql.NVarChar(50), reference_no);
        request.input('advisor_place', sql.NVarChar(255), advisor_place);
        request.input('sv_advisor', sql.NVarChar(255), sv_advisor);
        request.input('advisor_mobile', sql.NVarChar(20), advisor_mobile);
        request.input('name', sql.NVarChar(255), name);
        request.input('mobile_no', sql.NVarChar(20), mobile_no);

        if (dob) {
            const parsedDateOfBirth = new Date(dob);
            if (!isNaN(parsedDateOfBirth)) {
                request.input('dob', sql.Date, parsedDateOfBirth);
            } else {
                request.input('dob', sql.Date, null);
            }
        } else {
            request.input('dob', sql.Date, null);
        }


        // request.input('dob', sql.Date, new Date(dob));
        request.input('age', sql.Int, age);
        request.input('gender', sql.NVarChar(10), gender);
        request.input('f_name', sql.NVarChar(255), f_name);
        request.input('f_mobile', sql.NVarChar(20), f_mobile);
        request.input('m_name', sql.NVarChar(255), m_name);
        request.input('m_mobile', sql.NVarChar(20), m_mobile);
        request.input('sp_name', sql.NVarChar(255), sp_name);
        request.input('sp_mobile', sql.NVarChar(20), sp_mobile);
        request.input('address', sql.NVarChar(sql.MAX), address);
        request.input('required_treatment', sql.NVarChar(sql.MAX), required_treatment);
        request.input('treatment_history', sql.NVarChar(sql.MAX), treatment_history);
        request.input('adhaar_no', sql.NVarChar(20), adhaar_no);
        request.input('health_card', sql.NVarChar(50), health_card);
        request.input('arogyasri_no', sql.NVarChar(50), arogyasri_no);
        request.input('health_insurance', sql.NVarChar(255), health_insurance);
        request.input('insurance_company', sql.NVarChar(255), insurance_company);
        request.input('policy_no', sql.NVarChar(50), policy_no);

        // Execute the SQL query
        await request.query(`
            INSERT INTO Patients (
                reference_no, advisor_place, sv_advisor, advisor_mobile, name, mobile_no,
                dob, age, gender, f_name, f_mobile, m_name, m_mobile, sp_name, sp_mobile,
                address, required_treatment, treatment_history, adhaar_no, health_card,
                arogyasri_no, health_insurance, insurance_company, policy_no
            )
            VALUES (
                @reference_no, @advisor_place, @sv_advisor, @advisor_mobile, @name, @mobile_no,
                @dob, @age, @gender, @f_name, @f_mobile, @m_name, @m_mobile, @sp_name, @sp_mobile,
                @address, @required_treatment, @treatment_history, @adhaar_no, @health_card,
                @arogyasri_no, @health_insurance, @insurance_company, @policy_no
            );
        `);

        res.status(201).json({ message: 'Patient created successfully' });
    } catch (error) {
        console.error('Error creating patient', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a patient by id
exports.updatePatientById = async (req, res) => {
    const { id } = req.params;
    const updatedFields = req.body;

    try {
        const pool = await sql.connect(config);
        const existingPatient = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Patients WHERE id = @id;');

        if (!existingPatient.recordset[0]) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const currentPatient = existingPatient.recordset[0];

        // Merge updatedFields with currentPatient to retain unchanged values
        const updatedPatient = { ...currentPatient, ...updatedFields };

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
            UPDATE Patients
            SET ${updateQuery}
            WHERE id = @id;
        `);

        res.status(200).json({ message: 'Patient updated successfully' });
    } catch (error) {
        console.error('Error updating patient', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a patient by id
exports.getPatientById = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Patients WHERE id = @id;');

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (error) {
        console.error('Error fetching patient by id', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all patients
exports.getAllPatients = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM Patients;');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching all patients', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get patient by reference_no
exports.getPatientByReferenceNo = async (req, res) => {
    const { referenceNo } = req.params;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('referenceNo', sql.NVarChar(50), referenceNo)
            .query('SELECT * FROM Patients WHERE reference_no = @referenceNo;');

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (error) {
        console.error('Error fetching patient by reference_no', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
