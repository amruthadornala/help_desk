import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../database/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_college_helpdesk_key_2026_change_me_in_production';

function makePayload(user) {
  return {
    id:         user._id.toString(),
    name:       user.name,
    email:      user.email,
    role:       user.role,
    student_id: user.student_id || null,
    department: user.department || 'General'
  };
}

export async function register(req, res) {
  try {
    const { name, email, password, student_id, department } = req.body;

    if (!name || !name.trim())
      return res.status(400).json({ error: 'Please enter your full name.' });
    if (!email || !email.trim() || !email.includes('@'))
      return res.status(400).json({ error: 'Please enter a valid college email address.' });
    if (!password || password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing)
      return res.status(409).json({ error: 'An account with this email address already exists. Please login.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name:       name.trim(),
      email:      email.trim().toLowerCase(),
      password:   hashedPassword,
      role:       'student',
      student_id: student_id ? student_id.trim() : null,
      department: department ? department.trim() : 'General'
    });

    const userPayload = makePayload(newUser);
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Account registered successfully! Welcome to College Help Desk.',
      token,
      user: userPayload
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Something went wrong during registration. Please try again later.' });
  }
}

export async function login(req, res) {
  try {
    const { email, password, role } = req.body;

    if (!email || !email.trim())
      return res.status(400).json({ error: 'Please enter your email and password.' });
    if (!password || !password.trim())
      return res.status(400).json({ error: 'Please enter your email and password.' });

    // ── ADMIN: strict DB + bcrypt ──────────────────────────────
    if (role === 'admin') {
      const user = await User.findOne({ email: email.trim().toLowerCase(), role: 'admin' });
      if (!user)
        return res.status(401).json({ error: 'Invalid admin credentials.' });
      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(401).json({ error: 'Invalid admin credentials.' });
      const userPayload = makePayload(user);
      const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ message: 'Admin login successful!', token, user: userPayload });
    }

    // ── STUDENT: demo mode — any non-empty email + password ────
    let userPayload;
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      userPayload = makePayload(existingUser);
    } else {
      const guestName = email.trim().split('@')[0].replace(/[._]/g, ' ');
      const capitalizedName = guestName.split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      userPayload = {
        id:         null,
        name:       capitalizedName || 'Student',
        email:      email.trim().toLowerCase(),
        role:       'student',
        student_id: null,
        department: 'General'
      };
    }

    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ message: 'Login successful! Welcome to the College Help Desk.', token, user: userPayload });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
}

export async function getProfile(req, res) {
  try {
    // Guest users (id: null)
    if (!req.user.id) {
      return res.json({
        id:              null,
        name:            req.user.name,
        email:           req.user.email,
        role:            'student',
        student_id:      null,
        department:      'General',
        created_at:      new Date().toISOString(),
        questions_asked: 0
      });
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User profile not found.' });

    const { ChatHistory } = await import('../database/db.js');
    const questions_asked = await ChatHistory.countDocuments({ user_id: req.user.id });

    res.json({ ...user.toObject(), questions_asked });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Unable to retrieve profile.' });
  }
}

export async function updateProfile(req, res) {
  try {
    const { name, department, student_id } = req.body;
    if (!name || !name.trim())
      return res.status(400).json({ error: 'Name cannot be blank.' });

    if (!req.user.id)
      return res.status(400).json({ error: 'Guest accounts cannot update profiles.' });

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { name: name.trim(), department: department || 'General', student_id: student_id || null },
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully.', user: updated });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
}
