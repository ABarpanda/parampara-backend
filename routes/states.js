import express from 'express';
import supabase from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all states
router.get('/', async (req, res) => {
    const { data: states, error } = await supabase
        .from('states')
        .select('*');
    
    if (error) return res.status(500).json({ message: error.message });
    res.json(states);
});

// Get state by ID
router.get('/:id', async (req, res) => {
  const { data: state, error } = await supabase
    .from('states')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(500).json({ message: error.message });
  if (!state) return res.status(404).json({ message: 'State not found' });

  res.json(state);
});

export default router;