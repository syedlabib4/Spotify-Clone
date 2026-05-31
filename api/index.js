const app = require('../backend/src/app');
const connectDB = require('../backend/src/db/db');

// Cache the connection promise so we only connect once across warm invocations
let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  return app(req, res);
};
