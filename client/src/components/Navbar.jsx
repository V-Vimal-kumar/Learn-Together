import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { Bell, Menu, X } from 'lucide-react';
import { useAxiosAuth } from '../hooks/useAxiosAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const axiosAuth = useAxiosAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axiosAuth.get('/pair-requests');
        setUnreadCount(res.data.requests.length);
      } catch (err) {
        console.error('Notification fetch failed', err);
      }
    };

    if (user) fetchNotifications();
  }, [user]);

  const navLink = `text-gray-700 hover:text-primary transition font-medium`;

  return (
    <nav className="bg-white shadow-md px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold text-primary">
          LearnTogether
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/completed-courses" className={navLink}>Courses Completed</Link>
          <Link to="/progress" className={navLink}>Progress</Link>
          <Link to="/profile" className={navLink}>Profile</Link>

          {user?.role === 'Admin' && (
            <Link to="/admin" className="text-yellow-600 hover:text-yellow-700 font-semibold">Admin</Link>
          )}

          <Link to="/notifications" className="relative">
            <Bell className="w-5 h-5 text-gray-700 hover:text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full animate-pulse">
                {unreadCount}
              </span>
            )}
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-primary" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Links */}
      {mobileOpen && (
        <div className="md:hidden mt-4 space-y-2 px-2">
          <Link to="/completed-courses" className={navLink}>Courses Completed</Link>
          <Link to="/progress" className={navLink}>Progress</Link>
          <Link to="/profile" className={navLink}>Profile</Link>

          {user?.role === 'Admin' && (
            <Link to="/admin" className="text-yellow-600 hover:text-yellow-700 font-semibold">Admin</Link>
          )}

          <Link to="/notifications" className="relative block">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-700 hover:text-primary" />
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 rounded-full animate-pulse">
                  {unreadCount}
                </span>
              )}
              <span>Notifications</span>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-2 w-full rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
