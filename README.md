# TaskFlow

**TaskFlow** is a comprehensive productivity and team collaboration platform designed to streamline workflow management. Built with the **MERN stack** (MongoDB, Express, React, Node.js), it offers a robust set of features for both personal task tracking and team-based project management.

![TaskFlow Dashboard](https://via.placeholder.com/800x400.png?text=TaskFlow+Dashboard+Preview)

## 🚀 Features

### Core Productivity
- **Personal Dashboard**: Track daily tasks, upcoming deadlines, and recent activity at a glance.
- **My Tasks**: Manage personal to-dos with filtering (status, date) and sorting.
- **Calendar View**: Visualize deadlines and events on a monthly calendar.

### Team Collaboration
- **Team Management**: Create teams, invite members via **Invite Codes**, and manage roles.
- **Kanban Boards**: Visualize team workflows with drag-and-drop support (UI ready).
- **Activity Logs**: Real-time tracking of team actions (task creation, updates, comments).

### Enhanced Experience
- **Global Search**: Instantly find Tasks, Teams, and People from the navigation bar.
- **Dark Mode**: Fully supported dark theme for low-light environments.
- **Notifications**: Stay updated with a dedicated notification system.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind-like CSS variables, Axios, Lucide React (Icons).
- **Backend**: Node.js, Express, Mongoose (MongoDB).
- **Database**: MongoDB.
- **Authentication**: JWT (JSON Web Tokens) & bcrypt.

## 📦 Installation & Setup

Follow these steps whether you unzipped a download or cloned the repo.

1) **Get the code**
   - If cloned: `git clone https://github.com/yourusername/taskflow.git && cd taskflow`
   - If unzipped: open a terminal in the extracted folder (it should contain `package.json`).

2) **Install dependencies**
   ```bash
   npm install
   ```

3) **Add environment file**
   Create a `.env` in the project root:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
   JWT_SECRET=your_super_secret_key_123
   NODE_ENV=development
   ```
   For the frontend, Vite will auto-fallback to `http://localhost:5000/api`. If you need to override, add `VITE_API_URL=http://localhost:5000/api` to the same `.env`.

