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

exports.createSpInfo = async (req, res) => {
    const {
      org_name,
      head_name,
      mobile,
      service_details,
      office_number,
      email,
      website,
      address,
      category_id,
      reference_id
    } = req.body;
  
    try {
      const pool = await sql.connect(config);
  
      const currentYear = moment().format('YYYY');
  
      // Count the number of existing records to generate a new reference number
      const result = await pool.request().query('SELECT COUNT(*) AS userCount FROM service_provider_info');
      const userCount = result.recordset[0].userCount;
  
      // Generate the reference number using the 'svasp' prefix, current year, and incrementing number
      const reference_number = `svasp${currentYear}${String(userCount + 1).padStart(0, '0')}`;
  
      await pool.request()
        .input('reference_number', sql.VarChar(255), reference_number)
        .input('org_name', sql.VarChar(255), org_name)
        .input('head_name', sql.VarChar(255), head_name)
        .input('mobile', sql.VarChar(15), mobile)
        .input('service_provide', sql.VarChar(255), service_details)
        .input('office_number', sql.VarChar(15), office_number)
        .input('email', sql.VarChar(255), email)
        .input('website', sql.VarChar(255), website)
        .input('address', sql.VarChar(255), address)
        .input('category_id', sql.Int, category_id)
        .input('reference_id', sql.Int, reference_id)
        .query(`
          INSERT INTO service_provider_info (reference_number, org_name, head_name, mobile, service_provide, office_number, email, website, address, category_id, reference_id)
          VALUES (@reference_number, @org_name, @head_name, @mobile, @service_provide, @office_number, @email, @website, @address, @category_id, @reference_id);
        `);
  
      res.status(201).json({ message: 'Provider created successfully', reference_number });
    } catch (error) {
      console.error('Error creating Provider:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

exports.getSpInfo = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM service_provider_info');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching Providers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getSpInfoById = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM service_provider_info WHERE id = @id;');

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ message: 'Provider not found' });
    }
  } catch (error) {
    console.error('Error fetching provider by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateSpInfoById = async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM service_provider_info WHERE id = @id;');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Provider not found' });
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
      UPDATE service_provider_info
      SET ${updateQuery}
      WHERE id = @id;
    `);

    res.json({ message: 'Provider updated successfully' });
  } catch (error) {
    console.error('Error updating provider:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteSpInfoById = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM service_provider_info WHERE id = @id;');

    res.json({ message: 'Provider deleted successfully' });
  } catch (error) {
    console.error('Error deleting provider:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};