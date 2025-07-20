import { useEffect, useState } from 'react';
import { useAxiosAuth } from '../hooks/useAxiosAuth';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const axiosAuth = useAxiosAuth();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axiosAuth.get('/users/all');
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id, newRole) => {
    try {
      await axiosAuth.put(`/users/${id}/role`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      fetchUsers();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">👑 Admin Panel</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-sm">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Change Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3">
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user._id, e.target.value)}
                      className="border border-gray-300 px-2 py-1 rounded"
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
