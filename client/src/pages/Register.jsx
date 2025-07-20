import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../services/axios';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User',        // 👈 default role
    adminKey: '',        // 👈 optional admin key
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/register', form);
      toast.success('Registered! Please login');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-primary text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Name" className="input" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" className="input" autoComplete="email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" className="input" onChange={handleChange} required />

          {/* 👇 Role Select */}
          <select name="role" className="input" value={form.role} onChange={handleChange}>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>

          {/* 👇 Admin key only if Admin role selected */}
          {form.role === 'Admin' && (
            <input
              type="text"
              name="adminKey"
              placeholder="Admin Secret Key"
              className="input"
              onChange={handleChange}
              required
            />
          )}

          <button type="submit" className="btn-primary w-full">Register</button>
        </form>
        <p className="text-center mt-4 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
