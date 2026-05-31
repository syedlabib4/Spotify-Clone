const app = require('../backend/src/app');
const connectDB = require('../backend/src/db/db');

// Cache the connection promise so we only connect once across warm invocations
let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error("Failed to connect to MongoDB:", err.message);
      return res.status(500).json({
        message: "Database connection failed",
        error: err.message,
        mongoEnvExists: !!process.env.MONGO,
        mongoPrefix: process.env.MONGO ? process.env.MONGO.substring(0, 20) + "..." : "NOT SET"
      });
    }
  }
  return app(req, res);
};
