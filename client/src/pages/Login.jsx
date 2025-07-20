import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../services/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx'; // Adjusted import to match context file structure


export default function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    await login(form.email, form.password); // uses AuthContext login
    toast.success('Login successful');
    // No need to navigate here — context login already handles it
  } catch (err) {
    toast.error(err.message || 'Login failed');
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input"
            onChange={handleChange}
            required
          />

          {/* 👇 Forgot password link */}
          <p className="text-sm text-right mt-2">
            <Link to="/forgot" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </p>

          <button type="submit" className="btn-primary w-full">Login</button>
        </form>

        <p className="text-center mt-4 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
