import express from 'express';
import supabase from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Like a ritual
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const { data: ritual, error: fetchError } = await supabase
      .from('rituals')
      .select('likes')
      .eq('id', req.params.id)
      .single();

    if (fetchError) throw fetchError;

    const { data: updated, error } = await supabase
      .from('rituals')
      .update({ likes: (ritual.likes || 0) + 1 })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add comment to ritual
router.post('/:id/comments', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        ritual_id: req.params.id,
        user_id: req.user.id,
        text,
        created_at: new Date()
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get comments for ritual
router.get('/:id/comments', async (req, res) => {
  try {
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*, users(full_name, id)')
      .eq('ritual_id', req.params.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
