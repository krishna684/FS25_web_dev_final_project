require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables');
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error('FATAL ERROR: MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

const app = express();

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const teamRoutes = require('./routes/teamRoutes');
const teamTaskRoutes = require('./routes/teamTaskRoutes');
const commentRoutes = require('./routes/commentRoutes');

const rateLimit = require('express-rate-limit');
const notificationRoutes = require('./routes/notificationRoutes');
const activityRoutes = require('./routes/activityRoutes');
const searchRoutes = require('./routes/searchRoutes');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(express.json());

// CORS configuration for both local development and Vercel
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
];

// Add FRONTEND_URL if it's defined (for Vercel/production)
if (process.env.FRONTEND_URL && !allowedOrigins.includes(process.env.FRONTEND_URL)) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(null, true); // Allow for now, log warnings instead
    }
  },
  credentials: true
}));

// Apply rate limiting to auth routes
app.use('/api/auth', limiter, authRoutes);

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);

// Nested routes:
// /api/teams/:teamId/tasks
// /api/teams/:teamId/tasks
app.use('/api/teams/:teamId/tasks', teamTaskRoutes);
// /api/teams/:teamId/activity
app.use('/api/teams/:teamId/activity', activityRoutes);

// Global Activity Route
app.use('/api/activity', activityRoutes);

// /api/tasks/:taskId/comments
app.use('/api/tasks/:taskId/comments', commentRoutes);

// Mongoose connection
const mongooseOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
};

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('MongoDB Connected');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
}

app.get('/', (req, res) => {
  res.send('Backend running');
});

startServer();

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
