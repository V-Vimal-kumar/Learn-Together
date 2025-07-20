const PairRequest = require('../models/PairRequest.js');
const Learning = require('../models/Learning.js');

exports.sendRequest = async (req, res) => {
  const from = req.user.id;
  const { targetUserId, courseId } = req.body;

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

  res.status(201).json({ message: 'Pair request sent', request });
};

exports.getMyRequests = async (req, res) => {
  const incoming = await PairRequest.find({ to: req.user.id, status: 'Pending' })
    .populate('from', 'name email')
    .populate('course', 'title');

  res.json({ requests: incoming });
};

// PATCH /api/pair-requests/:id
exports.respondToRequest = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'accepted' or 'rejected'

  const request = await PairRequest.findById(id);
  if (!request || request.to.toString() !== req.user.id)
    return res.status(403).json({ error: 'Not allowed' });

  request.status = action.charAt(0).toUpperCase() + action.slice(1); // ✅ Capitalize

  await request.save();

  if (action === 'accepted') {
    const myLearning = await Learning.findOne({ user: req.user.id, course: request.course });
    const theirLearning = await Learning.findOne({ user: request.from, course: request.course });

    if (myLearning && theirLearning) {
      myLearning.buddy = request.from;
      theirLearning.buddy = req.user.id;
      await myLearning.save();
      await theirLearning.save();
    }
  }

  res.json({ message: `Request ${action}` });
};
