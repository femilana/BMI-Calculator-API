🧮 BMI Calculator API
A simple and efficient Body Mass Index (BMI) Calculator API built with Node.js, Express, and Mongoose (MongoDB).
It allows users to calculate their BMI, view health classifications, and manage BMI history.

🚀 Features

✅ Calculate BMI using metric units
✅ Get BMI category (Underweight, Normal, Overweight, Obese)
✅ Save results to MongoDB
✅ Retrieve BMI history or latest record
✅ Delete a BMI record
✅ Structured with MVC architecture

🛠️ Tech Stack
Layer	Technology
Runtime	Node.js
Framework	Express.js
Database	MongoDB
ODM	Mongoose
Middleware	CORS, Express JSON
Environment Config	dotenv
📂 Project Structure
BMI-Calculator/
│
├── backend/
│   ├── index.js                  # Entry point for Express server
│   ├── model/
│   │   ├── userModel.js        # User Schema (email, name, password)
│   │   └── BMI_model.js        # BMI Schema (height, weight, user ref)
│   ├── controller/
│   │   ├── userController.js   # Handles user logic (register, login)
│   │   └── BMI_controller.js   # Handles BMI logic (calculate, get history)
│   ├── route/
│   │   ├── userRoute.js        # Defines user routes
│   │   └── BMI_route.js        # Defines BMI routes
│   ├── config/
│   │   └── db.js               # Database connection setup
│   ├── .env                    # Environment variables
│   ├── package.json
│   └── README.md

🧱 Folder Responsibilities
Folder	Purpose
model/	Defines MongoDB Schemas
controller/	Handles request logic
route/	Manages API endpoints
config/	Handles database connection
app.js	Initializes Express, routes, and middleware

⚙️ Installation and Setup
1️⃣ Clone the Repository
https://github.com/femilana/BMI-Calculator-API.git
cd BMI-Calculator/backend

2️⃣ Install Dependencies
npm install

3️⃣ Setup Environment Variables

Create a .env file inside your backend folder:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/BMI_Calculator

4️⃣ Start the Server
node index.js


You should see:

✅ Server running on http://localhost:5000
✅ MongoDB connected successfully

🧠 API Endpoints
🔹 User Routes
Method	Endpoint	Description
POST	/register	Register a new user
POST	/login	Login user (future use for JWT)
Example Request:
POST /register
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}

🔹 BMI Post Routes

All BMI post routes are protected, meaning you must be authenticated to access them.
Some routes are admin-only (for moderation or deleting other users’ posts).

Method	Endpoint	Middleware	Description
POST	/new-post	authenticate, upload.single('image')	Create a new BMI post with optional image
GET	/all-post	authenticate	Retrieve all BMI posts for authenticated users
GET	/single-post/:id	authenticate	Retrieve a single BMI post by its unique ID
PUT	/update-post/:id	authenticate, upload.single('image')	Update an existing post (text or image)
DELETE	/delete-post/:id	authenticate	Delete your own post by ID
DELETE	/admin-delete/:id	authenticate, autho_Admin	Admin-only route to delete any user’s post
🧩 Example Requests
1️⃣ Create a New BMI Post

POST /new-post

Headers:
Authorization: Bearer <token>

Body (Form-Data):
{
  "title": "Healthy Weight Tips",
  "description": "A detailed guide to maintaining a healthy BMI.",
  "image": <uploaded image file>
}


Response

{
  "message": "Post created successfully",
  "post": {
    "_id": "6726d23...",
    "title": "Healthy Weight Tips",
    "description": "A detailed guide to maintaining a healthy BMI.",
    "image": "uploads/healthy.jpg",
    "user": "6726c8...",
    "createdAt": "2025-10-19T08:15:00.000Z"
  }
}

2️⃣ Retrieve All Posts

GET /all-post

Headers:
Authorization: Bearer <token>


Response

[
  {
    "_id": "6726d23...",
    "title": "BMI and Health",
    "description": "Understanding BMI categories",
    "image": "uploads/bmi.jpg",
    "user": "6726c8...",
    "createdAt": "2025-10-18T09:00:00.000Z"
  },
  {
    "_id": "6726d24...",
    "title": "Fitness Challenge",
    "description": "Join our BMI fitness week!",
    "image": null
  }
]

3️⃣ Update a Post

PUT /update-post/:id

Headers:
Authorization: Bearer <token>

Body (Form-Data):
{
  "title": "Updated Title",
  "description": "Modified description",
  "image": <optional new image file>
}

4️⃣ Delete a Post

DELETE /delete-post/:id

Requires user authentication.

Deletes only the posts belonging to the logged-in user.

5️⃣ Admin Delete

DELETE /admin-delete/:id

Requires both authenticate and autho_Admin middleware.

Allows admins to delete any user’s post.

🔐 Middleware Used
Middleware	Purpose
authenticate	Verifies the JWT token and ensures the user is logged in
autho_Admin	Ensures the user role is “admin” before proceeding
upload.single('image')	Handles image uploads for posts
🗂 Example Upload Directory

Uploaded images are stored inside:

/uploads/


Each uploaded file is saved with a unique filename using Multer.

🧮 BMI Classification Logic
BMI Range	Category
< 18.5	Underweight
18.5 – 24.9	Normal weight
25.0 – 29.9	Overweight
≥ 30.0	Obese

🧾 Summary

✅ All routes secured with JWT-based authentication
✅ Supports image upload via Multer
✅ Admins can delete any post
✅ Users can manage (create, update, delete) their own posts
✅ Clean RESTful design pattern

👨‍💻 Author

Oluwafemi Ogunlana
Backend Developer (Node.js, Express, MongoDB)

GitHub: github.com/femilana

Email: phemeelanaz@gmail.com
