const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';
const TEST_USER = {
    name: 'Test User',
    email: 'test@taskflow.com',
    password: 'password123'
};

async function createTestUser() {
    try {
        console.log('Creating Test User...');
        const regRes = await axios.post(`${BASE_URL}/register`, TEST_USER);
        console.log('✅ Test User Created:', regRes.data.user.email);
    } catch (error) {
        if (error.response && error.response.status === 409) {
            console.log('✅ Test User already exists.');
        } else {
            console.error('❌ Failed to create user:', error.message);
            process.exit(1);
        }
    }
}

// Wait for server to start
setTimeout(createTestUser, 5000);
