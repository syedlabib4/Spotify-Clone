const mongoose=require("mongoose")

const MONGO = process.env.MONGO ? process.env.MONGO.replace(/["']/g, "").trim() : "";

async function connectDB(){
try{
console.log("Attempting MongoDB connection...");
console.log("MONGO env exists:", !!MONGO);
console.log("MONGO prefix:", MONGO ? MONGO.substring(0, 25) + "..." : "EMPTY");
await mongoose.connect(MONGO, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 10000,
})
console.log("database is connected")

}catch(err){
  console.log("database is not connected", err.message)
  throw err; // Re-throw so caller knows connection failed
}
}

module.exports=connectDB