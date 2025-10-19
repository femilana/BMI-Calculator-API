const BMI_model = require("../model/BMI_model")

const BMI_cal = async(req,res,next) =>{
    try{
        const {height,weight,unit} = req.body
        const {id} = req.user

        const check_user = await BMI_model.findOne({user:id})

        if(check_user){
            return res.status(400).json({ message: "User Record already exist, Kindly procced to update BMI record" })
        }

        if(!height || height === 0 || !weight || weight === 0 || !unit){
            return res.status(400).json({ message: "Kindly provide accurate data" })
        }
        let bmi
        let category
        let healthtip

        if(unit === "metric"){
            bmi = weight / (height * height)
        }
        if(unit === "imperial"){
            bmi = weight * 730 / (height *height)
        }
        if(bmi < 18.5){
            category = "Underweight"
            healthtip = "Eat more balanced meals with proteins, healthy fats, and carbs. Consider strength training to gain muscle mass."
        }
        else if(bmi >= 18.5 && bmi <= 24.9){
            category = "Normal weight"
            healthtip = "Great job! Maintain your weight through regular exercise and a balanced diet."
        }
        else if(bmi >= 25 && bmi <= 29.9){
            category = "Overweight"
            healthtip = "Incorporate more physical activity like brisk walking, and watch your calorie intake to gradually reach a healthier weight."
        }
        else{
            category = "Obese"
            healthtip = "Consult a healthcare professional. Start with small daily exercises and adopt a nutrient-rich diet low in sugar and saturated fat."
        }
        const Create_bmi = new BMI_model({
            weight,
            height,
            unit:unit || "metric",
            category,
            user:id,
            bmi:bmi.toFixed(2)

        })
        const save_bmi = await Create_bmi.save()

        await save_bmi.populate("user", "username email")

        return res.json({
            message: "BMI calculated and saved successfully",
            bmi: bmi.toFixed(2),
            category,
            user:save_bmi.user,
            healthtip
    });
    }
    catch(error){
        next(error)
    }

}

const BMI_History = async(req,res,next) =>{
    try{
        //Find all BMI results from the database
        const history = await BMI_model.find()

        //If no history exists, send a message
        if(history.length === 0){
            return res.json({ message: "No BMI records found" })
        }

        //Send the history back as JSON
        return res.json({ results: history })
    }
    catch(error){
        next(error)
    }
}

const recentHistory = async (req, res, next) => {
  try {
    // Find all BMI results, sorted by creation date (newest first), limit to 5
    const recentHistory = await BMI_model.find().sort({ createdAt: -1 }).limit(5);

    if (recentHistory.length === 0) {
      return res.json({ message: "No BMI records found" });
    }

    return res.json({ results: recentHistory });
  } catch (error) {
    next(error)
  }
}

const single_bmi = async(req,res,next) =>{
    try{
        const {id} = req.params

        if(!id){
            return res.status(400).json({ message: "Kindly provide BMI ID" })
        }
        const bmi = await BMI_model.findOne({_id:id})
        if(!bmi){
            return res.status(400).json({ message: "Data not Found" })
        }

         return res.json({ results: bmi })

    }
    catch(error){
        next(error)
    }
}

const delete_bmi = async(req,res,next) =>{
    try{
        const {id} = req.params
        const userID = req.user.id
    
        if(!id){
            return res.status(400).json({ message: "Kindly provide BMI ID" })
        }
        const user_id = await BMI_model.findById(id)

        if(!user_id){
            return res.status(404).json({message: "BMI record not found"})

        }
        if(user_id.user.toString() !== userID){
            return res.status(404).json({ message: "UnAuthorized" })
        }
        const delete_ID = await BMI_model.findByIdAndDelete(id)

       
        return res.json({ message: "BMI record deleted successfully" })
    }
    catch(error){
        next(error)
    }

}

const update_BMI = async (req,res,next) =>{
    try{
        const {bmi_id} = req.params
        const {id} = req.user
        const {weight, height, unit} = req.body

        const check_bmi = await BMI_model.findById(bmi_id)

        if(!check_bmi){
            return res.status(404).json({message:"BMI record not found"})
        }

        if(check_bmi.user.toString() !== id){
            return res.status(404).json({ message: "UnAuthorized" })
        }

        if(!weight || weight === 0 || !height || height === 0 || !unit){
            return res.status(400).json({ message: "Kindly provide accurate data" })

        }

        if(check_bmi){
            check_bmi.weight = weight || check_bmi.weight
            check_bmi.height = height || check_bmi.height
            check_bmi.unit = unit 
        }

        let bmi
        let category
        let healthtip

        if(unit === "metric"){
            bmi = weight / (height * height)
        }
        if(unit === "imperial"){
            bmi = weight * 730 / (height *height)
        }
        if(bmi < 18.5){
            category = "Underweight"
            healthtip = "Eat more balanced meals with proteins, healthy fats, and carbs. Consider strength training to gain muscle mass."
        }
        else if(bmi >= 18.5 && bmi <= 24.9){
            category = "Normal weight"
            healthtip = "Great job! Maintain your weight through regular exercise and a balanced diet."
        }
        else if(bmi >= 25 && bmi <= 29.9){
            category = "Overweight"
            healthtip = "Incorporate more physical activity like brisk walking, and watch your calorie intake to gradually reach a healthier weight."
        }
        else{
            category = "Obese"
            healthtip = "Consult a healthcare professional. Start with small daily exercises and adopt a nutrient-rich diet low in sugar and saturated fat."
        }
       
     
        const update_data = await BMI_model.findByIdAndUpdate(bmi_id,
            {
                height:check_bmi.height,
                weight:check_bmi.weight,
                unit:check_bmi.unit,
                category:category,
                bmi:bmi
            },
            { new: true, runValidators: true })
        
        return res.status(201).json({message:"updated", update_data,healthtip})
    }
    catch(error){
        next(error)
    }
}

const bmi_tracker = async (req, res, next) => {
  try {
    // 1️⃣ Find all BMI records for this user, sorted by creation date (oldest first)
    const records = await BMI_model.find({ user: req.user.id }).sort({ createdAt: 1 });

    if (records.length === 0) {
      return res.json({ message: "No BMI records found. Start by adding your first record!" });
    }

    // 2️⃣ Prepare data for response
    const progress = records.map((record) => ({
      date: record.createdAt.toLocaleDateString(),
      bmi: record.bmi.toFixed(2),
      category: record.category,
    }));

    // 3️⃣ Check if user is improving
    const firstBMI = records[0].bmi;
    const latestBMI = records[records.length - 1].bmi;
    let trendMessage = "";

    if (latestBMI < firstBMI) {
      trendMessage = "🎯 Great job! Your BMI has improved since your first record.";
    } else if (latestBMI > firstBMI) {
      trendMessage = "⚠️ Your BMI has increased. Consider reviewing your diet or activity level.";
    } else {
      trendMessage = "💡 Your BMI has remained stable. Keep maintaining your healthy habits.";
    }

    // 4️⃣ Return progress history
    return res.json({
      message: "BMI progress retrieved successfully ✅",
      progress,
      trendMessage,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {BMI_cal,BMI_History,recentHistory,single_bmi,delete_bmi,update_BMI,bmi_tracker}