4) **Seed the database (optional, recommended)**
   ```bash
   npm run seed
   ```
   
   This creates demo data to explore the app immediately. See [Seed Data Reference](#-seed-data-reference) below for full details.

## 🌱 Seed Data Reference

### Demo Users

| Email | Name | Password | Role |
|-------|------|----------|------|
| `alice@example.com` | Alice Johnson | `Password123!` | Team owner (Web Dev, Mobile) |
| `bob@example.com` | Bob Smith | `Password123!` | Member (Web Dev, Data Science) |
| `charlie@example.com` | Charlie Davis | `Password123!` | Member (Web Dev) |
| `david@example.com` | David Wilson | `Password123!` | Team owner (Data Science) |
| `emma@example.com` | Emma Brown | `Password123!` | Team owner (Mobile) |
| `frank@example.com` | Frank Miller | `Password123!` | Member (Mobile) |

### Demo Teams

| Team Name | Owner | Invite Code | Members |
|-----------|-------|-------------|---------|
| Web Development Team | Alice | `WEBDEV01` | Alice, Bob, Charlie, David |
| Mobile App Team | Emma | `MOBILE01` | Emma, Frank, Alice |
| Data Science Team | David | `DATASCI01` | David, Bob |

### Demo Tasks

**Personal Tasks:**
- Alice: "Review pull requests" (High), "Update resume" (Medium), "Read React 19 docs" (Low)
- Bob: "Prepare presentation" (High), "Study for algorithms exam" (High)
- Emma: "Learn Swift UI" (Medium)

**Team Tasks (Web Dev):** 6 tasks including "Setup MongoDB", "Create authentication", "Build task management API"

**Categories Used:** Development, Career, Learning, Coursework

### Adding Your Own Data

#### Option 1: Use the UI
1. **Sign up**: Create account at `/signup`
2. **Create tasks**: Dashboard → "Add Task" or My Tasks page
3. **Create teams**: Teams page → "Create Team"
4. **Invite members**: Team settings → Share invite code

#### Option 2: Modify Seed File
Edit `seeds/seed.js` to add custom data:

```javascript
// Add a new user
const myUser = await User.create({
  name: 'Your Name',
  email: 'you@example.com',
  passwordHash: await bcrypt.hash('YourPassword123!', 10),
});

// Add a personal task
await Task.create({
  title: 'Complete CS4990 Capstone Project Report',
  description: 'Finalize IoT dashboard, write documentation',
  isTeamTask: false,
  owner: myUser._id,
  status: 'todo',           // 'todo' | 'in-progress' | 'done'
  priority: 'high',         // 'low' | 'medium' | 'high'
  dueDate: new Date('2025-12-15T14:00:00'),
  category: 'Coursework',   // Any string: 'Coursework', 'Teaching', 'Project', etc.
  createdBy: myUser._id,
});

// Add a team task
await Task.create({
  title: 'Grade CS2050 Student Assignments',
  description: 'Review and grade homework submissions',
  isTeamTask: true,
  team: yourTeam._id,
  assignedTo: myUser._id,   // Optional: assign to team member
  status: 'in-progress',
  priority: 'medium',
  dueDate: new Date('2025-12-12T17:00:00'),
  createdBy: myUser._id,
});
```

Then re-run: `npm run seed`

### Data Field Reference

#### Task Fields
| Field | Type | Required | Values |
|-------|------|----------|--------|
| `title` | String | ✅ | Max 200 chars |
| `description` | String | ❌ | Max 2000 chars |
| `status` | String | ❌ | `todo`, `in-progress`, `done` (default: `todo`) |
| `priority` | String | ❌ | `low`, `medium`, `high` (default: `medium`) |
| `dueDate` | Date | ❌ | ISO date string |
| `category` | String | ❌ | Any text (e.g., "Coursework", "Teaching") |
| `isTeamTask` | Boolean | ✅ | `true` for team, `false` for personal |
| `owner` | ObjectId | ✅* | Required if `isTeamTask: false` |
| `team` | ObjectId | ✅* | Required if `isTeamTask: true` |
| `assignedTo` | ObjectId | ❌ | Team member to assign |
| `createdBy` | ObjectId | ✅ | User who created the task |

#### User Fields
| Field | Type | Required | Values |
|-------|------|----------|--------|
| `name` | String | ✅ | 2-100 chars |
| `email` | String | ✅ | Valid email, unique |
| `passwordHash` | String | ✅ | Use `bcrypt.hash(password, 10)` |

#### Team Fields
| Field | Type | Required | Values |
|-------|------|----------|--------|
| `name` | String | ✅ | 2-100 chars |
| `description` | String | ❌ | Max 500 chars |
| `owner` | ObjectId | ✅ | User who owns the team |
| `members` | Array | ✅ | `[{ user: ObjectId, role: 'owner'|'member' }]` |
| `inviteCode` | String | ❌ | Unique code for joining |

## 🏃‍♂️ Running the Application

To run both the backend server and frontend client concurrently:

```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

Backend only (useful when deploying separately):
```bash
npm start
```

If the backend is on another host/port, set `VITE_API_URL` to that `https://your-host/api` before running the frontend.

### Vercel environment (copy/paste)
Set these in Vercel → Project → Settings → Environment Variables. Update the Mongo URI and secret with your values; the domain below matches your deployment.

```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=replace-with-strong-secret
NODE_ENV=production
VITE_API_URL=https://team-taskflow.netlify.app/api
FRONTEND_URL=https://team-taskflow.netlify.app
```

## 🧪 Verification

To verify key features like Global Search, you can run the included test script:

```bash
node verify_search_feature.js
```

## 📖 Documentation

- **[Database Architecture](docs/DATABASE_ARCHITECTURE.md)** - Detailed schema information
- **[Design System v2.0](docs/DESIGN_SYSTEM_V2.md)** - Complete design system documentation
- **[Design Quick Start](docs/DESIGN_SYSTEM_QUICK_START.md)** - Quick reference for using the design system
- **[Phase 9 Completion](docs/PHASE_9_COMPLETION.md)** - Polish & micro-interactions documentation
- **[Color Palette Guide](docs/COLOR_PALETTE_GUIDE.md)** - Color usage and psychology
- **[Setup Instructions](SETUP_INSTRUCTIONS.md)** - Installation and deployment guide

## 🎨 Design System

TaskFlow features a professional design system v2.0 with:
- **Refined Color Palette**: Professional blue (#2563EB), refined green (#10B981), team purple (#8B5CF6)
- **Typography System**: Inter font with 6-level hierarchy (H1-Caption)
- **8px Grid System**: Consistent spacing throughout
- **Component Library**: Enhanced buttons, cards, forms with hover/focus/error states
- **Dark Mode**: Smooth transitions with high-contrast colors
- **Accessibility**: WCAG AA compliant contrast ratios

See [Design System Quick Start](docs/DESIGN_SYSTEM_QUICK_START.md) for usage examples.

## ✨ Polish & Micro-interactions (Phase 9)

TaskFlow includes enterprise-grade polish with:
- **Toast Notifications**: 4 variants (success, error, warning, info) with auto-dismiss
- **Skeleton Loaders**: 5 variants for smooth async loading states
- **Page Transitions**: Smooth fade-in animations on page load
- **Enhanced Focus States**: WCAG 2.1 AA compliant keyboard navigation
- **Loading States**: Spinner animations in buttons for async operations
- **Smooth Scroll**: Native smooth scrolling for anchor links
- **Micro-interactions**: Ripple effects, hover lifts, stagger animations
- **Empty States**: Contextual messages for empty lists
- **Skip-to-Content**: Screen reader accessibility link

All animations run at 60fps with proper fallbacks for `prefers-reduced-motion`.

See [Phase 9 Completion](docs/PHASE_9_COMPLETION.md) for detailed documentation.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
