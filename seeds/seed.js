// seeds/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const Team = require('../models/Team');
const Task = require('../models/Task');
const Comment = require('../models/Comment');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB for seeding');
}

async function clearCollections() {
  await Promise.all([
    User.deleteMany({}),
    Team.deleteMany({}),
    Task.deleteMany({}),
    Comment.deleteMany({}),
    Activity.deleteMany({}),
    Notification.deleteMany({}),
  ]);
  console.log('Cleared existing data');
}

async function seed() {
  await connectDB();
  await clearCollections();

  // 1) Create users
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const [alice, bob, charlie, david, emma, frank] = await User.create([
    {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      passwordHash,
    },
    {
      name: 'Bob Smith',
      email: 'bob@example.com',
      passwordHash,
    },
    {
      name: 'Charlie Davis',
      email: 'charlie@example.com',
      passwordHash,
    },
    {
      name: 'David Wilson',
      email: 'david@example.com',
      passwordHash,
    },
    {
      name: 'Emma Brown',
      email: 'emma@example.com',
      passwordHash,
    },
    {
      name: 'Frank Miller',
      email: 'frank@example.com',
      passwordHash,
    },
  ]);

  console.log('Seeded 6 users');

  // 2) Create multiple teams with invite codes
  const webDevTeam = await Team.create({
    name: 'Web Development Team',
    description: 'Team workspace for Web Dev final project',
    owner: alice._id,
    members: [
      { user: alice._id, role: 'owner' },
      { user: bob._id, role: 'member' },
      { user: charlie._id, role: 'member' },
      { user: david._id, role: 'member' },
    ],
    inviteCode: 'WEBDEV01',
  });

  const mobileTeam = await Team.create({
    name: 'Mobile App Team',
    description: 'iOS and Android development',
    owner: emma._id,
    members: [
      { user: emma._id, role: 'owner' },
      { user: frank._id, role: 'member' },
      { user: alice._id, role: 'member' },
    ],
    inviteCode: 'MOBILE01',
  });

  const dataTeam = await Team.create({
    name: 'Data Science Team',
    description: 'ML and Data Analysis projects',
    owner: david._id,
    members: [
      { user: david._id, role: 'owner' },
      { user: bob._id, role: 'member' },
    ],
    inviteCode: 'DATASCI01',
  });

  // Update users with team memberships
  await User.findByIdAndUpdate(alice._id, { $set: { teams: [webDevTeam._id, mobileTeam._id] } });
  await User.findByIdAndUpdate(bob._id, { $set: { teams: [webDevTeam._id, dataTeam._id] } });
  await User.findByIdAndUpdate(charlie._id, { $set: { teams: [webDevTeam._id] } });
  await User.findByIdAndUpdate(david._id, { $set: { teams: [webDevTeam._id, dataTeam._id] } });
  await User.findByIdAndUpdate(emma._id, { $set: { teams: [mobileTeam._id] } });
  await User.findByIdAndUpdate(frank._id, { $set: { teams: [mobileTeam._id] } });

  console.log('Seeded 3 teams');

  // 3) Seed personal tasks for different users with realistic student/TA scenarios
  await Task.create([
    // Alice's personal tasks - Graduate Student + TA
    {
      title: 'Complete CS4990 Capstone Project Report',
      description: 'Finalize IoT dashboard implementation, write documentation, prepare demo video',
      isTeamTask: false,
      owner: alice._id,
      status: 'todo',
      priority: 'high',
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      category: 'Coursework',
      createdBy: alice._id,
    },
    {
      title: 'Grade CS2050 Student Assignments',
      description: 'Review and grade homework submissions for 45 students, provide feedback',
      isTeamTask: false,
      owner: alice._id,
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
      category: 'Teaching',
      createdBy: alice._id,
    },
    {
      title: 'Prepare Lab Session Materials',
      description: 'Create slides and code examples for next week\'s Python lab',
      isTeamTask: false,
      owner: alice._id,
      status: 'todo',
      priority: 'medium',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      category: 'Teaching',
      createdBy: alice._id,
    },
    {
      title: 'Submit Research Paper Draft',
      description: 'Complete literature review section and methodology',
      isTeamTask: false,
      owner: alice._id,
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      category: 'Research',
      createdBy: alice._id,
    },
    {
      title: 'Office Hours Prep',
      description: 'Review common questions from Piazza, prepare explanations',
      isTeamTask: false,
      owner: alice._id,
      status: 'done',
      priority: 'low',
      category: 'Teaching',
      createdBy: alice._id,
    },
    // Bob's personal tasks - Undergraduate CS Student
    {
      title: 'Study for Algorithms Final Exam',
      description: 'Chapters 12-15: Dynamic Programming, Graph Algorithms, NP-Completeness',
      isTeamTask: false,
      owner: bob._id,
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      category: 'Coursework',
      createdBy: bob._id,
    },
    {
      title: 'Complete Database Project',
      description: 'Implement SQL queries and ER diagram for library management system',
      isTeamTask: false,
      owner: bob._id,
      status: 'todo',
      priority: 'high',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      category: 'Coursework',
      createdBy: bob._id,
    },
    {
      title: 'Apply for Summer Internships',
      description: 'Update LinkedIn, submit applications to Google, Microsoft, Amazon',
      isTeamTask: false,
      owner: bob._id,
      status: 'in-progress',
      priority: 'medium',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      category: 'Career',
      createdBy: bob._id,
    },
    // Emma's personal tasks - Mobile Developer
    {
      title: 'Learn SwiftUI Animations',
      description: 'Complete online tutorial on custom animations and transitions',
      isTeamTask: false,
      owner: emma._id,
      status: 'in-progress',
      priority: 'medium',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      category: 'Learning',
      createdBy: emma._id,
    },
    {
      title: 'Review App Store Guidelines',
      description: 'Check latest iOS 18 requirements before submission',
      isTeamTask: false,
      owner: emma._id,
      status: 'todo',
      priority: 'low',
      dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      category: 'Project',
      createdBy: emma._id,
    },
    // David's personal tasks - Data Science focus
    {
      title: 'Complete ML Model Training',
      description: 'Fine-tune BERT model for sentiment analysis project',
      isTeamTask: false,
      owner: david._id,
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      category: 'Research',
      createdBy: david._id,
    },
    {
      title: 'Prepare Conference Presentation',
      description: 'Create slides for ACM student research symposium',
      isTeamTask: false,
      owner: david._id,
      status: 'todo',
      priority: 'medium',
      dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      category: 'Research',
      createdBy: david._id,
    },
  ]);

  console.log('Seeded personal tasks');

  // 4) Seed team tasks for Web Dev Team
  const webTask1 = await Task.create({
    title: 'Setup MongoDB and Express backend',
    description: 'Initialize server, connect to database, setup basic routes',
    isTeamTask: true,
    team: webDevTeam._id,
    assignedTo: bob._id,
    status: 'done',
    priority: 'high',
    orderIndex: 0,
    category: 'Development',
    createdBy: alice._id,
  });

  const webTask2 = await Task.create({
    title: 'Create authentication system',
    description: 'JWT auth with login, signup, and protected routes',
    isTeamTask: true,
    team: webDevTeam._id,
    assignedTo: david._id,
    status: 'done',
    priority: 'high',
    orderIndex: 1,
    category: 'Development',
    createdBy: alice._id,
  });

  const webTask3 = await Task.create({
    title: 'Build task management API',
    description: 'CRUD operations for tasks with team support',
    isTeamTask: true,
    team: webDevTeam._id,
    assignedTo: charlie._id,
    status: 'in-progress',
    priority: 'high',
    orderIndex: 2,
    createdBy: alice._id,
  });

  const webTask4 = await Task.create({
    title: 'Design and implement dashboard UI',
    description: 'React components with modern styling and widgets',
    isTeamTask: true,
    team: webDevTeam._id,
    assignedTo: alice._id,
    status: 'in-progress',
    priority: 'high',
    orderIndex: 3,
    createdBy: bob._id,
  });

  const webTask5 = await Task.create({
    title: 'Add team collaboration features',
    description: 'Team boards, comments, activity tracking',
    isTeamTask: true,
    team: webDevTeam._id,
    assignedTo: bob._id,
    status: 'todo',
    priority: 'medium',
    orderIndex: 4,
    createdBy: alice._id,
  });

  const webTask6 = await Task.create({
    title: 'Implement real-time notifications',
    description: 'WebSocket or polling for live updates',
    isTeamTask: true,
    team: webDevTeam._id,
    assignedTo: david._id,
    status: 'todo',
    priority: 'medium',
    orderIndex: 5,
    createdBy: charlie._id,
  });

  console.log('Seeded Web Dev team tasks');

  // 5) Seed team tasks for Mobile Team
  await Task.create([
    {
      title: 'Setup React Native project',
      description: 'Initialize with Expo and basic navigation',
      isTeamTask: true,
      team: mobileTeam._id,
      assignedTo: frank._id,
      status: 'in-progress',
      priority: 'high',
      orderIndex: 0,
      createdBy: emma._id,
    },
    {
      title: 'Design mobile UI mockups',
      description: 'Figma designs for all screens',
      isTeamTask: true,
      team: mobileTeam._id,
      assignedTo: alice._id,
      status: 'todo',
      priority: 'medium',
      orderIndex: 1,
      createdBy: emma._id,
    },
  ]);

  // 6) Seed team tasks for Data Team
  await Task.create([
    {
      title: 'Data preprocessing pipeline',
      description: 'Clean and prepare dataset',
      isTeamTask: true,
      team: dataTeam._id,
      assignedTo: bob._id,
      status: 'in-progress',
      priority: 'high',
      orderIndex: 0,
      createdBy: david._id,
    },
  ]);

  console.log('Seeded tasks (personal + team)');

  // 7) Seed comments on various tasks
  const comment1 = await Comment.create({
    task: webTask3._id,
    author: charlie._id,
    content: 'Just finished the CRUD endpoints. Working on team task filtering now.',
  });

  const comment2 = await Comment.create({
    task: webTask3._id,
    author: alice._id,
    content: 'Great! Make sure to add proper validation for team membership.',
  });

  const comment3 = await Comment.create({
    task: webTask4._id,
    author: alice._id,
    content: 'Dashboard is looking good! Added widgets for tasks and activity.',
  });

  const comment4 = await Comment.create({
    task: webTask4._id,
    author: bob._id,
    content: 'Nice work! Can you add dark mode support?',
  });

  const comment5 = await Comment.create({
    task: webTask1._id,
    author: bob._id,
    content: 'Backend is up and running. Database connection verified.',
  });

  console.log('Seeded comments');

  // 8) Seed activities for team collaboration
  await Activity.create([
    {
      actor: alice._id,
      team: webDevTeam._id,
      type: 'team.created',
      message: `${alice.name} created team "${webDevTeam.name}"`,
      meta: { teamId: webDevTeam._id },
    },
    {
      actor: emma._id,
      team: mobileTeam._id,
      type: 'team.created',
      message: `${emma.name} created team "${mobileTeam.name}"`,
      meta: { teamId: mobileTeam._id },
    },
    {
      actor: bob._id,
      team: webDevTeam._id,
      task: webTask1._id,
      type: 'task.status.changed',
      message: `${bob.name} completed "${webTask1.title}"`,
      meta: { status: 'done' },
    },
    {
      actor: david._id,
      team: webDevTeam._id,
      task: webTask2._id,
      type: 'task.status.changed',
      message: `${david.name} completed "${webTask2.title}"`,
      meta: { status: 'done' },
    },
    {
      actor: charlie._id,
      team: webDevTeam._id,
      task: webTask3._id,
      type: 'task.status.changed',
      message: `${charlie.name} moved "${webTask3.title}" to In Progress`,
      meta: { status: 'in-progress' },
    },
    {
      actor: alice._id,
      team: webDevTeam._id,
      task: webTask3._id,
      type: 'task.comment.added',
      message: `${alice.name} commented on "${webTask3.title}"`,
      meta: { commentId: comment2._id },
    },
    {
      actor: bob._id,
      team: webDevTeam._id,
      task: webTask4._id,
      type: 'task.comment.added',
      message: `${bob.name} commented on "${webTask4.title}"`,
      meta: { commentId: comment4._id },
    },
  ]);

  console.log('Seeded activities');

  // 9) Seed notifications for users
  await Notification.create([
    {
      recipient: bob._id,
      type: 'task.assigned',
      title: 'New task assigned',
      body: `You have been assigned: "${webTask1.title}"`,
      task: webTask1._id,
      team: webDevTeam._id,
      isRead: true,
    },
    {
      recipient: charlie._id,
      type: 'task.assigned',
      title: 'New task assigned',
      body: `You have been assigned: "${webTask3.title}"`,
      task: webTask3._id,
      team: webDevTeam._id,
      isRead: false,
    },
    {
      recipient: alice._id,
      type: 'comment.added',
      title: 'New comment on your task',
      body: `${bob.name} commented on "${webTask4.title}"`,
      task: webTask4._id,
      team: webDevTeam._id,
      isRead: false,
    },
    {
      recipient: charlie._id,
      type: 'comment.added',
      title: 'New comment on your task',
      body: `${alice.name} commented on "${webTask3.title}"`,
      task: webTask3._id,
      team: webDevTeam._id,
      isRead: false,
    },
    {
      recipient: david._id,
      type: 'task.assigned',
      title: 'New task assigned',
      body: `You have been assigned: "${webTask6.title}"`,
      task: webTask6._id,
      team: webDevTeam._id,
      isRead: false,
    },
  ]);

  console.log('Seeded notifications');

  console.log('✅ Seeding complete');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
