require("dotenv").config()
const app = require('../backend/src/app');
const connectDB = require('../backend/src/db/db');

// Connect to database
connectDB()

module.exports = app;
