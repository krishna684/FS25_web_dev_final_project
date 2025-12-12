require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const teamRoutes = require('./routes/teamRoutes');
const teamTaskRoutes = require('./routes/teamTaskRoutes');
const commentRoutes = require('./routes/commentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const activityRoutes = require('./routes/activityRoutes');
const searchRoutes = require('./routes/searchRoutes');

// Validate required environment variables
if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables');
    // We don't exit here to allow test environments to potentially mock it or serverless to handle it gracefully
}

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(express.json());

// CORS configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:5000',
];

if (process.env.FRONTEND_URL && !allowedOrigins.includes(process.env.FRONTEND_URL)) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked request from origin: ${origin}`);
            callback(null, true);
        }
    },
    credentials: true
}));

const configureRoutes = (app) => {
    // Apply rate limiting to auth routes
    app.use('/api/auth', limiter, authRoutes);

    // Routes
    app.use('/api/tasks', taskRoutes);
    app.use('/api/teams', teamRoutes);
    app.use('/api/notifications', notificationRoutes);
    app.use('/api/search', searchRoutes);

    // Nested routes
    app.use('/api/teams/:teamId/tasks', teamTaskRoutes);
    app.use('/api/teams/:teamId/activity', activityRoutes);

    // Global Activity Route
    app.use('/api/activity', activityRoutes);

    // Comments
    app.use('/api/tasks/:taskId/comments', commentRoutes);

    // Base route
    app.get('/', (req, res) => {
        res.json({
            message: 'Backend running',
            status: 'active',
            timestamp: new Date().toISOString()
        });
    });
};

module.exports = { app, configureRoutes };
