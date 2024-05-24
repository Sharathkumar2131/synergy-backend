const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const usersRoutes = require('./Routers/userRouter');
const authRoutes = require('./Routers/authRouter');
const studentRoutes = require('./Routers/StudentRoutes');
const patientRoutes = require('./Routers/PatientRoutes');
const legalRoutes = require('./Routers/legalRoutes');
const matrymonyRoutes = require('./Routers/matrymonyRoutes');
const serviceCodeRoutes = require('./Routers/serviceCodeRoutes');
const serviceTypeRoutes = require('./Routers/serviceTypesRoutes');
const empRoutes = require('./Routers/empRouter');

app.use(bodyParser.json());

// Routes
app.use('/users', usersRoutes);
// app.use('/students', studentRoutes);
// app.use('/patients', patientRoutes);
// app.use('/legal', legalRoutes);
// app.use('/matrymony', matrymonyRoutes);
app.use('/auth', authRoutes);
app.use('/servicecodes', serviceCodeRoutes);
app.use('/servicetypes', serviceTypeRoutes);
app.use('/emp', empRoutes);
app.get('/', (req, res) => {
  res.send("welcome to my world")
})
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
