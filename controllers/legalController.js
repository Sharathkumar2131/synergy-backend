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

// Create a new legal record
exports.createLegal = async (req, res) => {
    const {
        reference_no,
        advisor_place,
        sv_advisor,
        advisor_mobile,
        client_name,
        mobile_no,
        dob,
        age,
        gender,
        f_name,
        s_occupation,
        f_mobile,
        m_name,
        m_occupation,
        m_mobile,
        sp_name,
        sp_occupation,
        sp_mobile,
        address,
        issue,
        kind_of_legal_matter,
        court,
        present_status_of_case
    } = req.body;

    try {
        const pool = await sql.connect(config);
        const request = pool.request();

        // Set parameters based on provided values
        request.input('reference_no', sql.NVarChar(50), reference_no);
        request.input('advisor_place', sql.NVarChar(255), advisor_place);
        request.input('sv_advisor', sql.NVarChar(255), sv_advisor);
        request.input('advisor_mobile', sql.NVarChar(20), advisor_mobile);
        request.input('client_name', sql.NVarChar(255), client_name);
        request.input('mobile_no', sql.NVarChar(20), mobile_no);
        // request.input('dob', sql.Date, new Date(dob));
        
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
        
        request.input('age', sql.Int, age);
        request.input('gender', sql.NVarChar(10), gender);
        request.input('f_name', sql.NVarChar(255), f_name);
        request.input('s_occupation', sql.NVarChar(255), s_occupation);
        request.input('f_mobile', sql.NVarChar(20), f_mobile);
        request.input('m_name', sql.NVarChar(255), m_name);
        request.input('m_occupation', sql.NVarChar(255), m_occupation);
        request.input('m_mobile', sql.NVarChar(20), m_mobile);
        request.input('sp_name', sql.NVarChar(255), sp_name);
        request.input('sp_occupation', sql.NVarChar(255), sp_occupation);
        request.input('sp_mobile', sql.NVarChar(20), sp_mobile);
        request.input('address', sql.NVarChar(sql.MAX), address);
        request.input('issue', sql.NVarChar(sql.MAX), issue);
        request.input('kind_of_legal_matter', sql.NVarChar(255), kind_of_legal_matter);
        request.input('court', sql.NVarChar(255), court);
        request.input('present_status_of_case', sql.NVarChar(255), present_status_of_case);

        // Execute the SQL query
        await request.query(`
            INSERT INTO legal (
                reference_no, advisor_place, sv_advisor, advisor_mobile, client_name, mobile_no,
                dob, age, gender, f_name, s_occupation, f_mobile,
                m_name, m_occupation, m_mobile, sp_name, sp_occupation, sp_mobile,
                address, issue, kind_of_legal_matter, court, present_status_of_case
            )
            VALUES (
                @reference_no, @advisor_place, @sv_advisor, @advisor_mobile, @client_name, @mobile_no,
                @dob, @age, @gender, @f_name, @s_occupation, @f_mobile,
                @m_name, @m_occupation, @m_mobile, @sp_name, @sp_occupation, @sp_mobile,
                @address, @issue, @kind_of_legal_matter, @court, @present_status_of_case
            );
        `);

        res.status(201).json({ message: 'Legal record created successfully' });
    } catch (error) {
        console.error('Error creating legal record', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a legal record by id
exports.updateLegalById = async (req, res) => {
    const { id } = req.params;
    const updatedFields = req.body;

    try {
        const pool = await sql.connect(config);
        const existingRecord = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM legal WHERE id = @id;');

        if (!existingRecord.recordset[0]) {
            return res.status(404).json({ message: 'Legal record not found' });
        }

        const currentRecord = existingRecord.recordset[0];

        // Merge updatedFields with currentRecord to retain unchanged values
        const updatedRecord = { ...currentRecord, ...updatedFields };

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
            UPDATE legal
            SET ${updateQuery}
            WHERE id = @id;
        `);

        res.status(200).json({ message: 'Legal record updated successfully' });
    } catch (error) {
        console.error('Error updating legal record', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a legal record by id
exports.getLegalById = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM legal WHERE id = @id;');

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'Legal record not found' });
        }
    } catch (error) {
        console.error('Error fetching legal record by id', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all legal records
exports.getAllLegal = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM legal;');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching all legal records', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get legal record by reference_no
exports.getLegalByReferenceNo = async (req, res) => {
    const { referenceNo } = req.params;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('referenceNo', sql.NVarChar(50), referenceNo)
            .query('SELECT * FROM legal WHERE reference_no = @referenceNo;');

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'Legal record not found' });
        }
    } catch (error) {
        console.error('Error fetching legal record by reference_no', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
