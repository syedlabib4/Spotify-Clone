const userModel=require("../models/user.model")
   const jwt = require("jsonwebtoken")
   const bcrypt = require('bcrypt');
require("dotenv").config()

async function signup(req,res){

const {username,email,password,role="user"}=req.body

const UserExist=await userModel.findOne({
    $or:[
{username},
{email}
    ]
})

const hash =await bcrypt.hash(password,10)
if (UserExist) {
  return res.status(409).json({
    message: "user already exists"
  })
}else{

    const user=await userModel.create({
        username,
        email,
        password:hash,
        role
    })


const token = jwt.sign(
  { id: user._id,role:user.role },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
)

res.cookie("token", token, {
  maxAge: 3600000,
  sameSite: 'lax'
})

    res.status(201).json({
        message:"user registered succesfully",
        user,
        token
    })
}


}


async function login(req,res){
const {username,email,password}=req.body

const user=await userModel.findOne({

    $or:[
        {username},
        {email}
    ]
})

if(!user){
    return res.status(401).json({message:"Invalid credentials"})
}

const isPasswordValid=await bcrypt.compare(password,user.password)


if(!isPasswordValid){
     return res.status(401).json({message:"Invalid credentials"})
}

const token = jwt.sign(
  { id: user._id,role:user.role },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
)

res.cookie("token", token, {
  maxAge: 3600000,
  sameSite: 'lax'
})

  res.status(200).json({
        message:"user log in succesfully",
        _id:user._id,
        username:user.username,
        email:user.email,
        role:user.role,
        token
    })
}


async function logout(req,res){
res.clearCookie("token")
    res.status(200).json({
message:"user log out successfully"
    })


}
module.exports={signup,login,logout}















