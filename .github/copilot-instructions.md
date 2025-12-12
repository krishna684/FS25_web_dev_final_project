# TaskFlow - AI Coding Agent Instructions

## Architecture Overview

TaskFlow is a MERN stack task management app with **dual-mode task handling**: personal tasks (owned by individual users) and team tasks (shared in collaborative workspaces). The codebase uses a monorepo structure with Express backend and React+Vite frontend, deployed separately (backend on Vercel, frontend on Netlify/Vercel).

**Critical architectural pattern**: The `Task` model uses conditional validation via `isTeamTask` boolean:
- When `isTeamTask: false` → `owner` field is required (personal task)
- When `isTeamTask: true` → `team` field is required, `owner` is ignored (team task)
- **Always set** `createdBy: req.user.userId` regardless of task type

See `models/Task.js` lines 26-41 for the schema-level conditional logic.

## Project Structure

```
server.js              # Express server entry point (port 5000) - Separate deployment from frontend
app.js                 # Express app configuration + route mounting (exported for serverless)
src/                   # React frontend (Vite dev server on port 5173)
├── api/               # Axios client + API service layer (auth.js, tasks.js, teams.js, etc.)
├── context/           # React Context providers (AuthContext, TaskContext, ToastContext)
├── components/        # Feature-organized React components
│   ├── common/        # SkeletonLoader, Toast, LoadingButton, EmptyState
│   ├── kanban/        # KanbanBoard, KanbanColumn (status-based filtering, NO drag-drop wired)
│   └── activity/      # ActivityFeed with activityIcons.js utility
└── pages/             # Route-level page components (DashboardPage, TeamBoardPage, etc.)
controllers/           # Express route handlers (use activityController.logActivity helper)
models/                # Mongoose schemas with compound indexes
routes/                # Express route definitions (mounted in app.js)
middleware/            # authMiddleware.js (JWT Bearer token validation)
seeds/seed.js          # Creates 6 demo users (alice-frank@example.com, pw: Password123!)
tests/                 # Manual API tests using raw axios calls (NO Jest/Mocha)
```

## Development Workflows

### Starting the Application
```powershell
# Backend only
npm start

# Full stack development (backend + Vite)
npm run dev

# Frontend only
npm run client
```

**Port configuration**: Backend runs on `http://localhost:5000`, frontend on `http://localhost:5173`. CORS is configured in `server.js` to allow frontend origin.

### Database Setup
```powershell
# Seed demo data (clears DB first!)
npm run seed
```

Seeds create **6 users** (alice@example.com, bob@example.com, charlie@example.com, david@example.com, emma@example.com, frank@example.com) with password `Password123!`, **3 teams** (Web Development, Mobile App, Data Science), realistic tasks with assignments, and comments. See `seeds/seed.js`.

### Testing
Manual API tests exist in `tests/` directory:
```powershell
node tests/api_task_test.js
node tests/api_team_test.js
# etc.
```

No Jest/Mocha setup - tests use raw axios calls against running server.

## Authentication Flow

JWT-based auth with localStorage persistence:

1. **Backend**: `authMiddleware.js` extracts `Authorization: Bearer <token>` header, decodes JWT, attaches `req.user.userId`
2. **Frontend**: `axiosClient.js` intercept adds token to all requests from `localStorage.getItem('taskflow_token')`
3. **Context**: `AuthContext.jsx` loads user profile on mount if token exists

**Key files**:
- `middleware/authMiddleware.js` - JWT verification
- `src/api/axiosClient.js` - Token injection interceptor
- `src/context/AuthContext.jsx` - User state management
- `src/routes/ProtectedRoute.jsx` - Client-side route guards

## API Route Patterns

The backend uses **nested route mounting** for scoped resources:

```javascript
// In app.js (not server.js)
app.use('/api/tasks/:taskId/comments', commentRoutes);
app.use('/api/teams/:teamId/tasks', teamTaskRoutes);
app.use('/api/teams/:teamId/activity', activityRoutes);
```

This means:
- Personal tasks: `GET/POST/PUT/DELETE /api/tasks`
- Team tasks: `GET/POST/PUT /api/teams/:teamId/tasks`
- Comments: `POST /api/tasks/:taskId/comments`
- Search: `GET /api/search?q=query` (searches tasks, teams, users with access control)

Controllers access params via `req.params.teamId` or `req.params.taskId`.

## Data Access Patterns

### Membership Verification
Team controllers **always verify membership** before allowing access:

