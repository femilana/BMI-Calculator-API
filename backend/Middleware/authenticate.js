const jwt = require("jsonwebtoken")

const authenticate = (req,res,next) =>{
    try{
        const {token} = req.cookies

        if(!token){
            return res.status(401).json({ message: "No token, authorization denied" })
        }

        const verify_token = jwt.verify(token,process.env.JWT_SECRET)

        if(!verify_token){
            return res.status(401).json({ message: "Authorization denied" })
        }
        req.user = verify_token
        next()

    }
    catch(error){
        next(error)
    }
}

const isAdmin = (req,res,next) =>{
    try{
        const {isAdmin} = req.user

        if(!isAdmin){
            return res.status(401).json({ message: "Authorization denied, Admins only 🚫" })  
        }
        next()
    }
    catch(error){
        next(error)
    }
}

module.exports = {authenticate,isAdmin}