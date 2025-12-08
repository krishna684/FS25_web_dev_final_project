const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const TEST_USER = {
    email: 'alice@example.com', // From seed
    password: 'Password123!'
};

async function testSearch() {
    try {
        console.log('Logging in...');
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, TEST_USER);
        const token = loginRes.data.token;
        console.log('✅ Login Successful');

        const headers = { Authorization: `Bearer ${token}` };

        // Test 1: Search for Task
        console.log('\n1. Searching for "Math"... (Task)');
        const mathRes = await axios.get(`${BASE_URL}/search?q=Math`, { headers });
        if (mathRes.data.tasks.find(t => t.title.includes('Math'))) {
            console.log('✅ Found Task: "Math"');
        } else {
            console.error('❌ Task "Math" not found', mathRes.data);
        }

        // Test 2: Search for Team
        console.log('\n2. Searching for "CS"... (Team)');
        const csRes = await axios.get(`${BASE_URL}/search?q=CS`, { headers });
        if (csRes.data.teams.find(t => t.name.includes('CS'))) {
            console.log('✅ Found Team: "CS"');
        } else {
            console.error('❌ Team "CS" not found', csRes.data);
        }

        // Test 3: Search for User
        console.log('\n3. Searching for "Bob"... (User)');
        const bobRes = await axios.get(`${BASE_URL}/search?q=Bob`, { headers });
        if (bobRes.data.users.find(u => u.name.includes('Bob'))) {
            console.log('✅ Found User: "Bob"');
        } else {
            console.error('❌ User "Bob" not found', bobRes.data);
        }

    } catch (error) {
        console.error('❌ Test Failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

testSearch();
