const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-login';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  name: { type: String, default: '', trim: true },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, default: '', maxlength: 1000 },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  dueDate: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});
const Task = mongoose.model('Task', taskSchema);

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Activity = mongoose.model('Activity', activitySchema);

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

async function logActivity(userId, action) {
  try {
    await Activity.create({ userId, action });
  } catch {}
}

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !email.includes('@')) return res.status(400).json({ message: 'Valid email is required' });
    if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (await User.findOne({ email })) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, name: name || '' });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '24h' });
    await logActivity(newUser._id, 'Account created');

    res.status(201).json({ message: 'User created successfully', token, user: { id: newUser._id, email: newUser.email, name: newUser.name } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });
    if (!await bcrypt.compare(password, user.password)) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    await logActivity(user._id, 'Logged in');

    res.json({ message: 'Login successful', token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/auth/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/auth/profile', auth, async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    if (name !== undefined && name.trim().length === 0) return res.status(400).json({ message: 'Name cannot be empty' });

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name !== undefined) user.name = name.trim();

    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ message: 'Current password required' });
      if (newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters' });
      if (!await bcrypt.compare(currentPassword, user.password)) return res.status(400).json({ message: 'Current password is incorrect' });
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    await logActivity(user._id, 'Profile updated');

    res.json({ message: 'Profile updated', user: { id: user._id, email: user.email, name: user.name } });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/tasks', auth, async (req, res) => {
  try {
    const { title, description, priority, dueDate, status } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ message: 'Title is required' });

    const task = new Task({ userId: req.user.userId, title: title.trim(), description, priority, dueDate, status });
    await task.save();
    await logActivity(req.user.userId, `Task "${task.title}" created`);

    res.status(201).json(task);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/tasks/:id', auth, async (req, res) => {
  try {
    if (req.body.title !== undefined && !req.body.title.trim()) return res.status(400).json({ message: 'Title cannot be empty' });

    const old = await Task.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!old) return res.status(404).json({ message: 'Task not found' });

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );

    if (req.body.status && req.body.status !== old.status) {
      await logActivity(req.user.userId, `Task "${task.title}" marked as ${task.status}`);
    } else {
      await logActivity(req.user.userId, `Task "${task.title}" updated`);
    }

    res.json(task);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await logActivity(req.user.userId, `Task "${task.title}" deleted`);
    res.json({ message: 'Task deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/activity', auth, async (req, res) => {
  try {
    const logs = await Activity.find({ userId: req.user.userId }).sort({ createdAt: -1 }).limit(20);
    res.json(logs);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
