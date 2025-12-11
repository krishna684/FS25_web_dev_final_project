const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const AUTH_URL = 'http://localhost:5000/api/auth';

// User 1
const USER_1 = { name: 'Admin', email: `admin${Date.now()}@test.com`, password: 'password123' };
// User 2
const USER_2 = { name: 'Member', email: `member${Date.now()}@test.com`, password: 'password123' };

async function testTeams() {
    try {
        // 1. Register Users
        console.log('1. Registering Users...');
        const res1 = await axios.post(`${AUTH_URL}/register`, USER_1);
        const token1 = res1.data.token;
        const res2 = await axios.post(`${AUTH_URL}/register`, USER_2);
        const token2 = res2.data.token;
        console.log('✅ Users Registered');

        const config1 = { headers: { Authorization: `Bearer ${token1}` } };
        const config2 = { headers: { Authorization: `Bearer ${token2}` } };

        // 2. Create Team
        console.log('\n2. Creating Team...');
        const teamRes = await axios.post(`${BASE_URL}/teams`, {
            name: 'Alpha Team',
            description: 'The A Team'
        }, config1);
        console.log('✅ Team Created:', teamRes.data.name, 'Code:', teamRes.data.inviteCode);
        const teamId = teamRes.data._id;
        const inviteCode = teamRes.data.inviteCode;

        // 3. Join Team (User 2)
        console.log('\n3. Joining Team...');
        await axios.post(`${BASE_URL}/teams/join`, { inviteCode }, config2);
        console.log('✅ User 2 Joined Team');

        // 4. Get Team Details
        console.log('\n4. Getting Team Details...');
        const detailsRes = await axios.get(`${BASE_URL}/teams/${teamId}`, config1);
        console.log('✅ Team Members:', detailsRes.data.members.length);
        if (detailsRes.data.members.length !== 2) throw new Error('Member count mismatch');

        // 5. Leave Team (User 2)
        console.log('\n5. Leaving Team...');
        await axios.delete(`${BASE_URL}/teams/${teamId}/leave`, config2);
        console.log('✅ User 2 Left Team');

    } catch (error) {
        console.error('❌ Team Test Failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

testTeams();
