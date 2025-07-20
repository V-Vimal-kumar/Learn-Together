import { useEffect, useState } from 'react';
import { useAxiosAuth } from '../hooks/useAxiosAuth';
import toast from 'react-hot-toast';
import { Check, X } from 'lucide-react';

export default function Notifications() {
  const axiosAuth = useAxiosAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await axiosAuth.get('/pair-requests');
      setRequests(res.data.requests);
    } catch (err) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (id, action) => {
    setResponding(id);
    try {
      await axiosAuth.patch(`/pair-requests/${id}`, { action });
      toast.success(`Request ${action}`);
      fetchRequests(); // refresh
    } catch (err) {
      toast.error('Action failed');
    } finally {
      setResponding(null);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-primary">🔔 Pair Requests</h2>

      {requests.length === 0 ? (
        <p className="text-gray-500">No incoming requests.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li
              key={req._id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {req.from.name} wants to pair with you for <span className="text-primary">{req.course.title}</span>
                </p>
                <p className="text-sm text-gray-500">{req.from.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleResponse(req._id, 'accepted')}
                  disabled={responding === req._id}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                >
                  <Check size={16} /> Accept
                </button>
                <button
                  onClick={() => handleResponse(req._id, 'rejected')}
                  disabled={responding === req._id}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                >
                  <X size={16} /> Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
