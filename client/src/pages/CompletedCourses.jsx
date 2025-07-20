import { useEffect, useState } from 'react';
import { useAxiosAuth } from '../hooks/useAxiosAuth';
import { useNavigate } from 'react-router-dom';

export default function CompletedCourses() {
  const [completedCourses, setCompletedCourses] = useState([]);
  const axiosAuth = useAxiosAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompleted = async () => {
      const res = await axiosAuth.get('/learning/completed');
      setCompletedCourses(res.data);
    };
    fetchCompleted();
  }, []);

  return (
    <div className="min-h-screen bg-background px-4 py-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-6">🎓 Completed Courses</h1>
      {completedCourses.length === 0 ? (
        <p className="text-gray-600">You haven’t completed any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedCourses.map(({ course, progress }) => (
            <div
              key={course._id}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              onClick={() => navigate(`/courses/${course._id}`)}
            >
              <h3 className="text-lg font-bold text-primary mb-2">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-1">Category: {course.category}</p>
              <p className="text-sm text-gray-600 mb-1">Difficulty: {course.difficulty}</p>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-2">
                <div className="bg-green-500 h-full" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-sm text-right text-gray-500 mt-1">{progress}% Completed</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
