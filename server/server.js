const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/course.js')
const userRoutes = require('./routes/user.js');
const learningRoutes = require('./routes/learning.js');
const pairRequestRoutes = require('./routes/pairRequest.js');

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// CORS config (adjust origin in production)
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/pair-requests', pairRequestRoutes);

// Database connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));

// Default route
app.get('/', (req, res) => {
  res.send('LearnTogether API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
