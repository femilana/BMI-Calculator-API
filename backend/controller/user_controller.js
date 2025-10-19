const user_model = require("../model/User_model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const register = async(req,res,next) =>{
    try{
        const {username,password,email,age,isAdmin} = req.body

        //Check if all fields are provided
        if(!username || !password || !email || !age || !isAdmin){
            return res.status(400).json({ message: "All fields are required" })
        }

        //Check if the email already exists
        const existing_user = await user_model.findOne({email})

        if(existing_user){
            return res.status(400).json({ message: "Email already in use" })
        }

        //Create a new user
        const new_user = new user_model({username,password,email,age,isAdmin})

        //Save to database
        await new_user.save()

        return res.status(201).json({
            message: "User registered successfully",
            user_details:
            {
                id:new_user._id,
                email:new_user.email,
                age:new_user.age,
                username:new_user.username
            }
        })

    }
    catch(error){
        next(error)
    }
}

const log_in = async(req,res,next) =>{
    try{
        const {email,password} = req.body

        if(!email || !password){
            return res.status(400).json({ message: "All fields are required" })
        }
        const existing_user = await user_model.findOne({email})

        if(!existing_user){
            return res.status(400).json({ message: "Incorrect Log-in Details" })
        }
        const verify_password = await bcrypt.compare(password,existing_user.password)

        if(!verify_password){
            return res.status(400).json({ message: "Invalid password" })
        }
        
        //Create a token
        const create_token = jwt.sign(
            {
                id:existing_user._id,
                isAdmin:existing_user.isAdmin

            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        res.cookie("token",create_token,
            {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 1000
            }
        )
        return res.status(200).json({ message: "Login successful ✅",
            user_details:
            {
                username:existing_user.username,
                email:existing_user.email,
                age:existing_user.age
            }
         });
    }
    catch(error){
        next(error)
    }
}

const update_user = async(req,res,next) =>{
    try{
        const {username,password,email,age,isAdmin} = req.body
        const {id} = req.user

        if(!id){
            return res.status(400).json({ message: "Kindly Log-In" })
        }
        const existing_user = await user_model.findOne({_id:id})

        if(!existing_user){
            return res.status(400).json({ message: "User not Found" })
        }

        existing_user.username = username || existing_user.username
        existing_user.password = password ||  existing_user.password
        existing_user.age = age || existing_user.age 
        existing_user.email = email || existing_user.email

        await existing_user.save()

        // const update = await user_model.findByIdAndUpdate(id,
        //     {
        //         age:existing_user.age,
        //         username:existing_user.username,
        //         password:existing_user.password,
        //         email: existing_user.email
        //     },
        //     { new: true, runValidators: true }
        // )
        return res.status(200).json({message:"User updated successfully ✅",
            updated_user:
            {
                username: existing_user.username,
                email: existing_user.email,
                age: existing_user.age,
                isAdmin: existing_user.isAdmin
            }
        })
    }
    catch(error){
        next(error)
    }
}

const get_users = async(req,res,next) =>{
    try{
        const user = await user_model.find()

        if(user.length === 0){
            return res.json({ message: "No User record found" })
        }

        return res.status(201).json({user_records:user})
    }
    catch(error){
        next(error)
    }
}

const delete_user = async (req, res, next) => {
  try {
    const { id } = req.user; // from token (logged in user)

    if (!id) {
      return res.status(400).json({ message: "Kindly Log-In" });
    }

    const existing_user = await user_model.findById(id);

    if (!existing_user) {
      return res.status(404).json({ message: "User not Found" });
    }

    await user_model.findByIdAndDelete(id);

    return res.status(200).json({
      message: `${existing_user.username} successfully deleted`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {register,log_in,update_user,get_users}