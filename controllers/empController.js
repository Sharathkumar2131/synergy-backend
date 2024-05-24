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
    const lastCha = await pool.request().query('SELECT TOP 1 id FROM emp_details ORDER BY id DESC');
    let lastId = 'svacha2024000'; // Default starting ID
    if (lastCha.recordset.length > 0) {
      lastId = lastCha.recordset[0].chaid;
    }
    const newId = incrementChaId(lastId); // Function to increment the chaid

    const request = pool.request();

    const query = `
      INSERT INTO cha 
      (chaid, fullname, father_name, gender, dob, whatsapp_no, alternative_number, email, address, qualification, occupation) 
      VALUES 
      (@chaid, @fullname, @father_name, @gender, @dob, @whatsapp_no, @alternative_number, @email, @address, @qualification, @occupation)
    `;

    request.input('chaid', sql.NVarChar(50), newId);
    request.input('fullname', sql.NVarChar(100), fullname);
    request.input('father_name', sql.NVarChar(100), father_name);
    request.input('gender', sql.NVarChar(10), gender);
    request.input('dob', sql.Date, dob);
    request.input('whatsapp_no', sql.NVarChar(20), whatsapp_no);
    request.input('alternative_number', sql.NVarChar(20), alternative_number);
    request.input('email', sql.NVarChar(100), email);
    request.input('address', sql.NVarChar(255), address);
    request.input('qualification', sql.NVarChar(100), qualification);
    request.input('occupation', sql.NVarChar(100), occupation);

    await request.query(query);

    res.status(201).send('CHA added successfully');
    await pool.close();
  } catch (err) {
    console.error('SQL error:', err.message);
    res.status(500).send('Internal server error');
  }
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


// async function updateCha(req, res) {
//   const chaId = req.params.chaId;
//   const updatedFields = req.body;

//   try {
//     const pool = await sql.connect(config);
//     const request = pool.request();

//     // Prepare to dynamically construct the SET clause
//     const setClauses = [];
//     Object.keys(updatedFields).forEach((key) => {
//       const columnValue = updatedFields[key];
//       const paramName = key; // Use the field name as the parameter name
//       request.input(paramName, sql.NVarChar(sql.MAX), columnValue);
//       if (key !== 'chaid') { // Exclude 'id' from SET clause
//         setClauses.push(`${key} = @${paramName}`);
//       }
//     });

//     const updateQuery = `
//       UPDATE cha 
//       SET ${setClauses.join(', ')}
//       WHERE chaid = @chaid
//     `;

//     // Add the 'id' parameter for WHERE clause
//     request.input('chaid', sql.NVarChar(50), chaId);

//     // Execute the UPDATE query
//     const result = await request.query(updateQuery);

//     res.status(200).send('CHA updated successfully');
//     await pool.close();
//   } catch (err) {
//     console.error('SQL error:', err.message);
//     res.status(500).send('Internal server error');
//   }
// }


module.exports = {
  getEmpDetails,
  getEmpDetailsById,
  AddEmp
  // updateCha,
  // addCha,
};
