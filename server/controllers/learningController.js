const Learning = require('../models/Learning');
const Course = require('../models/Course');
const User = require('../models/User');

exports.joinCourse = async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id;

  // ✅ Prevent joining if already in an active course
  const existing = await Learning.findOne({ user: userId, isComplete: false });

  if (existing) {
    return res.status(400).json({
      error: 'You must complete or leave your current course before joining a new one.'
    });
  }

  // Proceed with finding buddy and enrolling...
  const newBuddy = await Learning.findOne({
    course: courseId,
    buddy: null,
    user: { $ne: userId },
  });

  let newLearning;

  if (newBuddy) {
    newBuddy.buddy = userId;
    await newBuddy.save();

    newLearning = await Learning.create({
      user: userId,
      course: courseId,
      buddy: newBuddy.user,
    });
  } else {
    newLearning = await Learning.create({ user: userId, course: courseId });
  }

  await Course.findByIdAndUpdate(courseId, { $inc: { activeLearners: 1 } });

  res.status(201).json({ message: 'Joined and paired (if available)', learning: newLearning });
};

exports.getMyLearning = async (req, res) => {
  let learning = await Learning.findOne({ user: req.user.id, isComplete: false })
    .populate('course', 'title')
    .populate('buddy', 'name email');

  // ✅ If no active learning, fallback to completed course
  if (!learning) {
    learning = await Learning.findOne({ user: req.user.id, isComplete: true })
      .populate('course', 'title')
      .populate('buddy', 'name email');

    if (!learning) return res.status(200).json(null); // Not enrolled in anything
  }

  let buddyProgress = null;
  if (learning.buddy) {
    const buddyLearning = await Learning.findOne({
      user: learning.buddy,
      course: learning.course._id,
    });
    if (buddyLearning) buddyProgress = buddyLearning.progress;
  }

  res.json({
    course: learning.course.title,
    courseId: learning.course._id,
    myProgress: learning.progress,
    buddy: learning.buddy || null,
    buddyProgress,
    isComplete: learning.isComplete,
  });
};

// PATCH /api/learning/progress
exports.updateProgress = async (req, res) => {
  const { progress } = req.body;

  // ✅ Only update progress of active (incomplete) course
  const learning = await Learning.findOneAndUpdate(
    { user: req.user.id, isComplete: false },
    { progress },
    { new: true }
  );

  if (!learning)
    return res.status(404).json({ error: 'No active course found for progress update' });

  res.json({ message: 'Progress updated', progress: learning.progress });
};

//unpair buddy
exports.unpair = async (req, res) => {
  const userId = req.user.id;
  const learning = await Learning.findOne({ user: userId });
  if (!learning) return res.status(404).json({ error: 'Not enrolled' });

  if (learning.buddy) {
    const buddyEntry = await Learning.findOne({ user: learning.buddy });
    if (buddyEntry) {
      buddyEntry.buddy = null;
      await buddyEntry.save();
    }
    learning.buddy = null;
    await learning.save();
    return res.json({ message: 'Unpaired successfully' });
  }

  res.status(400).json({ error: 'No buddy to unpair' });
};

exports.markAsComplete = async (req, res) => {
  try {
    const learning = await Learning.findOne({ user: req.user.id, isComplete: false }); // ✅ only active course

    if (!learning)
      return res.status(404).json({ error: 'Not enrolled in any active course' });

    if (learning.progress < 50)
      return res.status(400).json({ error: 'Minimum 50% progress required to complete the course' });

    learning.isComplete = true;
    await learning.save();

    res.json({ message: 'Course marked as complete' });
  } catch (err) {
    console.error('❌ Error marking complete:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.leaveCourse = async (req, res) => {
  try {
    const learning = await Learning.findOne({ user: req.user.id });
    if (!learning) return res.status(404).json({ error: 'You are not enrolled in a course' });

    // Unpair buddy if exists
    if (learning.buddy) {
      const buddyLearning = await Learning.findOne({ user: learning.buddy, course: learning.course });
      if (buddyLearning) {
        buddyLearning.buddy = null;
        await buddyLearning.save();
      }
    }

    await learning.deleteOne();

    res.json({ message: 'Left course successfully' });
  } catch (err) {
    console.error('❌ Error leaving course:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/learning/completed
exports.getCompletedCourses = async (req, res) => {
  const completed = await Learning.find({ user: req.user.id, isComplete: true })
    .populate('course', 'title category difficulty')
    .sort({ updatedAt: -1 });

  res.json(completed);
};

// GET /api/learning/completed/:courseId
exports.getCompletedCourse = async (req, res) => {
  const learning = await Learning.findOne({
    user: req.user.id,
    course: req.params.courseId,
    isComplete: true,
  }).populate('course', 'title category difficulty');
  
  if (!learning) return res.status(404).json({ error: 'Course not found' });

  res.json({
    course: learning.course.title,
    courseId: learning.course._id,
    myProgress: learning.progress,
    isComplete: true,
    buddy: null,
  });
};

