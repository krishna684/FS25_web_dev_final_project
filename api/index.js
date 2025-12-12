const mongoose = require('mongoose');
const { app, configureRoutes } = require('../app');

// Configure routes
configureRoutes(app);

// MongoDB connection (cached for serverless)
// Note: In serverless options, we might want less buffering
const mongooseOptions = {
  maxPoolSize: 1, // Serverless needs fewer connections per lambda
  serverSelectionTimeoutMS: 5000,
  retryWrites: true,
};

let cachedDb = null;

async function connectDB() {
  if (cachedDb) return cachedDb;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing');
  }

  const conn = await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
  cachedDb = conn;
  return cachedDb;
}

// Vercel serverless handler
module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(500).json({ error: 'Database Connection Failed' });
  }
  return app(req, res);
};

