const express = require("express")
const route = express.Router()
const {register,log_in,update_user,get_users} = require("../controller/user_controller")
const {authenticate,isAdmin} = require("../Middleware/authenticate")


route.post("/register",register)
route.post("/log-in",log_in)
route.put("/update_user",authenticate,update_user)
route.get("/get_user",get_users)

module.exports = route