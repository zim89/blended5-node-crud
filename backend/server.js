const express = require('express');
const path = require('path');
const configPath = path.join(__dirname, '..', 'config', '.env');
require('dotenv').config({ path: configPath });
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

const connectDb = require('../config/connectDb');
require('colors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1', require('./routes/toysRoutes'));
app.use('*', notFound);
app.use(errorHandler);

const { PORT } = process.env;

connectDb();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.green.italic.bold);
});
