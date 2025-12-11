const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const AUTH_URL = 'http://localhost:5000/api/auth';

const TEST_USER = {
    name: 'Task Tester',
    email: `task${Date.now()}@test.com`,
    password: 'password123'
};

async function testTasks() {
    try {
        // 1. Auth first
        console.log('1. Registering/Logging in...');
        const authRes = await axios.post(`${AUTH_URL}/register`, TEST_USER);
        const token = authRes.data.token;
        console.log('✅ Auth Successful');

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Create Task
        console.log('\n2. Creating Task...');
        const taskRes = await axios.post(`${BASE_URL}/tasks`, {
            title: 'Test Task',
            description: 'Testing task creation',
            priority: 'high',
            dueDate: new Date().toISOString()
        }, config);
        console.log('✅ Task Created:', taskRes.data.title);
        const taskId = taskRes.data._id;

        // 3. Get Tasks
        console.log('\n3. Fetching Tasks...');
        const getRes = await axios.get(`${BASE_URL}/tasks`, config);
        console.log(`✅ Fetched ${getRes.data.length} tasks`);

        // 4. Update Task
        console.log('\n4. Updating Task...');
        const updateRes = await axios.put(`${BASE_URL}/tasks/${taskId}`, {
            status: 'in-progress',
            completed: true
        }, config);
        console.log('✅ Task Updated, Status:', updateRes.data.status);

        // 5. Delete Task
        console.log('\n5. Deleting Task...');
        await axios.delete(`${BASE_URL}/tasks/${taskId}`, config);
        console.log('✅ Task Deleted');

    } catch (error) {
        console.error('❌ Task Test Failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

testTasks();
