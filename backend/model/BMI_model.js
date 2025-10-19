const mongoose = require("mongoose")

const BMI_schema = mongoose.Schema({
    height:
    {
        type:Number,
        required:true
    },
    weight:
    {
        type:Number,
        required:true
    },
    unit:
    {
        type:String,
        enum:["metric", "imperial"],
        required:true
    },
    category:
    {
        type:String,
        required:true
    },
    bmi:
    {
        type:Number,
        required:true
    },
    createdAt:
    {
        type:Date,
        default:Date.now
    },
    user:
    {
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true
    }
},{timestamps:true})

const BMI_model = mongoose.model("bmi", BMI_schema)

module.exports = BMI_model