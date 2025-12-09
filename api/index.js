require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

// Routes
const authRoutes = require('../routes/authRoutes');
const taskRoutes = require('../routes/taskRoutes');
const teamRoutes = require('../routes/teamRoutes');
const teamTaskRoutes = require('../routes/teamTaskRoutes');
const commentRoutes = require('../routes/commentRoutes');
const notificationRoutes = require('../routes/notificationRoutes');
const activityRoutes = require('../routes/activityRoutes');
const searchRoutes = require('../routes/searchRoutes');

app.use('/api/auth', limiter, authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/teams/:teamId/tasks', teamTaskRoutes);
app.use('/api/teams/:teamId/activity', activityRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/tasks/:taskId/comments', commentRoutes);

// MongoDB connection (cached for serverless)
let cachedDb = null;

async function connectDB() {
  if (cachedDb) return cachedDb;
  
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  cachedDb = conn;
  return cachedDb;
}

// Vercel serverless handler
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
