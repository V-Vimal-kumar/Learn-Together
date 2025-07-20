import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAxiosAuth } from '../hooks/useAxiosAuth';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuth();
  const axiosAuth = useAxiosAuth();

  const [name, setName] = useState(user.name || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosAuth.put('/users/me', {
        ...(name !== user.name && { name }),
        ...(password && { password }),
      });
      toast.success('Profile updated successfully!');
      setPassword('');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const isModified = name !== user.name || password;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">👤 My Profile</h2>
        <form onSubmit={updateProfile} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-style w-full"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">New Password <span className="text-sm text-gray-400">(optional)</span></label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-style w-full"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={!isModified || loading}
            className={`w-full py-2 rounded-xl transition text-white ${
              !isModified || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-blue-700'
            }`}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
