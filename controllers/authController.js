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

async function loginUser(req, res) {
  const { user_name, password } = req.body;

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('user_name', sql.NVarChar(50), user_name)
      .input('password', sql.NVarChar(50), password)
      .query('SELECT * FROM users WHERE user_name = @user_name AND password = @password');

    if (result.recordset.length > 0) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
    
    await pool.close();
  } catch (err) {
    console.error('SQL error:', err.message);
    res.status(500).send('Internal server error');
  }
}

module.exports = {
  loginUser
};
