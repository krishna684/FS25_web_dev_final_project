TaskFlow – Database Architecture (MongoDB + Mongoose)

TaskFlow uses MongoDB as its primary database, with Mongoose providing schema validation, indexing, and relationship modeling.  
The database is designed to support both personal productivity tools and team collaboration features such as:

- Personal tasks  
- Kanban boards  
- Comments and discussion threads  
- Notifications  
- Activity logs  
- Team membership and assignment workflows  

This document describes the database schema, indexes, relationships, and seed data used throughout the application.

//Collections & Schemas

TaskFlow uses six core MongoDB collections, each represented by a Mongoose model.


1. **User**
Stores account information, authentication metadata, and preferences.

**Key Fields**
- `name`, `email`, `passwordHash`
- `teams[]` – references to Team memberships
- `settings` – notification settings, timezone
- `lastLoginAt`
- `passwordChangedAt`

**Indexes**
- `email` *(unique)*  
- `teams.user` *(fast membership queries)*  

---

2. **Team**
Represents collaborative workspaces for groups of users.

**Key Fields**
- `name`, `description`
- `owner` (User)
- `members[]` – array of `{ user, role }`
- `inviteCode` *(optional)*

**Indexes**
- `owner`
- `members.user`

---

3. **Task**
Represents both personal tasks and team Kanban tasks.

**Key Fields**
- `title`, `description`
- `isTeamTask` *(true = team task, false = personal task)*
- `owner` *(for personal tasks)*
- `team` *(for team tasks)*
- `assignedTo` *(User)*
- `status` – `todo`, `in-progress`, `done`
- `priority` – `low`, `medium`, `high`
- `orderIndex` *(Kanban ordering)*
- `dueDate`, `completedAt`

**Indexes**
- Personal dashboards: `{ owner, isTeamTask, status, dueDate }`
- Kanban board: `{ team, status, orderIndex }`
- Assigned tasks: `{ assignedTo, status, dueDate }`
- Calendar queries: `{ dueDate }`

---

4. **Comment**
Represents comment threads attached to tasks.

**Key Fields**
- `task` (Task)
- `author` (User)
- `content`

**Indexes**
- `{ task, createdAt }`

---

5. **Activity**
Tracks meaningful events within the workspace.

**Examples**
- Task creation
- Status updates
- New assignments
- Comments added
- Team member joined
- Notification triggered

**Key Fields**
- `actor` (User)
- `team` (Team)
- `task` (Task)
- `type`
- `message`
- `meta` *(additional event metadata)*

**Indexes**
- `{ team, createdAt }`
- `{ task, createdAt }`
- `{ actor, createdAt }`

---

6. **Notification**
Used for the notification bell and notification inbox.

**Key Fields**
- `recipient` (User)
- `type` *(task assigned, comment added, due soon, etc.)*
- `title`, `body`
- `task` *(optional reference)*
- `team` *(optional reference)*
- `isRead`, `readAt`

**Indexes**
- `{ recipient, isRead, createdAt }`

---

Seed Data (Testing & Demo)

The application includes a full seed script located at:
npm run seed