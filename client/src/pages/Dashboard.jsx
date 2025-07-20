import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAxiosAuth } from '../hooks/useAxiosAuth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, authLoading } = useAuth();
  const axiosAuth = useAxiosAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [currentLearning, setCurrentLearning] = useState(null);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [filters, setFilters] = useState({ category: '', difficulty: '' });

  useEffect(() => {
    if (!authLoading && user) {
      fetchCourses();
      fetchCurrentLearning();
      fetchCompletedCourses();
    }
  }, [user, authLoading]);

  const fetchCourses = async () => {
    try {
      const res = await axiosAuth.get(user?.role === 'Admin' ? '/courses' : '/courses/public');
      setCourses(res.data);
    } catch {
      toast.error('Failed to load courses');
    }
  };

  const fetchCurrentLearning = async () => {
    try {
      const res = await axiosAuth.get('/learning/me');
      setCurrentLearning(res.data);
    } catch {
      setCurrentLearning(null);
    }
  };

  const fetchCompletedCourses = async () => {
    try {
      const res = await axiosAuth.get('/learning/completed');
      setCompletedCourses(res.data);
    } catch {
      setCompletedCourses([]);
    }
  };

  const joinCourse = async (courseId) => {
    if (currentLearning && currentLearning.course !== courseId && !currentLearning.isComplete) {
      toast.error('Complete or leave your current course before joining a new one.');
      return;
    }

    try {
      await axiosAuth.post('/learning/join', { courseId });
      toast.success('Joined course successfully!');
      fetchCurrentLearning();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to join');
    }
  };

  const deleteCourse = async (id) => {
    try {
      await axiosAuth.delete(`/courses/${id}`);
      toast.success('Course deleted');
      fetchCourses();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const filteredCourses = courses.filter((course) => {
    return (
      course.title.toLowerCase().includes(search.toLowerCase()) &&
      (filters.category ? course.category === filters.category : true) &&
      (filters.difficulty ? course.difficulty === filters.difficulty : true)
    );
  });

  const categories = [...new Set(courses.map(c => c.category?.trim()))].filter(Boolean);

  const isCourseCompleted = (courseId) => completedCourses.some(c => c.course._id === courseId);
  const getCompletedProgress = (courseId) => {
    const course = completedCourses.find(c => c.course._id === courseId);
    return course?.progress || 100;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600 animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-primary">Hello, {user?.name} 👋</h1>
        <p className="text-gray-600">
          Welcome to <span className="font-semibold">LearnTogether</span> — the place to pair up and grow together!
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
        <input
          type="text"
          placeholder="Search courses..."
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-2 flex-wrap">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-2 border rounded-lg shadow-sm"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
            className="px-4 py-2 border rounded-lg shadow-sm"
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length === 0 ? (
          <p>No courses found with current filters</p>
        ) : (
          filteredCourses.map((course) => {
            const isCurrentCourse = currentLearning?.course === course._id;
            const isCompleted = isCourseCompleted(course._id);
            const isBlocked =
              currentLearning &&
              !isCompleted &&
              !isCurrentCourse &&
              !currentLearning.isComplete;

            return (
              <div
                key={course._id}
                className="relative bg-white p-5 rounded-xl shadow hover:shadow-lg transition group cursor-pointer"
                onClick={() => navigate(isCompleted ? `/progress?courseId=${course._id}` : `/courses/${course._id}`)}
              >
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-primary">{course.title}</h3>
                  {course.category && <p className="text-sm text-gray-600">Category: {course.category}</p>}
                  {course.difficulty && <p className="text-sm text-gray-600">Difficulty: {course.difficulty}</p>}
                  {course.activeLearners !== undefined && (
                    <p className="text-sm text-gray-500">👨‍🎓 Active Learners: {course.activeLearners}</p>
                  )}
                </div>

                {isCompleted && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600 font-medium">🎉 Completed</p>
                    <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                      <div
                        className="bg-green-500 h-full rounded-full"
                        style={{ width: `${getCompletedProgress(course._id)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 text-right mt-1">
                      {getCompletedProgress(course._id)}%
                    </p>
                  </div>
                )}

                <div
                  className="absolute right-5 top-5 z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isCompleted ? (
                    <button
                      onClick={() => navigate(`/progress?courseId=${course._id}`)}
                      className="px-3 py-1 rounded text-sm bg-green-500 text-white hover:bg-green-600 transition"
                    >
                      View
                    </button>
                  ) : user?.role === 'Admin' ? (
                    <button
                      onClick={() => deleteCourse(course._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (isBlocked) {
                          toast.warning('Complete or leave current course before joining a new one');
                          return;
                        }
                        joinCourse(course._id);
                      }}
                      className={`
                        px-3 py-1 rounded text-sm transition 
                        ${isCurrentCourse
                          ? 'bg-gray-400 text-white cursor-default'
                          : 'bg-primary text-white hover:bg-blue-700'}
                        ${isBlocked ? 'cursor-not-allowed' : ''}`}
                      title={
                        isCurrentCourse
                          ? 'Already joined'
                          : isBlocked
                            ? 'Complete current course to join another'
                            : 'Join this course'
                      }
                    >
                      {isCurrentCourse ? 'Joined' : 'Join'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
