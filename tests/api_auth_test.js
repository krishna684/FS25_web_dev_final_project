const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';
const TEST_USER = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123'
};

async function testAuth() {
    try {
        console.log('1. Testing Registration...');
        const regRes = await axios.post(`${BASE_URL}/register`, TEST_USER);
        console.log('✅ Registration Successful:', regRes.data.user.email);
        const token = regRes.data.token;

        console.log('\n2. Testing Login...');
        const loginRes = await axios.post(`${BASE_URL}/login`, {
            email: TEST_USER.email,
            password: TEST_USER.password
        });
        console.log('✅ Login Successful:', loginRes.data.user.email);

        console.log('\n3. Testing Get Profile...');
        const profileRes = await axios.get(`${BASE_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Profile Retrieval Successful:', profileRes.data.user.name);

    } catch (error) {
        console.error('❌ Test Failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

testAuth();
