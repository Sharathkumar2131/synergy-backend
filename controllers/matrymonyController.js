const sql = require('mssql');

// Database configuration
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

// Create a new matrimony record
exports.createMatrimonyRecord = async (req, res) => {
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
        height,
        color,
        qualifications,
        caste,
        sub_category,
        hobbies,
        gothram,
        nakshatram,
        rasi,
        others,
        employee_position,
        place_of_work,
        monthly_salary,
        yearly_salary,
        business_position,
        business_title,
        bsn_monthly_salary,
        bsn_yearly_salary,
        assets,
        exp_of_life_partner,
        choice,
        present_address,
        f_name,
        f_occupation,
        f_mobile,
        m_name,
        m_occupation,
        m_mobile,
        sp_name,
        sp_occupation,
        sp_mobile,
        permanent_address
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
        request.input('height', sql.Int, height);
        request.input('color', sql.NVarChar(50), color);
        request.input('qualifications', sql.NVarChar(255), qualifications);
        request.input('caste', sql.NVarChar(50), caste);
        request.input('sub_category', sql.NVarChar(50), sub_category);
        request.input('hobbies', sql.NVarChar(sql.MAX), hobbies);
        request.input('gothram', sql.NVarChar(100), gothram);
        request.input('nakshatram', sql.NVarChar(100), nakshatram);
        request.input('rasi', sql.NVarChar(50), rasi);
        request.input('others', sql.NVarChar(sql.MAX), others);
        request.input('employee_position', sql.NVarChar(100), employee_position);
        request.input('place_of_work', sql.NVarChar(255), place_of_work);
        request.input('monthly_salary', sql.Decimal(18, 2), monthly_salary);
        request.input('yearly_salary', sql.Decimal(18, 2), yearly_salary);
        request.input('business_position', sql.NVarChar(100), business_position);
        request.input('business_title', sql.NVarChar(255), business_title);
        request.input('bsn_monthly_salary', sql.Decimal(18, 2), bsn_monthly_salary);
        request.input('bsn_yearly_salary', sql.Decimal(18, 2), bsn_yearly_salary);
        request.input('assets', sql.NVarChar(sql.MAX), assets);
        request.input('exp_of_life_partner', sql.NVarChar(sql.MAX), exp_of_life_partner);
        request.input('choice', sql.NVarChar(50), choice);
        request.input('present_address', sql.NVarChar(sql.MAX), present_address);
        request.input('f_name', sql.NVarChar(255), f_name);
        request.input('f_occupation', sql.NVarChar(255), f_occupation);
        request.input('f_mobile', sql.NVarChar(20), f_mobile);
        request.input('m_name', sql.NVarChar(255), m_name);
        request.input('m_occupation', sql.NVarChar(255), m_occupation);
        request.input('m_mobile', sql.NVarChar(20), m_mobile);
        request.input('sp_name', sql.NVarChar(255), sp_name);
        request.input('sp_occupation', sql.NVarChar(255), sp_occupation);
        request.input('sp_mobile', sql.NVarChar(20), sp_mobile);
        request.input('permanent_address', sql.NVarChar(sql.MAX), permanent_address);

        // Execute the SQL query
        await request.query(`
            INSERT INTO matrimony (
                reference_no, advisor_place, sv_advisor, advisor_mobile,
                name, mobile_no, dob, age, gender, height, color,
                qualifications, caste, sub_category, hobbies, gothram,
                nakshatram, rasi, others, employee_position, place_of_work,
                monthly_salary, yearly_salary, business_position, business_title,
                bsn_monthly_salary, bsn_yearly_salary, assets, exp_of_life_partner,
                choice, present_address, f_name, f_occupation, f_mobile,
                m_name, m_occupation, m_mobile, sp_name, sp_occupation,
                sp_mobile, permanent_address
            )
            VALUES (
                @reference_no, @advisor_place, @sv_advisor, @advisor_mobile,
                @name, @mobile_no, @dob, @age, @gender, @height, @color,
                @qualifications, @caste, @sub_category, @hobbies, @gothram,
                @nakshatram, @rasi, @others, @employee_position, @place_of_work,
                @monthly_salary, @yearly_salary, @business_position, @business_title,
                @bsn_monthly_salary, @bsn_yearly_salary, @assets, @exp_of_life_partner,
                @choice, @present_address, @f_name, @f_occupation, @f_mobile,
                @m_name, @m_occupation, @m_mobile, @sp_name, @sp_occupation,
                @sp_mobile, @permanent_address
            );
        `);

        res.status(201).json({ message: 'Matrimony record created successfully' });
    } catch (error) {
        console.error('Error creating matrimony record', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all matrimony records
exports.getAllMatrimonyRecords = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM matrimony;');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching all matrimony records', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a matrimony record by ID
exports.getMatrimonyRecordById = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await sql.connect(config);
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM matrimony WHERE id = @id;');

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'Matrimony record not found' });
        }
    } catch (error) {
        console.error('Error fetching matrimony record by ID', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update a matrimony record by ID
exports.updateMatrimonyRecordById = async (req, res) => {
    const { id } = req.params;
    const updatedFields = req.body;

    try {
        const pool = await sql.connect(config);
        const existingRecord = await pool
            .request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM matrimony WHERE id = @id;');

        if (!existingRecord.recordset[0]) {
            return res.status(404).json({ message: 'Matrimony record not found' });
        }

        // Merge updatedFields with existingRecord to retain unchanged values
        const updatedRecord = { ...existingRecord.recordset[0], ...updatedFields };

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
            UPDATE matrimony
            SET ${updateQuery}
            WHERE id = @id;
        `);

        res.status(200).json({ message: 'Matrimony record updated successfully' });
    } catch (error) {
        console.error('Error updating matrimony record', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a matrimony record by ID
exports.deleteMatrimonyRecordById = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await sql.connect(config);
        await pool
            .request()
            .input('id', sql.Int, id)
            .query('DELETE FROM matrimony WHERE id = @id;');

        res.status(200).json({ message: 'Matrimony record deleted successfully' });
    } catch (error) {
        console.error('Error deleting matrimony record', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getMatrymonyByReferenceNo = async (req, res) => {
    const { reference_no } = req.params;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('reference_no', sql.NVarChar(50), reference_no)
            .query('SELECT * FROM matrimony WHERE reference_no = @reference_no;');

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'Match not found' });
        }
    } catch (error) {
        console.error('Error fetching student by referenceNo', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};