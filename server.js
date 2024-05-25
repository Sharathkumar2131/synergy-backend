const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const usersRoutes = require('./Routers/userRouter');
const authRoutes = require('./Routers/authRouter');
const studentRoutes = require('./Routers/StudentRoutes');
const patientRoutes = require('./Routers/PatientRoutes');
const legalRoutes = require('./Routers/legalRoutes');
const matrymonyRoutes = require('./Routers/matrymonyRoutes');
const serviceCodeRoutes = require('./Routers/serviceCodeRoutes');
const serviceTypeRoutes = require('./Routers/serviceTypesRoutes');
const empRoutes = require('./Routers/empRouter');
const serviceUsers = require('./Routers/ServiceUserRoutes');

app.use('/users', usersRoutes);
app.use('/auth', authRoutes);
app.use('/servicecodes', serviceCodeRoutes);
app.use('/servicetypes', serviceTypeRoutes);
app.use('/', serviceUsers);
app.use('/emp', empRoutes);

// Default route
app.get('/', (req, res) => {
  res.send("Welcome to my world");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
