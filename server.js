const mongoose = require('mongoose');
const { app, configureRoutes } = require('./app');

// Validate required environment variables
if (!process.env.MONGODB_URI) {
  console.error('FATAL ERROR: MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

// Mongoose connection options
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
  startWatchdog();
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
  startWatchdog();
});

// Middleware to check database connection - Injected BEFORE routes
app.use((req, res, next) => {
  if (!isConnected && req.path.startsWith('/api')) { // Only block API requests, allow health check if on root
    return res.status(503).json({
      error: 'Database connection lost. Server is attempting recovery...',
      reconnectAttempts: reconnectAttempts,
      status: 'reconnecting'
    });
  }
  next();
});

// Configure routes after middleware
configureRoutes(app);

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('✓ MongoDB Connected');
    startWatchdog();

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ API available at http://localhost:${PORT}/api`);
      console.log(`✓ Watchdog monitoring: Active (checks every ${RECONNECT_INTERVAL / 1000}s)`);
    });

    server.on('error', (err) => {
      console.error('✗ Server error:', err);
      process.exit(1);
    });
  } catch (err) {
    console.error('✗ Failed to connect to MongoDB:', err.message);
    console.error('  Check your MONGODB_URI in .env file');
    console.log('\n⚠ Watchdog will attempt reconnection...');
    startWatchdog();

    // Start server anyway so watchdog can keep trying
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✓ Server started on port ${PORT} (waiting for DB reconnection)`);
    });
  }
}

startServer();

process.on('SIGINT', async () => {
  console.log('\n⚠ Shutting down gracefully...');
  clearInterval(watchdogTimer);
  await mongoose.connection.close();
  console.log('✓ MongoDB connection closed');
  process.exit(0);
});
