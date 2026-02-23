const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn('JWT_SECRET is not set. Set it in your environment for production use.');
}

exports.register = async (req, res) => {
  // For development convenience only. Disable in production.
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ error: true, message: 'Registration disabled' });
  }

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: true, message: 'Email and password required' });

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: true, message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({ email, passwordHash });
    await user.save();

    return res.status(201).json({ email: user.email, id: user._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: true, message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: true, message: 'Email and password required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: true, message: 'Invalid credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ error: true, message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET || 'dev-secret', {
      expiresIn: '1h'
    });

    return res.json({ token, expiresIn: 3600, user: { email: user.email, id: user._id } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: true, message: 'Server error' });
  }
};
