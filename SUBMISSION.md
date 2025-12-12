# TaskFlow - Final Project Submission

## 📹 Video Presentation

**YouTube Link:** https://youtu.be/lad5rQogBhE

---

## 👥 Team Members

| Name | Role |
|------|------|
| Varshith Pulluri | Frontend Lead & UI Engineer |
| Krishna Karra | Backend Lead & API Engineer |
| Nick Gremaud | Database & Backend Integration Engineer |
| Kayln Shaw | Full-Stack Developer & Documentation Lead |

---

## 🚀 How to Run the Application

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (local installation or MongoDB Atlas account)

### Step-by-Step Instructions

1. **Extract the ZIP file** to a folder of your choice

2. **Open a terminal** in the extracted folder (where `package.json` is located)

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Environment file** 
   - The `.env` file is already included in this submission
   - Database is already connected to MongoDB Atlas (cloud)

5. **Start the application**
   ```bash
   npm run dev
   ```

6. **Access the app**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

---

## 🔐 Demo Login Credentials

After running `npm run seed`, you can log in with any of these accounts:

| Email | Password |
|-------|----------|
| alice@example.com | Password123! |
| bob@example.com | Password123! |
| charlie@example.com | Password123! |
| david@example.com | Password123! |
| emma@example.com | Password123! |
| frank@example.com | Password123! |

---

## 📁 Project Structure

```
├── src/                 # React frontend (Vite)
├── controllers/         # Express route handlers
├── models/              # Mongoose schemas
├── routes/              # Express API routes
├── middleware/          # Authentication middleware
├── seeds/               # Database seeding scripts
├── server.js            # Express server entry point
├── app.js               # Express app configuration
└── .env                 # Environment variables (included)
```

---

## ✨ Key Features

- **Personal Task Management** - Create, edit, and track personal tasks
- **Team Collaboration** - Create teams, invite members, assign tasks
- **Kanban Boards** - Visual task management for teams
- **Dashboard** - Overview of tasks, deadlines, and activity
- **Search** - Global search for tasks, teams, and users
- **Dark Mode** - Full dark theme support
- **Notifications** - Real-time activity notifications

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + bcrypt

---

*FS25 Web Development Final Project*
