import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import LearningProgress from './pages/LearningProgress';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import ForgotPassword from './pages/ForgotPassword';
import CourseDetails from './pages/CourseDetails';
import Notifications from './pages/NotificationBell';
import Loader from './components/Loader';
import CompletedCourses from './pages/CompletedCourses';

export default function App() {
  const { user, authLoading } = useAuth(); // ⬅️ get authLoading too

  // ✅ Block the whole app while checking auth
  if (authLoading) {
    return (
      <Loader />
    );
  }

  // ✅ ProtectedRoute logic
  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" />;
    return children;
  };

  // ✅ AdminRoute logic
  const AdminRoute = ({ children }) => {
    if (!user || user.role !== 'Admin') return <Navigate to="/dashboard" />;
    return children;
  };

  return (
    <div className="font-sans bg-background min-h-screen">
      {user && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!user ? <Landing /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/completed-courses" element={<ProtectedRoute><CompletedCourses /></ProtectedRoute>} />
        <Route path="/courses/:id" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><LearningProgress /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

        {/* Admin Only */}
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </div>
  );
}
