import express from 'express';
import supabase from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, state_name, region, created_at')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      state_name: user.state_name,
      region: user.region,
      createdAt: user.created_at
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my profile (protected)
router.get('/me/profile', authMiddleware, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;

    res.json({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      state_name: user.state_name,
      region: user.region,
      createdAt: user.created_at
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//! Update methods are wrong

// Update profile (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { full_name, region } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .update({
        full_name: full_name,
        region
      })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      region: user.region
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update my profile (protected)
router.put('/me/profile', authMiddleware, async (req, res) => {
  try {
    const { full_name, region } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .update({
        full_name: full_name,
        region
      })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      region: user.region
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
