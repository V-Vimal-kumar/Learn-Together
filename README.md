# 📚 LearnTogether – A Collaborative Learning Platform

LearnTogether is a full-stack MERN (MongoDB, Express, React, Node.js) application designed to make learning more interactive and effective by pairing learners together. It combines real-time features, course progress tracking, and a clean UI to enhance the online learning experience.

---

## 🌐 Live Demo -   https://learn-together-weld.vercel.app/

---

## 🚀 Features

* 👥 **User Authentication** (JWT-based, secure login/register)
* 📚 **Browse and Join Courses** with progress tracking
* ✅ **Mark Courses as Completed**
* 🔍 **Search and Filter Courses** easily
* 🧠 **Track Learning Progress** per user
* 🤝 **Request to Pair with Another Learner** for collaboration
* 💬 **Real-Time Messaging Support** (via Socket.IO – coming soon)
* 🔒 **Password Reset with OTP (via email)** support
* 🧾 **Role-based dashboard** and dynamic UI updates

---

## 🛠️ Tech Stack

* **Frontend**: React, Tailwind CSS, Axios, React Router
* **Backend**: Express.js, MongoDB, Mongoose, Node.js
* **Authentication**: JWT + Cookies
* **Deployment**:

  * Frontend: Vercel
  * Backend: Render
* **Extras**:

  * Email (OTP) with Nodemailer
  * Real-time capabilities (with Socket.IO, scalable for future)
  * CORS configuration with environment-based setup

---

## 📁 Project Structure

```
/client     → React frontend (Vite setup)
/server     → Express backend with all APIs and models
```

---

## 🔧 Setup Instructions

### 🖥 Local Development

1. **Clone the repo**

   ```bash
   git clone https://github.com/V-Vimal-kumar/Learn-Together
   cd learn-together
   ```

2. **Frontend Setup**

   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Backend Setup**

   ```bash
   cd server
   npm install
   npm run dev
   ```

4. Create `.env` file inside `/server`:

   ```env
   MONGO_URI=your_mongodb_connection
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

---

## ⚙️ Environment Variables

```env
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password_or_app_password
```

---

## 🙋‍♂️ Author

Developed by Vimal Kumar V
Feel free to connect:  https://www.linkedin.com/in/vimal-kumar-v- | https://vimalportfolio25.netlify.app/


---

## 🪄 Future Enhancements

* ✅ Add Admin Panel
* 🔄 Add Socket-based real-time chat
* 📅 Schedule-based pairing support
* 📊 Analytics for users' learning stats
  
