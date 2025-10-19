const express = require("express")
const {connect_DB} = require("./config/connect_DB")
const app = express()
const dotenv = require("dotenv")
dotenv.config()
const user_route = require("./routes/user_routes")
const bmi_route = require("./routes/bmi_routes")
const cookieparser = require("cookie-parser")
const cors = require("cors");
app.use(cors());

app.use(cookieparser())

app.use(express.json())

app.use(cors({
    origin: "http://127.0.0.1:5500",  // or "http://localhost:5500"
    credentials: true
}));

app.get("/", (req,res) =>{
    res.send("Hello World! BMI Calculator API is running 🚀")
})

app.use(user_route)
app.use(bmi_route)

// 404 Middleware
app.use((req, res, next) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Logs the full error details for developers

  res.status(err.status || 500).json({
    message: err.message || "Something went wrong on the server",
  });
});

const start_server = async() =>{
    try{
        await connect_DB()
        app.listen(3000, () =>{
            console.log("Server running on http://localhost:3000")

    })
    }
    catch(error){
        console.error("Failed to start server:", error.message)
        process.exit(1)
    }
    
    
}

start_server()