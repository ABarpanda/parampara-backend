import dotenv from 'dotenv';

dotenv.config();

export default {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development'
};
