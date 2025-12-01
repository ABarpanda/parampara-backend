import express from 'express';
import supabase from '../db.js';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;

    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
