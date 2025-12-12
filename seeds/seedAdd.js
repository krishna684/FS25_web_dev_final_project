// seeds/seedAdd.js
// Additive seed script - adds demo data WITHOUT deleting existing data
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const Team = require('../models/Team');
const Task = require('../models/Task');

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB for additive seeding');
}

async function seedAdd() {
  await connectDB();

  // Check if demo user already exists
  const existingUser = await User.findOne({ email: 'demo@example.com' });
  if (existingUser) {
    console.log('⚠️  Demo user already exists. Skipping to avoid duplicates.');
    console.log('   To reset all data, use: npm run seed');
    await mongoose.disconnect();
    return;
  }

  console.log('Adding demo data to existing database...\n');

  // 1) Create demo user
  const passwordHash = await bcrypt.hash('Demo123!', 10);
  
  const demoUser = await User.create({
    name: 'Demo Student',
    email: 'demo@example.com',
    passwordHash,
  });

  console.log('✅ Created demo user:');
  console.log('   Email: demo@example.com');
  console.log('   Password: Demo123!\n');

  // 2) Create personal tasks for demo user
  const tasks = await Task.create([
    {
      title: 'Complete CS4990 Capstone Project Report',
      description: 'Finalize IoT dashboard implementation, write documentation, prepare demo video',
      isTeamTask: false,
      owner: demoUser._id,
      status: 'todo',
      priority: 'high',
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      category: 'Coursework',
      createdBy: demoUser._id,
    },
    {
      title: 'Grade CS2050 Student Assignments',
      description: 'Review and grade homework submissions for 45 students',
      isTeamTask: false,
      owner: demoUser._id,
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      category: 'Teaching',
      createdBy: demoUser._id,
    },
    {
      title: 'Study for Algorithms Final',
      description: 'Chapters 12-15: Dynamic Programming, Graph Algorithms',
      isTeamTask: false,
      owner: demoUser._id,
      status: 'todo',
      priority: 'high',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      category: 'Coursework',
      createdBy: demoUser._id,
    },
    {
      title: 'Prepare Lab Session Materials',
      description: 'Create slides and code examples for Python lab',
      isTeamTask: false,
      owner: demoUser._id,
      status: 'todo',
      priority: 'medium',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      category: 'Teaching',
      createdBy: demoUser._id,
    },
    {
      title: 'Submit Research Paper Draft',
      description: 'Complete literature review and methodology sections',
      isTeamTask: false,
      owner: demoUser._id,
      status: 'in-progress',
      priority: 'medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      category: 'Research',
      createdBy: demoUser._id,
    },
    {
      title: 'Apply for Summer Internships',
      description: 'Update LinkedIn, submit applications to tech companies',
      isTeamTask: false,
      owner: demoUser._id,
      status: 'todo',
      priority: 'low',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      category: 'Career',
      createdBy: demoUser._id,
    },
    {
      title: 'Office Hours Prep',
      description: 'Review common questions from Piazza',
      isTeamTask: false,
      owner: demoUser._id,
      status: 'done',
      priority: 'low',
      category: 'Teaching',
      createdBy: demoUser._id,
    },
  ]);

  console.log(`✅ Created ${tasks.length} personal tasks\n`);

  // 3) Create a demo team
  const demoTeam = await Team.create({
    name: 'Capstone Project Team',
    description: 'CS4990 Final Project - IoT Dashboard',
    owner: demoUser._id,
    members: [
      { user: demoUser._id, role: 'owner' },
    ],
    inviteCode: 'CAPSTONE',
  });

  // Update user with team membership
  await User.findByIdAndUpdate(demoUser._id, { $set: { teams: [demoTeam._id] } });

  console.log('✅ Created demo team:');
  console.log('   Name: Capstone Project Team');
  console.log('   Invite Code: CAPSTONE\n');

  // 4) Create team tasks
  const teamTasks = await Task.create([
    {
      title: 'Setup project repository',
      description: 'Initialize Git repo, setup CI/CD pipeline',
      isTeamTask: true,
      team: demoTeam._id,
      assignedTo: demoUser._id,
      status: 'done',
      priority: 'high',
      orderIndex: 0,
      category: 'Development',
      createdBy: demoUser._id,
    },
    {
      title: 'Design database schema',
      description: 'Create ER diagram and MongoDB collections',
      isTeamTask: true,
      team: demoTeam._id,
      assignedTo: demoUser._id,
      status: 'done',
      priority: 'high',
      orderIndex: 1,
      category: 'Development',
      createdBy: demoUser._id,
    },
    {
      title: 'Implement IoT data ingestion',
      description: 'Build API endpoints for sensor data',
      isTeamTask: true,
      team: demoTeam._id,
      assignedTo: demoUser._id,
      status: 'in-progress',
      priority: 'high',
      orderIndex: 2,
      createdBy: demoUser._id,
    },
    {
      title: 'Create dashboard visualizations',
      description: 'Charts and graphs for real-time data',
      isTeamTask: true,
      team: demoTeam._id,
      status: 'todo',
      priority: 'medium',
      orderIndex: 3,
      createdBy: demoUser._id,
    },
    {
      title: 'Write project documentation',
      description: 'README, API docs, user guide',
      isTeamTask: true,
      team: demoTeam._id,
      status: 'todo',
      priority: 'medium',
      orderIndex: 4,
      createdBy: demoUser._id,
    },
  ]);

  console.log(`✅ Created ${teamTasks.length} team tasks\n`);

  console.log('═══════════════════════════════════════════');
  console.log('✅ Additive seeding complete!');
  console.log('═══════════════════════════════════════════');
  console.log('\nYou can now login with:');
  console.log('   Email: demo@example.com');
  console.log('   Password: Demo123!');
  console.log('\nYour existing data was NOT deleted.');
  console.log('═══════════════════════════════════════════\n');

  await mongoose.disconnect();
}

seedAdd().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
