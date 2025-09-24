/*
 * Copyright (c) 2025 Your Company Name
 * All rights reserved.
 */
// backend/config/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // False for dev; use CA cert for prod
});

// Function to check if tables exist
const initTables = async () => {
  try {
    // Check users table
    const usersResult = await pool.query('SELECT * FROM users LIMIT 1');
    console.log('Users table exists and is accessible.');

    // Check messages table
    const messagesResult = await pool.query('SELECT * FROM messages LIMIT 1');
    console.log('Messages table exists and is accessible.');

    // Check resumes table
    const resumesResult = await pool.query('SELECT * FROM resumes LIMIT 1');
    console.log('Resumes table exists and is accessible.');
  } catch (err) {
    console.error('Error checking tables:', err.message);
    console.log('Ensure tables (users, messages, resumes) are created in CockroachDB.');
  }
};

initTables();

module.exports = pool;