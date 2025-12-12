const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';
const AUTH_URL = 'http://localhost:5001/api/auth';

const USER_1 = { name: 'Lead', email: `lead${Date.now()}@test.com`, password: 'password123' };
const USER_2 = { name: 'Dev', email: `dev${Date.now()}@test.com`, password: 'password123' };

async function testKanban() {
    try {
        // 1. Auth & Team Setup
        console.log('1. Setting up Team...');
        const res1 = await axios.post(`${AUTH_URL}/register`, USER_1);
        const token1 = res1.data.token;
        const userId1 = res1.data.user.id;

        const res2 = await axios.post(`${AUTH_URL}/register`, USER_2);
        const token2 = res2.data.token;
        const userId2 = res2.data.user.id;

        const config1 = { headers: { Authorization: `Bearer ${token1}` } };
        const config2 = { headers: { Authorization: `Bearer ${token2}` } };

        const teamRes = await axios.post(`${BASE_URL}/teams`, { name: 'Kanban Team' }, config1);
        const teamId = teamRes.data._id;
        await axios.post(`${BASE_URL}/teams/join`, { inviteCode: teamRes.data.inviteCode }, config2);

        // 2. Create Team Task
        console.log('\n2. Creating Team Task...');
        const taskRes = await axios.post(`${BASE_URL}/teams/${teamId}/tasks`, {
            title: 'Feature A',
            status: 'todo',
            priority: 'high',
            assignedTo: userId2
        }, config1);
        console.log('✅ Task Created:', taskRes.data.title, 'Assigned to:', taskRes.data.assignedTo?.name);
        const taskId = taskRes.data._id;

        // 3. Move Task (Kanban Drag)
        console.log('\n3. Moving Task to In Progress...');
        const moveRes = await axios.put(`${BASE_URL}/teams/${teamId}/tasks/${taskId}`, {
            status: 'in-progress'
        }, config2);
        console.log('✅ Task Status:', moveRes.data.status);

        // 4. Add Comment
        console.log('\n4. Adding Comment...');
        const commentRes = await axios.post(`${BASE_URL}/tasks/${taskId}/comments`, {
            text: 'Working on it!'
        }, config2);
        console.log('✅ Comment Added:', commentRes.data.text);

        // 5. Verify Comments
        const comments = await axios.get(`${BASE_URL}/tasks/${taskId}/comments`, config1);
        console.log(`✅ Fetched ${comments.data.length} comments`);
        if (comments.data.length !== 1) throw new Error('Comment count mismatch');

    } catch (error) {
        console.error('❌ Kanban Test Failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

testKanban();
