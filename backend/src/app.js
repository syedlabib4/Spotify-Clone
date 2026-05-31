const express =require("express")
const cors = require("cors")

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
  origin: allowedOrigins,
  credentials: true 
}))
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",auth)
app.use("/api/music",musicRouter)


module.exports=app