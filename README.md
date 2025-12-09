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

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/taskflow.git
    cd taskflow
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory based on `.env.example`:
    ```env
    PORT=5000
    MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
    JWT_SECRET=your_super_secret_key_123
    NODE_ENV=development
    ```

4.  **Seed the Database** (Optional but recommended for testing)
    Populate the database with test users, teams, and tasks:
    ```bash
    npm run seed
    ```

## 🏃‍♂️ Running the Application

To run both the backend server and frontend client concurrently:

```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

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
