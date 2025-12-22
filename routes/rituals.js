import express from 'express';
import supabase from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Search rituals
router.get('/search', async (req, res) => {
  const { q } = req.query;
  const { data: rituals, error } = await supabase
    .from('rituals')
    .select('*')
    .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ message: error.message });
  res.json(rituals);
});

// Get all rituals with pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, region, userId } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase.from('rituals').select('*', { count: 'exact' });

    if (region) query = query.eq('region', region);
    if (userId) query = query.eq('user_id', userId);

    const { data: rituals, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({
      rituals,
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get ritual by ID
router.get('/:id', async (req, res) => {
  const { data: ritual, error } = await supabase
    .from('rituals')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(500).json({ message: error.message });
  if (!ritual) return res.status(404).json({ message: 'Ritual not found' });

  res.json(ritual);
});

// Create ritual (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    // console.log(req);
    const { title, description, category, state, tags, significance, frequency } = req.body;

    const { data: ritual, error } = await supabase
      .from('rituals')
      .insert({
        title,
        description,
        category,
        state,
        tags,
        significance,
        frequency,
        user_id: req.user.id,
        created_at: new Date(),
        likes: 0,
        comments: 0
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(ritual);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update ritual (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    // Check ownership
    const { data: ritual } = await supabase
      .from('rituals')
      .select('user_id')
      .eq('id', req.params.id)
      .single();

    if (ritual.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, category, state, tags, significance, frequency } = req.body;

    const { data: updated, error } = await supabase
      .from('rituals')
      .update({
        title,
        description,
        category,
        state,
        tags,
        significance,
        frequency,
        updated_at: new Date()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete ritual (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Check ownership
    const { data: ritual } = await supabase
      .from('rituals')
      .select('user_id')
      .eq('id', req.params.id)
      .single();

    if (ritual.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { error } = await supabase
      .from('rituals')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Ritual deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