```javascript
const team = await Team.findOne({ 
  _id: teamId, 
  'members.user': req.user.userId 
});
if (!team) return res.status(403).json({ error: 'Access denied' });
```

See `controllers/teamTaskController.js` lines 8-12.

### Team Members Structure
`Team.members` is an array of subdocuments with schema:
```javascript
{ user: ObjectId, role: 'owner'|'member', joinedAt: Date }
```

Queries use dot notation: `'members.user': userId`. Populate with `.populate('members.user', 'name email')`.

### Task Querying
Use compound indexes for performance:
- Personal dashboard: `{ owner, isTeamTask, status, dueDate }`
- Team Kanban: `{ team, status, orderIndex }`
- Assigned tasks: `{ assignedTo, status, dueDate }`

All indexes defined in `models/Task.js` lines 91-97.

## Frontend State Management

**Three primary contexts**:
1. `AuthContext` - User auth state, login/logout/signup methods
2. `TaskContext` - Personal task CRUD operations
3. `ToastContext` - Global toast notifications (success, error, warning, info)

Team tasks are managed locally in page components (e.g., `TeamBoardPage.jsx`) without global context.

**API service pattern**: All API calls go through `src/api/*.js` modules (auth.js, tasks.js, teams.js, teamTasks.js) that use the configured `axiosClient`.

**Toast notifications**: Use `useToast()` hook anywhere to show feedback:
```javascript
const toast = useToast();
toast.success('Task created successfully');
toast.error('Failed to save changes');
```

## Kanban Board Implementation

Kanban uses simple status-based filtering, **NOT drag-and-drop**:
- `KanbanBoard.jsx` filters tasks by status (`todo`, `in-progress`, `done`)
- `orderIndex` field exists on Task model but no DnD library is wired up
- Tasks are rendered in `KanbanColumn` components

To add drag-and-drop: Install `@hello-pangea/dnd` (already in package.json), wrap board in `DragDropContext`, update task `orderIndex` on drop.

## Common Gotchas

1. **Task creation**: Always set `createdBy: req.user.userId` even for team tasks
2. **Team structure**: Use `{ user: userId, role: 'member' }` when pushing to `members[]` array
3. **Population**: Remember to populate nested fields like `'members.user'` or `assignedTo`
4. **Nested routes**: When adding comment/team task routes, params cascade from parent mount point
5. **isTeamTask flag**: Must be set correctly or conditional validation fails on save

## Configuration Files

- `.env` - Must contain `MONGODB_URI` and `JWT_SECRET`
- `vite.config.js` - Basic React plugin config (no proxy configured)
- `eslint.config.js` - ESLint 9.x flat config format
- `package.json` - Uses `concurrently` for `npm run dev` to run both servers

## Extending the System

**Adding new features**:
1. **New model**: Create in `models/`, add indexes, update seed.js
2. **New routes**: Create controller in `controllers/`, route file in `routes/`, mount in `app.js` (NOT `server.js`)
3. **Frontend API**: Add service file in `src/api/`, create React components, add to `src/pages/`
4. **Protected routes**: Wrap in `<ProtectedRoute>` in `App.jsx`, use `authMiddleware` on backend
5. **Toast feedback**: Import `useToast()` hook in components for user-facing success/error messages
6. **Loading states**: Use `SkeletonLoader` component during async data fetching

**Activity & Notification System**: Fully implemented with helper controllers:
- `activityController.logActivity(actorId, teamId, type, message, taskId)` - Used by team/task controllers
- `notificationController.createNotification(recipientId, type, title, body, taskId, teamId)` - Auto-notifies on assignments
- Activity feeds track team actions (task creation, comments, assignments)
- Notifications are created automatically when tasks are assigned or updated

## Design System

TaskFlow uses a comprehensive **Design System v2.0** defined in `src/styles/design-tokens.js`:
- **Color palette**: Primary blue (#2563EB), accent green (#10B981), team purple (#8B5CF6)
- **Typography**: Inter font with 6-level hierarchy (H1-Caption)
- **8px grid system**: Spacing uses multiples of 8px (xs=8, sm=16, md=24, lg=32, xl=48, xxl=64)
- **Dark mode**: Full support with CSS variable-based theming
- **Components**: SkeletonLoader (5 variants), Toast (4 types), LoadingButton, EmptyState, PriorityBadge

When adding UI components, import design tokens and use existing patterns. See `docs/DESIGN_SYSTEM_QUICK_START.md`.
