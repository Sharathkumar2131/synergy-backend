const sql = require('mssql');
const moment = require('moment');

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

exports.createUser = async (req, res) => {
  const { prefix, name, f_name, mobile, service_required, qualification, address, category_id,reference_id } = req.body;

  try {
      const pool = await sql.connect(config);

      const currentYear = moment().format('YYYY');

      const result = await pool.request().query('SELECT COUNT(*) AS userCount FROM service_users');
      const userCount = result.recordset[0].userCount;

      const svaid = `${prefix}${currentYear}${String(userCount + 1).padStart(0, '0')}`;

      const insertResult = await pool.request()
          .input('svaid', sql.VarChar(255), svaid)
          .input('name', sql.VarChar(255), name)
          .input('f_name', sql.VarChar(255), f_name)
          .input('mobile', sql.VarChar(20), mobile)
          .input('service_required', sql.VarChar(255), service_required)
          .input('qualification', sql.VarChar(255), qualification)
          .input('category_id', sql.Int, category_id)
          .input('reference_id', sql.Int, reference_id)
          .input('address', sql.Text, address)
          .query(`
              INSERT INTO service_users (svaid, name, f_name, mobile, service_required, qualification, address, category_id,reference_id)
              VALUES (@svaid, @name, @f_name, @mobile, @service_required, @qualification, @address, @category_id,@reference_id);
          `);

      res.status(201).json({ message: 'User created successfully', svaid });
  } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

// Other controller methods unchanged

// Create a new user
// exports.createUser = async (req, res) => {
//   const { svaid, name, f_name, mobile, service_required, qualification, address } = req.body;

//   try {
//     const pool = await sql.connect(config);
//     const result = await pool.request()
//       .input('svaid', sql.VarChar(255), svaid)
//       .input('name', sql.VarChar(255), name)
//       .input('f_name', sql.VarChar(255), f_name)
//       .input('mobile', sql.VarChar(20), mobile)
//       .input('service_required', sql.VarChar(255), service_required)
//       .input('qualification', sql.VarChar(255), qualification)
//       .input('address', sql.Text, address)
//       .query(`
//         INSERT INTO service_users (svaid, name, f_name, mobile, service_required, qualification, address)
//         VALUES (@svaid, @name, @f_name, @mobile, @service_required, @qualification, @address);
//       `);

//     res.status(201).json({ message: 'User created successfully' });
//   } catch (error) {
//     console.error('Error creating user:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


// exports.createUser = async (req, res) => {
//     const { prefix, name, f_name, mobile, service_required, qualification, address } = req.body;
  
//     try {
//       const pool = await sql.connect(config);
      
//       // Get the current year
//       const currentYear = moment().format('YYYY');
      
//       // Query the database to count the number of existing users
//       const result = await pool.request().query('SELECT COUNT(*) AS userCount FROM service_users');
//       const userCount = result.recordset[0].userCount;
  
//       // Generate the svaid with leading zeros for the sequential number
//       const svaid = `${prefix}${currentYear}${String(userCount + 1).padStart(0, '0')}`;
  
//       // Insert the user into the database with the generated svaid
//       const insertResult = await pool.request()
//         .input('svaid', sql.VarChar(255), svaid)
//         .input('name', sql.VarChar(255), name)
//         .input('f_name', sql.VarChar(255), f_name)
//         .input('mobile', sql.VarChar(20), mobile)
//         .input('service_required', sql.VarChar(255), service_required)
//         .input('qualification', sql.VarChar(255), qualification)
//         .input('address', sql.Text, address)
//         .query(`
//           INSERT INTO service_users (svaid, name, f_name, mobile, service_required, qualification, address)
//           VALUES (@svaid, @name, @f_name, @mobile, @service_required, @qualification, @address);
//         `);
  
//       res.status(201).json({ message: 'User created successfully', svaid });
//     } catch (error) {
//       console.error('Error creating user:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   };
// Get all users
exports.getUsers = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM service_users');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM service_users WHERE id = @id;');

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user by ID
exports.updateUserById = async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM service_users WHERE id = @id;');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updateQuery = Object.keys(updatedFields)
      .map(key => `${key} = @${key}`)
      .join(', ');

    const request = pool.request();
    Object.keys(updatedFields).forEach(key => {
      request.input(key, sql.NVarChar, updatedFields[key]);
    });
    request.input('id', sql.Int, id);

    await request.query(`
      UPDATE service_users
      SET ${updateQuery}
      WHERE id = @id;
    `);

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete user by ID
exports.deleteUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM service_users WHERE id = @id;');

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
