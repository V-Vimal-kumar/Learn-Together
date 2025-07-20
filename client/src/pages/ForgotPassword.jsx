import { useState } from 'react';
import axios from '../services/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/send-otp', { email });
      toast.success('OTP sent to email');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/verify-otp', { email, code });
      toast.success('OTP verified');
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid OTP');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/reset-password', { email, code, newPassword });
      toast.success('Password reset! You can now login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow max-w-md w-full">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Forgot Password</h2>

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your registered email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary w-full">Send OTP</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP sent to email"
              className="input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary w-full">Verify OTP</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="password"
              placeholder="Enter new password"
              className="input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary w-full">Reset Password</button>
          </form>
        )}
      </div>
    </div>
  );
}
