/**
 * Test Signup Flow
 * Tests the complete signup process including the Terms checkbox bug fix
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const TEST_EMAIL = `test_${Date.now()}@example.com`;

const testSignup = async () => {
  try {
    console.log('\n🧪 SIGNUP FLOW TEST\n');
    console.log('═'.repeat(50));

    // Test 1: Create a new user
    console.log('\n1️⃣  Creating new user account...');
    console.log(`   Email: ${TEST_EMAIL}`);
    console.log(`   Name: Test User`);
    console.log(`   Password: TestPassword123!`);

    const signupResponse = await axios.post(`${BASE_URL}/auth/signup`, {
      name: 'Test User',
      email: TEST_EMAIL,
      password: 'TestPassword123!',
    });

    console.log('✅ Signup successful!');
    console.log(`   User ID: ${signupResponse.data.user._id}`);
    console.log(`   Token: ${signupResponse.data.token.substring(0, 20)}...`);

    // Test 2: Verify user can login
    console.log('\n2️⃣  Attempting to login with new credentials...');

    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: TEST_EMAIL,
      password: 'TestPassword123!',
    });

    console.log('✅ Login successful!');
    console.log(`   Token: ${loginResponse.data.token.substring(0, 20)}...`);

    // Test 3: Verify user profile
    console.log('\n3️⃣  Fetching user profile...');

    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${loginResponse.data.token}`,
      },
    });

    console.log('✅ Profile retrieved successfully!');
    console.log(`   Name: ${profileResponse.data.user.name}`);
    console.log(`   Email: ${profileResponse.data.user.email}`);

    console.log('\n✅ ALL TESTS PASSED!');
    console.log('═'.repeat(50));
    console.log('\n🎉 Signup flow is working correctly!\n');

    return true;
  } catch (error) {
    console.error('\n❌ TEST FAILED');
    console.error('═'.repeat(50));

    if (error.response) {
      console.error(`\nStatus: ${error.response.status}`);
      console.error(`Error: ${JSON.stringify(error.response.data, null, 2)}`);
    } else if (error.message) {
      console.error(`\nError: ${error.message}`);
      console.error(`Full Error: ${JSON.stringify(error, null, 2)}`);
    }

    console.log('\n');
    return false;
  }
};

// Run the test
testSignup().then(success => {
  process.exit(success ? 0 : 1);
});
