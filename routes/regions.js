import express from 'express';
import supabase from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all regions
router.get('/', async (req, res) => {
    const { data: regions, error } = await supabase
        .from('regions')
        .select('*');
    
    if (error) return res.status(500).json({ message: error.message });
    res.json(regions);
});

// Get region by ID
router.get('/:id', async (req, res) => {
  const { data: region, error } = await supabase
    .from('regions')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(500).json({ message: error.message });
  if (!region) return res.status(404).json({ message: 'Region not found' });

  res.json(region);
});

// Create region (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { state, region_name } = req.body;

    const { data: region, error } = await supabase
      .from('regions')
      .insert({
        state_name: state,
        region_name: region_name,
        created_at: new Date()
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(region);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;