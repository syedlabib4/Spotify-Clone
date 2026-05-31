const jwt = require("jsonwebtoken")

function authArtist(req, res, next) {

    // Check cookie first, then Authorization header
    let token = req.cookies.token
    if (!token && req.headers.authorization) {
        token = req.headers.authorization.replace('Bearer ', '')
    }

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (decoded.role !== "artist") {
            return res.status(403).json({
                message: "you dont have access to create music"
            })
        }

        req.user = decoded   // 🔥 important for controller use
        next()               // 🔥 correct place

    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
}



async function authUser(req,res,next){

   // Check cookie first, then Authorization header
   let token = req.cookies.token
   if (!token && req.headers.authorization) {
       token = req.headers.authorization.replace('Bearer ', '')
   }

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

       if(decoded.role!=="user"&& decoded.role!=="artist"){
        return res.status(403).json({
            message:"you dont have access"
        })
       }

        req.user = decoded   // 🔥 important for controller use
        next()               // 🔥 correct place

    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

}


module.exports = { authArtist,authUser }