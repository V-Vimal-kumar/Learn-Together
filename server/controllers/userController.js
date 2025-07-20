const User = require('../models/User');
const Course = require('../models/Course');
const PairRequest = require('../models/PairRequest');

//getMe
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // exclude password
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ user }); // ✅ frontend expects this
  } catch (err) {
    console.error('getMe error:', err.message);
    res.status(500).json({ error: 'Server error while fetching user' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('❌ Error fetching user:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update own profile
exports.updateProfile = async (req, res) => {
  const { name, password } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (password) updates.password = await bcrypt.hash(password, 10);

  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'Profile updated successfully', user });
};

// Admin updates user role
exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!['User', 'Admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' });

  const user = await User.findByIdAndUpdate(id, { role }, { new: true });
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({ message: `Role updated to ${role}`, user });
};

// PairRequest
exports.sendRequest = async (req, res) => {
  const from = req.user.id;
  const { targetUserId, courseId } = req.body;

  try {
    const existing = await PairRequest.findOne({
      from,
      to: targetUserId,
      course: courseId,
      status: 'Pending',
    });

    if (existing) return res.status(400).json({ error: 'Request already sent' });

    const request = await PairRequest.create({
      from,
      to: targetUserId,
      course: courseId,
    });

    res.status(201).json({ message: 'Pair request sent successfully', request });
  } catch (err) {
    console.error('❌ Failed to send pair request:', err.message);
    res.status(500).json({ error: 'Server error while sending pair request' });
  }
};

