const app=require("./app")
require("dotenv").config()
const connectDB=require("./db/db")

const port=process.env.PORT || 5000

// Only listen if not in Vercel (serverless environment)
if (!process.env.VERCEL) {
  app.listen(port,()=>{
      console.log(`server is connected  ${port}`)
  })
  connectDB()
}

module.exports = app