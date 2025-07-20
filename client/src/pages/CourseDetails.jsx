import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAxiosAuth } from '../hooks/useAxiosAuth';
import toast from 'react-hot-toast';

export default function CourseDetails() {
  const { id: courseId } = useParams();
  const axiosAuth = useAxiosAuth();
  const [course, setCourse] = useState(null);
  const [learners, setLearners] = useState([]);
  const [me, setMe] = useState(null);
  const [learning, setLearning] = useState(null);
  const [requestingId, setRequestingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const [courseRes, userRes, learningRes] = await Promise.all([
        axiosAuth.get(`/courses/${courseId}`),
        axiosAuth.get(`/users/me`),
        axiosAuth.get(`/learning/me`).catch(() => null),
      ]);

      setCourse(courseRes.data.course);
      setLearners(courseRes.data.learners);
      setMe(userRes.data);
      if (learningRes?.data) setLearning(learningRes.data);
    } catch (err) {
  toast.error('Failed to load course', { id: 'fetch-fail' });
} finally {
  setLoading(false);
}

  };

  useEffect(() => {
    fetchAll();
  }, [courseId]);

  const sendPairRequest = async (targetUserId) => {
    try {
      setRequestingId(targetUserId);
      await axiosAuth.post('/pair-requests/send', { courseId, targetUserId });
      toast.success('Pair request sent!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send request');
    } finally {
      setRequestingId(null);
    }
  };

  const unpairBuddy = async () => {
    try {
      await axiosAuth.delete('/learning/unpair');
      toast.success('Unpaired successfully');
      fetchAll(); // refresh data
    } catch {
      toast.error('Unpair failed');
    }
  };

  const isSelf = (learnerId) => learnerId === me?._id;
  const isBuddy = (learnerId) => learnerId === learning?.buddy?._id;

  const renderButton = (learnerId) => {
    if (isSelf(learnerId)) return <span className="text-sm text-gray-500">👤 You</span>;
    if (isBuddy(learnerId)) {
      return (
        <button
          onClick={unpairBuddy}
          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
        >
          ❌ Unpair
        </button>
      );
    }
    return (
      <button
        onClick={() => sendPairRequest(learnerId)}
        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
        disabled={requestingId === learnerId}
      >
        {requestingId === learnerId ? 'Sending...' : 'Pair'}
      </button>
    );
  };

  if (loading) return <div className="text-center mt-10 text-gray-600">Loading course details...</div>;
  if (!course) return <div className="text-center mt-10 text-red-600">Course not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Course Information */}
      <div className="bg-white shadow rounded-xl p-6">
        <h1 className="text-3xl font-bold text-primary mb-2">📘 {course.title}</h1>
        <p className="text-gray-700 leading-relaxed">{course.description}</p>
      </div>

      {/* Learners & Pairing */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">👥 Learners You Can Pair With</h2>

        {learners.length === 0 ? (
          <p className="text-gray-500">No learners enrolled yet.</p>
        ) : (
          <ul className="space-y-3">
            {learners.map((learner) => (
              <li
                key={learner._id}
                className="flex justify-between items-center border rounded-lg p-4"
              >
                <div>
                  <p className="font-semibold">{learner.name}</p>
                  <p className="text-sm text-gray-500">{learner.email}</p>
                </div>
                {renderButton(learner._id)}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Buddy Info */}
      {learning?.buddy && (
        <div className="bg-yellow-50 shadow rounded-xl p-5 border border-yellow-200 text-yellow-800">
          <h3 className="text-lg font-semibold mb-2">🎯 You are currently paired with:</h3>
          <p><strong>Name:</strong> {learning.buddy.name}</p>
          <p><strong>Email:</strong> {learning.buddy.email}</p>
        </div>
      )}
    </div>
  );
}
