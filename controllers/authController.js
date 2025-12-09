const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const normalizedEmail = email?.toLowerCase().trim();

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }
        // Check password strength
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        if (!hasUpperCase || !hasLowerCase || !hasNumber) {
            return res.status(400).json({ 
                error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new User({
            name,
            email: normalizedEmail,
            passwordHash,
        });

        const savedUser = await newUser.save();

        // Generate JWT
        const token = jwt.sign(
            { userId: savedUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
            },
        });
    } catch (err) {
        console.error('Registration Error:', err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ error: messages.join(', ') });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email?.toLowerCase().trim();

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        user.lastLoginAt = new Date();
        await user.save();

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatarUrl: user.avatarUrl,
            },
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get current user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
