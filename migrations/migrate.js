import supabase from '../db.js';

async function createTables() {
  try {
    console.log('Creating database tables...');

    // Create users table
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR UNIQUE NOT NULL,
          password_hash VARCHAR NOT NULL,
          full_name VARCHAR NOT NULL,
          region VARCHAR NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS rituals (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR NOT NULL,
          description TEXT NOT NULL,
          category VARCHAR NOT NULL,
          region VARCHAR NOT NULL,
          tags TEXT[] DEFAULT '{}',
          significance TEXT,
          frequency VARCHAR DEFAULT 'Yearly',
          likes INTEGER DEFAULT 0,
          comments INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS connections (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(follower_id, following_id)
        );
        
        CREATE TABLE IF NOT EXISTS categories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR UNIQUE NOT NULL,
          description TEXT
        );
        
        INSERT INTO categories (name, description) VALUES
          ('Festival & Celebrations', 'Rituals related to festivals and celebrations'),
          ('Daily Rituals', 'Daily spiritual or family practices'),
          ('Life Milestones', 'Rituals for births, marriages, deaths'),
          ('Cooking & Recipes', 'Traditional family recipes and cooking rituals'),
          ('Prayers & Meditation', 'Spiritual practices and prayers'),
          ('Seasonal', 'Seasonal family traditions'),
          ('Rites of Passage', 'Coming of age and transition rituals'),
          ('Others', 'Other family traditions')
        ON CONFLICT DO NOTHING;
      `
    });

    console.log('✓ Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error.message);
  }
}

createTables();
