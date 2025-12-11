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

  // 2) Create multiple teams
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
  });

  const dataTeam = await Team.create({
    name: 'Data Science Team',
    description: 'ML and Data Analysis projects',
    owner: david._id,
    members: [
      { user: david._id, role: 'owner' },
      { user: bob._id, role: 'member' },
    ],
  });

  // Update users with team memberships
  await User.findByIdAndUpdate(alice._id, { $set: { teams: [webDevTeam._id, mobileTeam._id] } });
  await User.findByIdAndUpdate(bob._id, { $set: { teams: [webDevTeam._id, dataTeam._id] } });
  await User.findByIdAndUpdate(charlie._id, { $set: { teams: [webDevTeam._id] } });
  await User.findByIdAndUpdate(david._id, { $set: { teams: [webDevTeam._id, dataTeam._id] } });
  await User.findByIdAndUpdate(emma._id, { $set: { teams: [mobileTeam._id] } });
  await User.findByIdAndUpdate(frank._id, { $set: { teams: [mobileTeam._id] } });

  console.log('Seeded 3 teams');

  // 3) Seed personal tasks for different users
  await Task.create([
    // Alice's personal tasks
    {
      title: 'Review pull requests',
      description: 'Need to review 3 PRs from team members',
      isTeamTask: false,
      owner: alice._id,
      status: 'todo',
      priority: 'high',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      createdBy: alice._id,
    },
    {
      title: 'Update resume',
      description: 'Add recent projects and skills',
      isTeamTask: false,
      owner: alice._id,
      status: 'in-progress',
      priority: 'medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdBy: alice._id,
    },
    {
      title: 'Read React 19 docs',
      description: 'Check out the new features',
      isTeamTask: false,
      owner: alice._id,
      status: 'done',
      priority: 'low',
      createdBy: alice._id,
    },
    // Bob's personal tasks
    {
      title: 'Prepare presentation',
      description: 'Final project demo slides',
      isTeamTask: false,
      owner: bob._id,
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      createdBy: bob._id,
    },
    {
      title: 'Study for algorithms exam',
      description: 'Chapters 12-15',
      isTeamTask: false,
      owner: bob._id,
      status: 'todo',
      priority: 'high',
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      createdBy: bob._id,
    },
    // Emma's personal tasks
    {
      title: 'Learn Swift UI',
      description: 'Complete online tutorial',
      isTeamTask: false,
      owner: emma._id,
      status: 'in-progress',
      priority: 'medium',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      createdBy: emma._id,
    },
  ]);

  // 4) Seed team tasks for Web Dev Team (Kanban board)
  const [webTask1, webTask2, webTask3, webTask4, webTask5, webTask6] = await Task.create([
    {
      title: 'Setup MongoDB and Express backend',
      description: 'Initialize server, connect to database, setup basic routes',
      isTeamTask: true,
      team: webDevTeam._id,
      assignedTo: bob._id,
      status: 'done',
      priority: 'high',
      orderIndex: 0,
      createdBy: alice._id,
    },
    {
      title: 'Create authentication system',
      description: 'JWT auth with login, signup, and protected routes',
      isTeamTask: true,
      team: webDevTeam._id,
      assignedTo: david._id,
      status: 'done',
      priority: 'high',
      orderIndex: 1,
      createdBy: alice._id,
    },
    {
      title: 'Build task management API',
      description: 'CRUD operations for tasks with team support',
      isTeamTask: true,
      team: webDevTeam._id,
      assignedTo: charlie._id,
      status: 'in-progress',
      priority: 'high',
      orderIndex: 2,
      createdBy: alice._id,
    },
    {
      title: 'Design and implement dashboard UI',
      description: 'React components with modern styling and widgets',
      isTeamTask: true,
      team: webDevTeam._id,
      assignedTo: alice._id,
      status: 'in-progress',
      priority: 'high',
      orderIndex: 3,
      createdBy: bob._id,
    },
    {
      title: 'Add team collaboration features',
      description: 'Team boards, comments, activity tracking',
      isTeamTask: true,
      team: webDevTeam._id,
      assignedTo: bob._id,
      status: 'todo',
      priority: 'medium',
      orderIndex: 4,
      createdBy: alice._id,
    },
    {
      title: 'Implement real-time notifications',
      description: 'WebSocket or polling for live updates',
      isTeamTask: true,
      team: webDevTeam._id,
      assignedTo: david._id,
      status: 'todo',
      priority: 'medium',
      orderIndex: 5,
      createdBy: charlie._id,
    },
  ]);

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
