const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const TEST_USER = {
    email: 'test@taskflow.com',
    password: 'password123'
};

async function testDashboard() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, TEST_USER);
        const token = loginRes.data.token;
        console.log('✅ Login Successful');

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Get Tasks
        console.log('Fetching Tasks...');
        try {
            const taskRes = await axios.get(`${BASE_URL}/tasks`, config);
            console.log(`✅ Fetched ${taskRes.data.length} tasks`);
        } catch (err) {
            console.error('❌ Failed to fetch tasks:', err.response ? err.response.data : err.message);
        }

        // 3. Get Teams
        console.log('Fetching Teams...');
        try {
            const teamRes = await axios.get(`${BASE_URL}/teams`, config);
            console.log(`✅ Fetched ${teamRes.data.length} teams`);
        } catch (err) {
            console.error('❌ Failed to fetch teams:', err.response ? err.response.data : err.message);
        }

    } catch (error) {
        console.error('❌ Critical Failure:', error.message);
    }
}

testDashboard();
