import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import supabase from '../db.js';
import config from '../config.js';

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, fullName: user.full_name },
    config.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function hashPassword(password) {
  return bcryptjs.hash(password, 10);
}

export async function comparePassword(password, hash) {
  return bcryptjs.compare(password, hash);
}

export async function getUserById(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}
