/*
 * Copyright (c) 2025 Your Company Name
 * All rights reserved.
 */
// backend/config/db.js
const { Pool } = require('pg');
require('dotenv').config();

console.log('[v0] DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('[v0] NODE_ENV:', process.env.NODE_ENV);
console.log('[v0] SSL enabled:', process.env.NODE_ENV === 'production');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('[v0] Unexpected pool error:', err);
});

pool.on('connect', () => {
  console.log('[v0] Successfully connected to PostgreSQL');
});

// Function to auto-initialize all tables
const initTables = async () => {
  try {
    console.log('[v0] Starting database initialization...');

    // Create UUID extension
    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log('[v0] UUID extension created');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email TEXT UNIQUE NOT NULL,
        fullname TEXT NOT NULL,
        password TEXT NOT NULL,
        company TEXT,
        dob TEXT,
        city TEXT,
        state TEXT,
        country TEXT,
        phone TEXT,
        status TEXT,
        qualification TEXT,
        branch TEXT,
        passoutyear TEXT,
        profile_image_url TEXT,
        bio TEXT,
        is_premium BOOLEAN DEFAULT FALSE,
        message_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('[v0] Users table created/verified');

    // Create messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        category TEXT NOT NULL,
        message TEXT NOT NULL,
        message_type TEXT DEFAULT 'general',
        target_users INT DEFAULT 0,
        sent_count INT DEFAULT 0,
        timestamp TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('[v0] Messages table created/verified');

    // Create message_recipients table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS message_recipients (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        is_read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(message_id, user_id)
      )
    `);
    console.log('[v0] Message recipients table created/verified');

    // Create resumes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS resumes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email TEXT NOT NULL,
        name TEXT NOT NULL,
        resume_url TEXT,
        resume_filename TEXT,
        file_type TEXT,
        file_size INT,
        resume_data TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
      )
    `);
    console.log('[v0] Resumes table created/verified');

    // Create user_messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('[v0] User messages table created/verified');

    // Create user_conversations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_conversations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        conversation_partner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        last_message_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, conversation_partner_id)
      )
    `);
    console.log('[v0] User conversations table created/verified');

    // Create old_age_homes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS old_age_homes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        location TEXT,
        image_url TEXT,
        qr_url TEXT,
        home_url TEXT,
        contact_email TEXT,
        contact_phone TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('[v0] Old age homes table created/verified');

    // Create orphans table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orphans (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        location TEXT,
        image_url TEXT,
        qr_url TEXT,
        home_url TEXT,
        contact_email TEXT,
        contact_phone TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('[v0] Orphans table created/verified');

    // Create donations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS donations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        type TEXT NOT NULL,
        item_id UUID NOT NULL,
        item_name TEXT NOT NULL,
        amount DECIMAL(10, 2),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        screenshot_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('[v0] Donations table created/verified');

    // Create email_logs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS email_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        recipient_email TEXT NOT NULL,
        subject TEXT,
        email_service TEXT,
        status TEXT,
        error_message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('[v0] Email logs table created/verified');

    // Create email_statistics table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS email_statistics (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        year INT NOT NULL,
        month INT NOT NULL,
        total_emails_sent INT DEFAULT 0,
        unique_recipients INT DEFAULT 0,
        last_updated TIMESTAMP DEFAULT NOW(),
        UNIQUE(year, month)
      )
    `);
    console.log('[v0] Email statistics table created/verified');

    // Create indexes
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_company ON users(company)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_status ON users(status)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_messages_category ON messages(category)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_resumes_email ON resumes(email)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_user_messages_sender ON user_messages(sender_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_user_messages_receiver ON user_messages(receiver_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_conversations_user ON user_conversations(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_email)');
    console.log('[v0] All indexes created');

    console.log('[v0] Database initialization completed successfully!');
  } catch (err) {
    console.error('[v0] Error initializing database:', err.message);
  }
};

initTables();

module.exports = pool;
