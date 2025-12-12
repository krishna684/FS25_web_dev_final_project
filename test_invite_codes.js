const mongoose = require('mongoose');
const Team = require('./models/Team');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/taskflow', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkInviteCodes() {
  try {
    const teams = await Team.find({}).select('name inviteCode members');
    console.log('All teams and their invite codes:');
    teams.forEach(team => {
      console.log(`Team: ${team.name}, Invite Code: ${team.inviteCode}, Members: ${team.members.length}`);
    });
    
    if (teams.length === 0) {
      console.log('No teams found in database');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkInviteCodes();