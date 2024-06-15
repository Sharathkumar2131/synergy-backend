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


async function AddEmp(req, res) {
  const {
    prefix, // Accept the prefix from the frontend
    fullname,
    father_name,
    gender,
    dob,
    whatsapp_no,
    alternative_number,
    email,
    address,
    qualification,
    occupation
  } = req.body;

  try {
    const pool = await sql.connect(config);

    // Fetch the last chaid
    const lastCha = await pool.request().query(`SELECT TOP 1 empid FROM emp_details WHERE empid LIKE '${prefix}%' ORDER BY empid DESC`);
    let lastId = `${prefix}2024000`;
    if (lastCha.recordset.length > 0) {
      lastId = lastCha.recordset[0].empid;
    }
    const newId = incrementChaId(lastId, prefix); // Pass the prefix to the increment function

    const request = pool.request();

    const query = `
      INSERT INTO emp_details 
      (empid, emp_name, father_name, gender, dob, whatsapp_no, alternative_number, email, address, qualification, occupation, user_role, emp_status) 
      VALUES 
      (@empid, @emp_name, @father_name, @gender, @dob, @whatsapp_no, @alternative_number, @email, @address, @qualification, @occupation, @user_role, @emp_status)
    `;

    request.input('empid', sql.NVarChar(50), newId);
    request.input('emp_name', sql.NVarChar(50), fullname);
    request.input('father_name', sql.NVarChar(50), father_name);
    request.input('gender', sql.NVarChar(10), gender);
    request.input('dob', sql.Date, dob);
    request.input('whatsapp_no', sql.NVarChar(15), whatsapp_no);
    request.input('alternative_number', sql.NVarChar(15), alternative_number);
    request.input('email', sql.NVarChar(50), email);
    request.input('address', sql.NVarChar(255), address);
    request.input('qualification', sql.NVarChar(50), qualification);
    request.input('occupation', sql.NVarChar(50), occupation);
    request.input('user_role', sql.NVarChar(20), 'employee'); // Assuming a default role of 'employee'
    request.input('emp_status', sql.NVarChar(10), 'active'); // Assuming a default status of 'active'

    await request.query(query);

    res.status(201).send('Employee added successfully');
    await pool.close();
  } catch (err) {
    console.error('SQL error:', err.message);
    res.status(500).send('Internal server error');
  }
}

// Function to increment the ID
function incrementChaId(lastId, prefix) {
  const numericPart = parseInt(lastId.replace(prefix, ''), 10); // Extract numeric part
  const newNumericPart = numericPart + 1; // Increment the numeric part
  const newId = `${prefix}${newNumericPart.toString().padStart(4, '0')}`; // Form new ID
  return newId;
}


// Function to increment the chaid
function incrementChaId(lastId) {
  const lastNum = parseInt(lastId.slice(-3));
  const newNum = lastNum + 1;
  const paddedNum = String(newNum).padStart(3, '0');
  const prefix = lastId.slice(0, -3);
  return `${prefix}${paddedNum}`;
}


async function getEmpDetails(req, res) {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM emp_details');
    res.json(result.recordset);
    await pool.close();
  } catch (err) {
    console.error('SQL error:', err.message);
    res.status(500).send('Internal server error');
  }
}

async function getEmpDetailsById(req, res) {
  const { id } = req.params;

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM emp_details WHERE id = @id;');

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset[0]);
    } else {
      res.status(404).json({ message: 'emp_details record not found' });
    }
  } catch (error) {
    console.error('Error fetching emp_details record by ID', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


async function UpdateEmp(req, res) {
  const {
    fullname,
    father_name,
    gender,
    dob,
    whatsapp_no,
    alternative_number,
    email,
    address,
    qualification,
    occupation,
    user_role,
    emp_status
  } = req.body;
  const { id } = req.params;

  try {
    const pool = await sql.connect(config);

    const request = pool.request();

    const query = `
      UPDATE emp_details 
      SET 
        emp_name = @emp_name,
        father_name = @father_name,
        gender = @gender,
        dob = @dob,
        whatsapp_no = @whatsapp_no,
        alternative_number = @alternative_number,
        email = @email,
        address = @address,
        qualification = @qualification,
        occupation = @occupation,
        user_role = @user_role,
        emp_status = @emp_status
      WHERE 
        id = @id
    `;

    request.input('id', sql.Int, id);
    request.input('emp_name', sql.NVarChar(50), fullname);
    request.input('father_name', sql.NVarChar(50), father_name);
    request.input('gender', sql.NVarChar(10), gender);
    request.input('dob', sql.Date, dob);
    request.input('whatsapp_no', sql.NVarChar(15), whatsapp_no);
    request.input('alternative_number', sql.NVarChar(15), alternative_number);
    request.input('email', sql.NVarChar(50), email);
    request.input('address', sql.NVarChar(255), address);
    request.input('qualification', sql.NVarChar(50), qualification);
    request.input('occupation', sql.NVarChar(50), occupation);
    request.input('user_role', sql.NVarChar(20), user_role); // Role of the employee
    request.input('emp_status', sql.NVarChar(10), emp_status); // Status of the employee

    await request.query(query);

    res.status(200).send('Employee updated successfully');
    await pool.close();
  } catch (err) {
    console.error('SQL error:', err.message);
    res.status(500).send('Internal server error');
  }
}


async function getEmployeesByRole(req, res) {
  try {
    await sql.connect(config);
    const request = new sql.Request();
    const userRole = req.params.userRole;

    const result = await request.query(`SELECT * FROM emp_details WHERE user_role = '${userRole}'`);

    res.json(result.recordset);
  } catch (err) {
    console.error('SQL error:', err);
    res.status(500).send('Error retrieving data from MSSQL.');
  } finally {
    sql.close();
  }
}

module.exports = {
  getEmpDetails,
  getEmpDetailsById,
  AddEmp,
  UpdateEmp,
  getEmployeesByRole
};
