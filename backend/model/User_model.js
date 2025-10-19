const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const user_schema = mongoose.Schema({
    username:
    {
        type:String,
        required:true
    },
    password:
    {
        type:String,
        required:true
    },
    email:
    {
        type:String,
        required:true,
        match:[/^\S+@\S+\.\S+$/, "Please input a valid email address"],
        unique:true,
        trim: true
    },
    isAdmin:
    {
        type:Boolean,
        default:false
    },
    age:
    {
        type:Number,
        required:true,
        min:[0, "Age must be a positive number"],
        max: [500, "Age seems invalid"]
    }


},{timestamps:true})

// 🔹 Hash password before saving
user_schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});



const user_model = mongoose.model("user",user_schema)

module.exports = user_model