import app from '../app.js';

// Vercel serverless function wrapper placed inside backend to use backend/package.json
export default function handler(req, res) {
  return app(req, res);
}
