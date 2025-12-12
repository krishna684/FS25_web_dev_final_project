const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';
const NEW_USER = {
    name: 'A', // Too short (min 2)
    email: `debug_${Date.now()}@taskflow.com`,
    password: 'password123'
};

async function testSignup() {
    try {
        console.log('Attempting Signup for:', NEW_USER.email);
        const res = await axios.post(`${BASE_URL}/register`, NEW_USER);
        console.log('✅ Signup Successful:', res.data);
    } catch (error) {
        console.error('❌ Signup Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testSignup();
