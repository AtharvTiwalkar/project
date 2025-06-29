import express from 'express';
import User from '../models/User';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Get user profile
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const profileData = {
      ...user.toObject(),
      phone: '+1 (555) 123-4567',
      address: '123 Main St, New York, NY 10001',
      dateOfBirth: '1990-05-15',
      occupation: 'Software Engineer',
      company: 'Tech Solutions Inc.',
      preferences: {
        notifications: true,
        sms: false,
        marketing: true,
        reports: true
      },
      security: {
        twoFactor: true,
        loginAlerts: true,
        deviceTracking: false
      }
    };

    res.json(profileData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile data' });
  }
});

// Update user profile
router.put('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { name, email } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
