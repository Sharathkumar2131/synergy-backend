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
  const { userId, user_roll } = req.body;

  // Ensure userId is parsed as an integer
  const parsedUserId = parseInt(userId);

  // Check if userId is a valid integer
  if (isNaN(parsedUserId)) {
    return res.status(400).json({ message: 'Invalid userId. Must be a valid integer.' });
  }

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('userId', sql.Int, parsedUserId) // Use parsed integer value
      .input('userRole', sql.NVarChar(50), user_roll)
      .query('SELECT * FROM Users WHERE userId = @userId AND user_roll = @userRole');

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
