const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const Otp = require('../models/Otp.js');
const { generateTokens } = require('../utils/generateToken.js');
const nodemailer = require('nodemailer');

const isProduction = process.env.NODE_ENV === 'production';

// 🔐 Helper: Set Refresh Token Cookie
const setRefreshCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'Strict' : 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// ✅ Register
exports.register = async (req, res) => {
  const { name, email, password, role, adminKey } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    let finalRole = 'User';

    if (role === 'Admin' && adminKey === process.env.ADMIN_SECRET) {
      finalRole = 'Admin';
    }

    const user = await User.create({ name, email, password: hashed, role: finalRole });
    const tokens = generateTokens(user);

    setRefreshCookie(res, tokens.refreshToken);
    res.json({
      user: { id: user._id, name: user.name, role: user.role },
      accessToken: tokens.accessToken,
    });
  } catch (err) {
    console.error('❌ Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// ✅ Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const tokens = generateTokens(user);
    setRefreshCookie(res, tokens.refreshToken);

    res.json({
      user: { id: user._id, name: user.name, role: user.role },
      accessToken: tokens.accessToken,
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

// ✅ Refresh Access Token
exports.refresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, process.env.REFRESH_SECRET);
    const user = await User.findById(payload.id);

    if (!user) return res.sendStatus(403);

    const tokens = generateTokens(user);
    setRefreshCookie(res, tokens.refreshToken);

    res.json({ accessToken: tokens.accessToken });
  } catch (err) {
    console.error('❌ Refresh error:', err);
    res.sendStatus(403);
  }
};

// ✅ Logout
exports.logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.sendStatus(200);
};

// ✅ Send OTP
exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await Otp.create({ email, code });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'LearnTogether OTP Code',
    html: `<p>Your OTP code is <b>${code}</b>. It expires in 5 minutes.</p>`,
  });

  res.json({ message: 'OTP sent to email' });
};

// ✅ Verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, code } = req.body;

  const otp = await Otp.findOne({ email, code });
  if (!otp) return res.status(400).json({ error: 'Invalid OTP' });

  res.json({ message: 'OTP verified' });
};

// ✅ Reset Password
exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  const otp = await Otp.findOne({ email, code });
  if (!otp) return res.status(400).json({ error: 'Invalid or expired OTP' });

  const hashed = await bcrypt.hash(newPassword, 10);
  await User.findOneAndUpdate({ email }, { password: hashed });

  await Otp.deleteMany({ email }); // cleanup
  res.json({ message: 'Password reset successful' });
};
