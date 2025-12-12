const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({}, 'name email createdAt');
    
    console.log(`\nTotal users in database: ${users.length}\n`);
    
    if (users.length > 0) {
      console.log('Existing users:');
      users.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log('');
      });
    } else {
      console.log('No users found in database.');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkUsers();
