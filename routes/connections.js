import express from 'express';
import supabase from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Follow a user
router.post('/follow/:userId', authMiddleware, async (req, res) => {
  try {
    if (req.params.userId === req.user.id) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    // Check if already following
    const { data: existing } = await supabase
      .from('connections')
      .select('id')
      .eq('follower_id', req.user.id)
      .eq('following_id', req.params.userId)
      .single();

    if (existing) {
      return res.status(400).json({ message: 'Already following' });
    }

    const { data: connection, error } = await supabase
      .from('connections')
      .insert({
        follower_id: req.user.id,
        following_id: req.params.userId,
        created_at: new Date()
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(connection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Unfollow a user
router.delete('/follow/:userId', authMiddleware, async (req, res) => {
  try {
    const { error } = await supabase
      .from('connections')
      .delete()
      .eq('follower_id', req.user.id)
      .eq('following_id', req.params.userId);

    if (error) throw error;

    res.json({ message: 'Unfollowed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get following
router.get('/following', authMiddleware, async (req, res) => {
  try {
    const { data: connections, error } = await supabase
      .from('connections')
      .select('following_id, users(*)')
      .eq('follower_id', req.user.id);

    if (error) throw error;

    const following = connections.map(c => ({
      id: c.users.id,
      email: c.users.email,
      fullName: c.users.full_name,
      state_name: c.users.state_name
    }));

    res.json(following);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get followers
router.get('/followers', authMiddleware, async (req, res) => {
  try {
    const { data: connections, error } = await supabase
      .from('connections')
      .select('follower_id, users(*)')
      .eq('following_id', req.user.id);

    if (error) throw error;

    const followers = connections.map(c => ({
      id: c.users.id,
      email: c.users.email,
      fullName: c.users.full_name,
      state_name: c.users.state_name
    }));

    res.json(followers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get similar users based on rituals
router.get('/similar', authMiddleware, async (req, res) => {
  try {
    // Get user's rituals categories
    const { data: myRituals } = await supabase
      .from('rituals')
      .select('category')
      .eq('user_id', req.user.id);

    const myCategories = myRituals.map(r => r.category);

    // Find users with similar rituals
    const { data: similarUsers, error } = await supabase
      .from('rituals')
      .select('user_id, category')
      .in('category', myCategories)
      .neq('user_id', req.user.id);

    if (error) throw error;

    // Get unique user IDs and fetch their details
    const userIds = [...new Set(similarUsers.map(r => r.user_id))].slice(0, 10);

    const { data: users } = await supabase
      .from('users')
      .select('id, email, full_name, state_name')
      .in('id', userIds);

    const result = users.map(u => ({
      id: u.id,
      email: u.email,
      fullName: u.full_name,
      state_name: u.state_name
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
