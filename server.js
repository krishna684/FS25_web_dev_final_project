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
  retryWrites: true,
  w: 'majority',
};

// Track connection state
let isConnected = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_INTERVAL = 5000; // 5 seconds

// Watchdog timer for monitoring connection health
let watchdogTimer = null;

function startWatchdog() {
  clearInterval(watchdogTimer);
  watchdogTimer = setInterval(async () => {
    if (!isConnected) {
      console.warn('⚠ Watchdog: MongoDB still disconnected. Attempting recovery...');
      await attemptReconnect();
    } else {
      reconnectAttempts = 0; // Reset counter on successful connection
    }
  }, RECONNECT_INTERVAL);
}

async function attemptReconnect() {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.error('✗ Max reconnection attempts reached. Manual intervention required.');
    return;
  }
  
  reconnectAttempts++;
  console.log(`⚠ Reconnection attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}...`);
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('✓ Database reconnected successfully!');
    reconnectAttempts = 0;
  } catch (err) {
    console.error(`✗ Reconnection failed:`, err.message);
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      console.log(`  Retrying in ${RECONNECT_INTERVAL / 1000} seconds...`);
    }
  }
}

mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log('✓ MongoDB connected successfully');
  startWatchdog(); // Start/restart watchdog on connection
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('⚠ MongoDB disconnected. Watchdog activated.');
  startWatchdog();
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  console.log('✓ MongoDB reconnected');
  reconnectAttempts = 0;
});

mongoose.connection.on('error', err => {
  isConnected = false;
  console.error('✗ MongoDB connection error:', err.message);
  if (err.reason) {
    console.error('  Reason:', err.reason);
  }
  startWatchdog();
});

// Middleware to check database connection
app.use((req, res, next) => {
  if (!isConnected) {
    return res.status(503).json({ 
      error: 'Database connection lost. Server is attempting recovery...',
      reconnectAttempts: reconnectAttempts,
      status: 'reconnecting'
    });
  }
  next();
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('✓ MongoDB Connected');
    startWatchdog(); // Start watchdog after initial connection

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ API available at http://localhost:${PORT}/api`);
      console.log(`✓ Watchdog monitoring: Active (checks every ${RECONNECT_INTERVAL / 1000}s)`);
    });

    // Handle server errors
    server.on('error', (err) => {
      console.error('✗ Server error:', err);
      process.exit(1);
    });
  } catch (err) {
    console.error('✗ Failed to connect to MongoDB:', err.message);
    console.error('  Check your MONGODB_URI in .env file');
    console.error('  Connection string:', process.env.MONGODB_URI.split('@')[0] + '@...');
    console.log('\n⚠ Watchdog will attempt reconnection...');
    startWatchdog(); // Start watchdog even on initial failure
    
    // Start server anyway so watchdog can keep trying
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`✓ Server started on port ${PORT} (waiting for DB reconnection)`);
    });
  }
}

app.get('/', (req, res) => {
  res.json({
    message: 'Backend running',
    status: isConnected ? 'connected' : 'disconnected',
    database: isConnected ? 'MongoDB connected' : 'MongoDB disconnected'
  });
});

startServer();

process.on('SIGINT', async () => {
  console.log('\n⚠ Shutting down gracefully...');
  clearInterval(watchdogTimer); // Stop watchdog
  await mongoose.connection.close();
  console.log('✓ MongoDB connection closed');
  process.exit(0);
});
