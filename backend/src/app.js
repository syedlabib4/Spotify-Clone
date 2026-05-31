const express =require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const cookieParser=require("cookie-parser")
const app=express()
const auth=require("./routes/auth.route")
const userModel=require("./models/user.model")
const musicRouter=require("./routes/music.route")

require("dotenv").config()

// CORS configuration for development and production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174', 
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:3000',
  'https://spotify-clone-labib.netlify.app',
  'https://spotify-fawn-theta.vercel.app',
  process.env.FRONTEND_URL || ''
].filter(url => url !== '');

app.use(cors({ 
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || process.env.VERCEL) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in production for now
    }
  },
  credentials: true 
}))
app.use(express.json())
app.use(cookieParser())

// Normalize API path prefixes for local development vs Vercel serverless functions
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    req.url = req.url.replace('/api', '');
  }
  next();
});

// Diagnostic health endpoint
app.get("/health", (req, res) => {
  const mongoState = mongoose.connection.readyState;
  const stateMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    status: 'ok',
    mongoState: stateMap[mongoState] || 'unknown',
    mongoStateCode: mongoState,
    mongoEnvExists: !!process.env.MONGO,
    mongoEnvPrefix: process.env.MONGO ? process.env.MONGO.substring(0, 20) + '...' : 'NOT SET',
    vercelEnv: process.env.VERCEL || 'not on vercel',
    nodeEnv: process.env.NODE_ENV || 'not set'
  });
});

app.use("/auth",auth)
app.use("/music",musicRouter)


// Global error handler middleware
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
    stack: err.stack
  });
});

module.exports=app