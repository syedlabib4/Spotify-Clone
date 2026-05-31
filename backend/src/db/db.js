const mongoose=require("mongoose")

const MONGO = process.env.MONGO ? process.env.MONGO.replace(/["']/g, "").trim() : "";

async function connectDB(){
try{
await mongoose.connect(MONGO)
console.log("database is connected")

}catch(err){
  console.log("database is not connected", err.message)
  if (!process.env.VERCEL) {
    process.exit(1)
  }
}
}

module.exports=connectDB