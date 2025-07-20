import { useEffect, useState } from 'react';
import { useAxiosAuth } from '../hooks/useAxiosAuth';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useSearchParams } from 'react-router-dom';

export default function LearningProgress() {
  const axiosAuth = useAxiosAuth();
  const [data, setData] = useState(null);
  const [newProgress, setNewProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  const [isPairing, setIsPairing] = useState(false);
  const [isUnpairing, setIsUnpairing] = useState(false);
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId'); // for completed course view

  const fetchLearning = async () => {
    setLoading(true);
    try {
      const endpoint = courseId
        ? `/learning/completed/${courseId}` // endpoint for completed
        : '/learning/me'; // current active course

      const res = await axiosAuth.get(endpoint);
      setData(res.data);
      setNewProgress(res.data?.myProgress || res.data?.progress || 0);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Not enrolled in any course');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearning();
  }, [courseId]);

  useEffect(() => {
    if (data?.myProgress === 100 && !data?.isComplete) {
      markComplete();
    }
  }, [data]);

  const updateProgress = async () => {
    try {
      await axiosAuth.patch('/learning/progress', { progress: newProgress });
      toast.success('Progress updated!');
      setData((prev) => ({ ...prev, myProgress: newProgress }));
    } catch (err) {
      toast.error('Failed to update progress');
    }
  };

  const markComplete = async () => {
    if (data.myProgress < 50) {
      toast.error('📉 Minimum 50% progress required to complete the course');
      return;
    }
    try {
      await axiosAuth.patch('/learning/complete');
      toast.success('🎉 Course marked as complete!');
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        fetchLearning();
      }, 4000);
    } catch {
      toast.error('Failed to mark complete');
    }
  };

  const leaveCourse = async () => {
    try {
      await axiosAuth.delete('/learning/leave');
      toast.success('You have left the course');
      setData(null);
    } catch {
      toast.error('Failed to leave course');
    }
  };

  const findBuddy = async () => {
    try {
      setIsPairing(true);
      const res = await axiosAuth.post('/learning/join', { courseId: data.courseId });
      toast.success(res.data.message || 'Buddy paired!');
      fetchLearning();
    } catch (err) {
      toast.error(err.response?.data?.error || 'No buddy found');
    } finally {
      setIsPairing(false);
    }
  };

  const unpairBuddy = async () => {
    try {
      setIsUnpairing(true);
      await axiosAuth.delete('/learning/unpair');
      toast.success('Unpaired successfully');
      fetchLearning();
    } catch {
      toast.error('Failed to unpair');
    } finally {
      setIsUnpairing(false);
    }
  };

  if (loading) return <div className="text-center mt-20 text-gray-600">Loading progress...</div>;
  if (!data) return <div className="text-center mt-20 text-gray-500">You're not enrolled in any course.</div>;

  const readonly = courseId || data.isComplete;

  return (
    <div className="min-h-screen bg-background px-4 py-10 flex justify-center relative">
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={400} />}

      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-xl w-full space-y-6">
        <h2 className="text-2xl font-bold text-primary">📘 {data.course?.title || data.course}</h2>

        <div>
          <p className="text-gray-600 mb-1">Your Progress</p>
          <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${data.myProgress || data.progress || 0}%` }}
            ></div>
          </div>
          <p className="text-sm text-right text-gray-500 mt-1">
            {data.myProgress || data.progress || 0}%
          </p>

          {!readonly && (
            <>
              <label className="block mt-4 font-medium">Update Progress</label>
              <input
                type="range"
                min="0"
                max="100"
                value={newProgress}
                onChange={(e) => setNewProgress(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <button
                onClick={updateProgress}
                className="mt-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition w-full"
              >
                💾 Save Progress
              </button>
            </>
          )}
        </div>

        {data.buddy && !readonly && (
          <div className="border-t pt-4 text-yellow-700">
            <h3 className="text-lg font-semibold text-accent mb-1">🎯 Buddy Info</h3>
            <p><strong>Name:</strong> {data.buddy.name}</p>
            <p><strong>Email:</strong> {data.buddy.email}</p>
            <p><strong>Progress:</strong> {data.buddyProgress ?? 0}%</p>

            <button
              onClick={unpairBuddy}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 w-full"
              disabled={isUnpairing}
            >
              ❌ {isUnpairing ? 'Unpairing...' : 'Unpair Buddy'}
            </button>
          </div>
        )}

        {!data.buddy && !readonly && (
          <div className="text-center text-yellow-600 border-t pt-4">
            <p className="font-medium mb-2">🤝 Not paired yet</p>
            <button
              onClick={findBuddy}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition w-full"
              disabled={isPairing}
            >
              🔄 {isPairing ? 'Finding Buddy...' : 'Find a Buddy'}
            </button>
          </div>
        )}

        <div className="flex gap-4 mt-6">
          {!readonly ? (
            <>
              <button
                onClick={markComplete}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
              >
                ✅ Mark as Complete
              </button>
              <button
                onClick={leaveCourse}
                className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-xl hover:bg-gray-500 transition"
              >
                ❌ Leave Course
              </button>
            </>
          ) : (
            <div className="w-full text-center text-green-600 font-semibold">
              ✅ You have completed this course!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
