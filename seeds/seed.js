// seeds/seed.js
require("dotenv").config();
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

  const [alice, bob, charlie] = await User.create([
    {
      name: 'Alice Student',
      email: 'alice@example.com',
      passwordHash,
    },
    {
      name: 'Bob Teammate',
      email: 'bob@example.com',
      passwordHash,
    },
    {
      name: 'Charlie Member',
      email: 'charlie@example.com',
      passwordHash,
    },
  ]);

  console.log('Seeded users');

  // 2) Create a team
  const team = await Team.create({
    name: 'CS Project Team',
    description: 'Team workspace for Web Dev project',
    owner: alice._id,
    members: [
      { user: alice._id, role: 'owner' },
      { user: bob._id, role: 'member' },
      { user: charlie._id, role: 'member' },
    ],
  });

  // Update users with team membership
  await User.updateMany(
    { _id: { $in: [alice._id, bob._id, charlie._id] } },
    { $addToSet: { teams: team._id } }
  );

  console.log('Seeded team');

  // 3) Seed tasks (personal + team / Kanban)
  const [aliceTask1, aliceTask2] = await Task.create([
    {
      title: 'Finish homework for Math',
      description: 'Chapters 3 and 4',
      isTeamTask: false,
      owner: alice._id,
      status: 'todo',
      priority: 'high',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      createdBy: alice._id,
    },
    {
      title: 'Study for web dev quiz',
      description: 'Review MERN stack basics',
      isTeamTask: false,
      owner: alice._id,
      status: 'in-progress',
      priority: 'medium',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      createdBy: alice._id,
    },
  ]);

  const [teamTask1, teamTask2, teamTask3] = await Task.create([
    {
      title: 'Setup backend project structure',
      description: 'Express, routes, and Mongo connection',
      isTeamTask: true,
      team: team._id,
      assignedTo: bob._id,
      status: 'in-progress',
      priority: 'high',
      orderIndex: 0,
      createdBy: alice._id,
    },
    {
      title: 'Create task model and API',
      description: 'Nick + Krishna integration',
      isTeamTask: true,
      team: team._id,
      assignedTo: charlie._id,
      status: 'todo',
      priority: 'medium',
      orderIndex: 1,
      createdBy: alice._id,
    },
    {
      title: 'Design dashboard UI',
      description: 'React components and layout',
      isTeamTask: true,
      team: team._id,
      assignedTo: alice._id,
      status: 'todo',
      priority: 'medium',
      orderIndex: 2,
      createdBy: bob._id,
    },
  ]);

  console.log('Seeded tasks');

  // 4) Seed comments
  const comment1 = await Comment.create({
    task: teamTask1._id,
    author: bob._id,
    content: 'I pushed the initial Express setup to the repo.',
  });

  const comment2 = await Comment.create({
    task: teamTask1._id,
    author: alice._id,
    content: 'Nice! I’ll hook up the models next.',
  });

  console.log('Seeded comments');

  // 5) Seed activities
  await Activity.create([
    {
      actor: alice._id,
      team: team._id,
      type: 'team.created',
      message: `${alice.name} created team "${team.name}"`,
      meta: { teamId: team._id },
    },
    {
      actor: bob._id,
      team: team._id,
      task: teamTask1._id,
      type: 'task.status.changed',
      message: `${bob.name} moved "${teamTask1.title}" to In Progress`,
      meta: { status: 'in-progress' },
    },
    {
      actor: alice._id,
      team: team._id,
      task: teamTask1._id,
      type: 'task.comment.added',
      message: `${alice.name} commented on "${teamTask1.title}"`,
      meta: { commentId: comment2._id },
    },
  ]);

  console.log('Seeded activities');

  // 6) Seed notifications
  await Notification.create([
    {
      recipient: bob._id,
      type: 'task.assigned',
      title: 'New task assigned',
      body: `You have been assigned: "${teamTask1.title}"`,
      task: teamTask1._id,
      team: team._id,
    },
    {
      recipient: alice._id,
      type: 'comment.added',
      title: 'New comment on your task',
      body: `${bob.name} commented on "${teamTask1.title}"`,
      task: teamTask1._id,
      team: team._id,
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
