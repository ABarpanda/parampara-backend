import express from 'express';
import supabase from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, state_name, profile_pic, region, created_at')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      state_name: user.state_name,
      profile_pic: user.profile_pic,
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
      profile_pic: user.profile_pic,
      region: user.region,
      createdAt: user.created_at
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update my profile (protected)
router.put('/me/profile', authMiddleware, async (req, res) => {
  try {
    const { full_name, state_name, profile_pic, region } = req.body;
    const updateFields = {};
    if (full_name) updateFields.full_name = full_name;
    if (state_name) updateFields.state_name = state_name;
    if (region) updateFields.region = region;
    if (profile_pic !== undefined) updateFields.profile_pic = profile_pic;

    updateFields.updated_at = new Date();

    const { data: user, error } = await supabase
      .from('users')
      .update(updateFields)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      state_name: user.state_name,
      profile_pic: user.profile_pic,
      region: user.region
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/me/delete', authMiddleware, async (req, res) => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', req.user.id);

    if (error) throw error;

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
