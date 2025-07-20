const Course = require('../models/Course.js');
const Learning = require('../models/Learning.js');
const mongoose = require('mongoose');

// Public route: All courses (for guests)
exports.getAllCourses = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};

// Admin: Add new course
exports.createCourse = async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.status(201).json(course);
};

// Admin: Update course
exports.updateCourse = async (req, res) => {
  const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: 'Course not found' });
  res.json(updated);
};

// Admin: Delete course
exports.deleteCourse = async (req, res) => {
  const deleted = await Course.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Course not found' });
  res.sendStatus(204);
};

//public route: Get public courses
exports.getPublicCourses = async (req, res) => {
  try {
    const courses = await Course.find(
      {
        category: { $exists: true, $ne: null, $ne: '' }
      },
      'title category difficulty activeLearners'
    );
    res.json(courses);
  } catch (err) {
    console.error('Error fetching public courses:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.getCourseDetails = async (req, res) => {
  const courseId = req.params.id;
  const currentUserId = req.user?.id; // If route is public, this may be undefined

  // 1. Validate ID
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ error: 'Invalid course ID' });
  }

  try {
    // 2. Fetch course
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // 3. Get other learners (excluding current user if logged in)
    const learners = await Learning.find({
      course: courseId,
      ...(currentUserId && { user: { $ne: currentUserId } }),
    }).populate('user', 'name email');

    // 4. Format response
    const learnerData = learners.map((entry) => ({
      _id: entry.user._id,
      name: entry.user.name,
      email: entry.user.email,
    }));

    res.json({ course, learners: learnerData });
  } catch (err) {
    console.error('❌ Error fetching course details:', err);
    res.status(500).json({ error: 'Failed to fetch course details' });
  }
};
