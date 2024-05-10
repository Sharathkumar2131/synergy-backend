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

async function getChaList(req, res) {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM cha');
    res.json(result.recordset);
    await pool.close();
  } catch (err) {
    console.error('SQL error:', err.message);
    res.status(500).send('Internal server error');
  }
}

async function getChaById(req, res) {
  const chaId = req.params.chaId;

  // Extract prefix, year, and sequenceNumber from chaId
  const prefix = chaId.slice(0, 6);
  const year = chaId.slice(6, 10);
  const sequenceNumber = chaId.slice(10);

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('prefix', sql.NVarChar(6), prefix)
      .input('year', sql.NVarChar(4), year)
      .input('sequenceNumber', sql.NVarChar(3), sequenceNumber)
      .query(`
        SELECT *
        FROM cha
        WHERE chaid = @prefix + @year + @sequenceNumber
      `);

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).send('CHA not found');
    }

    await pool.close();
  } catch (err) {
    console.error('SQL error:', err.message);
    res.status(500).send('Internal server error');
  }
}


async function updateCha(req, res) {
  const chaId = req.params.chaId;
  const updatedFields = req.body;

  try {
    const pool = await sql.connect(config);
    const request = pool.request();

    // Prepare to dynamically construct the SET clause
    const setClauses = [];
    Object.keys(updatedFields).forEach((key) => {
      const columnValue = updatedFields[key];
      const paramName = key; // Use the field name as the parameter name
      request.input(paramName, sql.NVarChar(sql.MAX), columnValue);
      if (key !== 'id') { // Exclude 'id' from SET clause
        setClauses.push(`${key} = @${paramName}`);
      }
    });

    const updateQuery = `
      UPDATE cha 
      SET ${setClauses.join(', ')}
      WHERE id = @id
    `;

    // Add the 'id' parameter for WHERE clause
    request.input('id', sql.NVarChar(50), chaId);

    // Execute the UPDATE query
    const result = await request.query(updateQuery);

    res.status(200).send('CHA updated successfully');
    await pool.close();
  } catch (err) {
    console.error('SQL error:', err.message);
    res.status(500).send('Internal server error');
  }
}


module.exports = {
  getChaList,
  getChaById,
  updateCha,
};
