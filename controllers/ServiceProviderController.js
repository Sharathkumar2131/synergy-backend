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

exports.createProvider = async (req, res) => {
  const { prefix, org_name, head_name, mobile, service_provide, address, category_id, reference_id } = req.body;

  try {
      const pool = await sql.connect(config);

      const currentYear = moment().format('YYYY');

      const result = await pool.request().query('SELECT COUNT(*) AS userCount FROM service_providers');
      const userCount = result.recordset[0].userCount;

      const svaid = `${prefix}${currentYear}${String(userCount + 1).padStart(0, '0')}`;

      await pool.request()
          .input('svaid', sql.VarChar(255), svaid)
          .input('org_name', sql.VarChar(255), org_name)
          .input('head_name', sql.VarChar(255), head_name)
          .input('mobile', sql.VarChar(20), mobile)
          .input('service_provide', sql.VarChar(255), service_provide)
          .input('category_id', sql.Int, category_id)
          .input('reference_id', sql.Int, reference_id)
          .input('address', sql.Text, address)
          .query(`
              INSERT INTO service_providers (svaid, org_name, head_name, mobile, service_provide, address, category_id, reference_id)
              VALUES (@svaid, @org_name, @head_name, @mobile, @service_provide, @address, @category_id, @reference_id);
          `);

      res.status(201).json({ message: 'Provider created successfully', svaid });
  } catch (error) {
      console.error('Error creating Provider:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getProviders = async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM service_providers');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching Providers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getProviderById = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM service_providers WHERE id = @id;');

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

exports.updateProviderById = async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM service_providers WHERE id = @id;');

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
      UPDATE service_providers
      SET ${updateQuery}
      WHERE id = @id;
    `);

    res.json({ message: 'Provider updated successfully' });
  } catch (error) {
    console.error('Error updating provider:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteProviderById = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM service_providers WHERE id = @id;');

    res.json({ message: 'Provider deleted successfully' });
  } catch (error) {
    console.error('Error deleting provider:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};