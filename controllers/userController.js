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


exports.getUsers = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM users');
    res.json(result.recordset);
    await pool.close();
  } catch (err) {
    console.error('SQL error:', err.message);
    res.status(500).send('Internal server error');
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM users WHERE id = @id;');

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset[0]);
    } else {
      res.status(404).json({ message: 'user record not found' });
    }
  } catch (error) {
    console.error('Error fetching matrimony record by ID', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getUserByCredentials = async (req, res) => {
  const { user_name, password } = req.body; // Extract user_name and password from request body

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('user_name', sql.VarChar, user_name)
      .input('password', sql.VarChar, password) // Assuming password is stored as plain text (not recommended)
      .query('SELECT * FROM users WHERE user_name = @user_name AND password = @password;');

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset[0]);
    } else {
      res.status(404).json({ message: 'User record not found' });
    }
  } catch (error) {
    console.error('Error fetching user record by credentials', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a matrimony record by ID
exports.updateUserById = async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;

  try {
    const pool = await sql.connect(config);
    const existingRecord = await pool
      .request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM users WHERE id = @id;');

    if (!existingRecord.recordset[0]) {
      return res.status(404).json({ message: 'user record not found' });
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
          UPDATE users
          SET ${updateQuery}
          WHERE id = @id;
      `);

    res.status(200).json({ message: 'users record updated successfully' });
  } catch (error) {
    console.error('Error updating user record', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



