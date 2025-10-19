const express = require("express")
const {authenticate,isAdmin} = require("../Middleware/authenticate")

const route = express.Router()
const {BMI_cal,BMI_History,recentHistory,single_bmi,delete_bmi,update_BMI,bmi_tracker} = require("../controller/bmi_controller")

route.get("/history",authenticate,isAdmin,BMI_History)
route.post('/bmi',authenticate,BMI_cal)
route.get("/recentHistory",recentHistory)
route.get("/single_bmi/:id",authenticate,isAdmin,single_bmi)
route.delete("/delete_bmi/:id",authenticate,delete_bmi)
route.put("/update_bmi/:bmi_id",authenticate,update_BMI)
route.get("/bmi-tracker",authenticate,bmi_tracker)

module.exports = route