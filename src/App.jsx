import { Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import WelcomePage from "./pages/WelcomePage";
import DashboardPage from "./pages/DashboardPage";
import TasksPage from "./pages/TasksPage";
import CalendarPage from "./pages/CalendarPage";
import TeamsPage from "./pages/TeamsPage";
import TeamBoardPage from "./pages/TeamBoardPage";
import JoinTeamPage from "./pages/JoinTeamPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import HelpPage from "./pages/HelpPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/layout/Layout";

const App = () => {
  return (
    <ToastProvider>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        {/* Team join route - can be accessed by non-authenticated users */}
        <Route path="/teams/join" element={<JoinTeamPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <Layout>
                {/* nested routes render here */}
              </Layout>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/teams/:teamId" element={<TeamBoardPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/help" element={<HelpPage />} />
          </Route>
          {/* Welcome page - protected but without layout */}
          <Route path="/welcome" element={<WelcomePage />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ToastProvider>
  );
};

export default App;
