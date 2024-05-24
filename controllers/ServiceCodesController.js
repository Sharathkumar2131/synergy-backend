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


exports.getServiceCodes = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM service_codes');
    res.json(result.recordset);
    await pool.close();
  } catch (err) {
    console.error('SQL error:', err.message);
    res.status(500).send('Internal server error');
  }
};

exports.getServiceCodesById = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM service_codes WHERE id = @id;');

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset[0]);
    } else {
      res.status(404).json({ message: 'service_codes record not found' });
    }
  } catch (error) {
    console.error('Error fetching service_codes record by ID', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a matrimony record by ID
exports.updateServiceCodesById = async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;

  try {
    const pool = await sql.connect(config);
    const existingRecord = await pool
      .request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM service_codes WHERE id = @id;');

    if (!existingRecord.recordset[0]) {
      return res.status(404).json({ message: 'service_codes record not found' });
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
          UPDATE service_codes
          SET ${updateQuery}
          WHERE id = @id;
      `);

    res.status(200).json({ message: 'service_codes record updated successfully' });
  } catch (error) {
    console.error('Error updating service_codes record', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



