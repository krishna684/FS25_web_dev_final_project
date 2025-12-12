const axios = require('axios');

async function testSignup() {
  const baseURL = 'http://localhost:5000/api';
  
  // Generate a unique email
  const timestamp = Date.now();
  const testEmail = `test${timestamp}@example.com`;
  
  console.log(`\n🧪 Testing signup with new email: ${testEmail}\n`);

  try {
    const response = await axios.post(`${baseURL}/auth/register`, {
      name: 'Test User',
      email: testEmail,
      password: 'TestPass123'
    });

    console.log('✅ SUCCESS! User created successfully');
    console.log('Response:', {
      token: response.data.token ? '✓ Token received' : '✗ No token',
      user: response.data.user
    });
    
  } catch (error) {
    console.log('❌ FAILED!');
    if (error.code === 'ECONNREFUSED') {
      console.log('Server is not running on port 5000');
      console.log('Please run: npm start');
    } else {
      console.log('Error:', error.response?.data?.error || error.message);
      console.log('Status:', error.response?.status);
      console.log('Full error:', error.message);
    }
  }

  // Now test with an existing email
  console.log('\n🧪 Testing signup with existing email: alice@example.com\n');
  
  try {
    const response = await axios.post(`${baseURL}/auth/register`, {
      name: 'Another User',
      email: 'alice@example.com',
      password: 'TestPass123'
    });

    console.log('⚠️ Unexpected success (should have failed)');
    
  } catch (error) {
    if (error.response) {
      console.log('✅ Expected error received');
      console.log('Error:', error.response?.data?.error);
      console.log('Status:', error.response?.status);
    } else {
      console.log('Connection error:', error.message);
    }
  }
}

testSignup();
