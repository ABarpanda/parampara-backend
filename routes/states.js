import express from 'express';
import supabase from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const { data: states, error } = await supabase
        .from('states')
        .select('*')
    
    if (error) return res.status(500).json({ message: error.message });
    res.json(states);
});

export default router;