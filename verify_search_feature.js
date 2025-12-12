const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');
const Team = require('./models/Team');
const axios = require('axios');
const bcrypt = require('bcrypt');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000/api';

async function verifySearch() {
    try {
        console.log('1. Connecting to DB...');
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('2. Preparing Test Data...');
        // Clean up test data
        await User.deleteOne({ email: 'search_test@example.com' });
        await Task.deleteMany({ title: 'Unique Search Task 123' });
        await Team.deleteMany({ name: 'Unique Search Team 123' });

        // Create User
        const passwordHash = await bcrypt.hash('Password123!', 10);
        const user = await User.create({
            name: 'Search Tester',
            email: 'search_test@example.com',
            passwordHash
        });

        // Create Task
        await Task.create({
            title: 'Unique Search Task 123',
            description: 'For testing search',
            owner: user._id,
            status: 'todo',
            createdBy: user._id
        });

        // Create Team
        await Team.create({
            name: 'Unique Search Team 123',
            members: [{ user: user._id, role: 'owner' }],
            owner: user._id
        });

        console.log('3. Logging in...');
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'search_test@example.com',
            password: 'Password123!'
        });
        const token = loginRes.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        console.log('4. Performing Search...');

        // Test Task
        const taskRes = await axios.get(`${BASE_URL}/search?q=Unique Search Task`, { headers });
        if (taskRes.data.tasks.some(t => t.title === 'Unique Search Task 123')) {
            console.log('✅ Task Search: Passed');
        } else {
            console.error('❌ Task Search: Failed', taskRes.data);
            throw new Error('Task not found');
        }

        // Test Team
        const teamRes = await axios.get(`${BASE_URL}/search?q=Unique Search Team`, { headers });
        if (teamRes.data.teams.some(t => t.name === 'Unique Search Team 123')) {
            console.log('✅ Team Search: Passed');
        } else {
            console.error('❌ Team Search: Failed', teamRes.data);
            throw new Error('Team not found');
        }

        // Test User (Search for self)
        const userRes = await axios.get(`${BASE_URL}/search?q=Search Tester`, { headers });
        if (userRes.data.users.some(t => t.name === 'Search Tester')) {
            console.log('✅ User Search: Passed');
        } else {
            console.error('❌ User Search: Failed', userRes.data);
            throw new Error('User not found');
        }

        console.log('✅ ALL CHECKS PASSED');

    } catch (err) {
        console.error('❌ Verification Failed:', err.message);
        if (err.response) console.error(err.response.data);
    } finally {
        await mongoose.disconnect();
    }
}

verifySearch();
