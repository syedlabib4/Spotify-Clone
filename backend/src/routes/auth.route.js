const express=require("express")

const router=express.Router()
const {signup,login, logout}=require("../controller/auth.controller")
router.post("/register",signup)
router.post("/signin",login)
router.post("/logout",logout)





module.exports=router