/*
 * Copyright (c) 2025 Your Company Name
 * All rights reserved.
 */
// server/routes/auth.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.post('/signup', async (req, res) => {
  console.log('[v0] Signup request received:', req.body);
  
  const { email, fullName, password, company, dob, city, state, country, phone, status, qualification, branch, passoutYear } = req.body;

  // Validate required fields
  if (!email || !fullName || !password || !status) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields: email, fullName, password, status' 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid email format' 
    });
  }

  // Validate password strength
  if (password.length < 6) {
    return res.status(400).json({ 
      success: false, 
      message: 'Password must be at least 6 characters long' 
    });
  }

  const userData = {
    email: email.toLowerCase(),
    fullname: fullName,
    password: password, // TODO: Hash password with bcrypt before saving
    company: company || null,
    dob,
    city,
    state,
    country,
    phone,
    status,
    qualification,
    branch,
    passoutyear: passoutYear
  };

  try {
    console.log('[v0] Attempting to insert user data into PostgreSQL');
    const query = `
      INSERT INTO users (email, fullname, password, company, dob, city, state, country, phone, status, qualification, branch, passoutyear)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id, email, fullname, company, status
    `;
    const values = [
      userData.email, userData.fullname, userData.password, userData.company, userData.dob,
      userData.city, userData.state, userData.country, userData.phone, userData.status,
      userData.qualification, userData.branch, userData.passoutyear
    ];
    
    const result = await pool.query(query, values);
    const newUser = result.rows[0];
    
    console.log('[v0] User registered successfully:', newUser.email);
    
    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully', 
      user: newUser 
    });
  } catch (err) {
    console.error('[v0] PostgreSQL signup error:', err);
    
    if (err.code === '23505') {
      return res.status(409).json({ 
        success: false, 
        message: 'Email already exists' 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'Signup failed', 
      error: err.message 
    });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and password are required' 
    });
  }

  try {
    console.log('[v0] Login attempt for email:', email);
    
    const query = 'SELECT * FROM users WHERE email = $1 AND password = $2';
    const result = await pool.query(query, [email.toLowerCase(), password]);
    
    if (result.rows.length === 0) {
      console.log('[v0] Invalid credentials for email:', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const userRow = result.rows[0];
    const user = {
      id: userRow.id,
      email: userRow.email,
      fullName: userRow.fullname,
      company: userRow.company,
      city: userRow.city,
      state: userRow.state,
      country: userRow.country,
      phone: userRow.phone,
      status: userRow.status,
      qualification: userRow.qualification,
      branch: userRow.branch,
      passoutYear: userRow.passoutyear,
      profileImage: userRow.profile_image_url,
      bio: userRow.bio,
      isPremium: userRow.is_premium
    };

    console.log('[v0] User logged in successfully:', user.email);
    
    res.status(200).json({ 
      success: true, 
      user,
      message: 'Login successful' 
    });
  } catch (err) {
    console.error('[v0] PostgreSQL login error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Login failed', 
      error: err.message 
    });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and new password are required' 
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ 
      success: false, 
      message: 'Password must be at least 6 characters long' 
    });
  }

  try {
    console.log('[v0] Password reset request for email:', email);
    
    const query = 'UPDATE users SET password = $1, updated_at = NOW() WHERE email = $2 RETURNING id, email, fullname';
    const result = await pool.query(query, [newPassword, email.toLowerCase()]);
    
    if (result.rows.length === 0) {
      console.log('[v0] Email not found for password reset:', email);
      return res.status(404).json({ 
        success: false, 
        message: 'Email not found' 
      });
    }

    console.log('[v0] Password updated successfully for email:', email);
    
    res.status(200).json({ 
      success: true, 
      message: 'Password updated successfully' 
    });
  } catch (err) {
    console.error('[v0] PostgreSQL password update error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Error updating password', 
      error: err.message 
    });
  }
});

// Get user profile
router.get('/user/:email', async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email is required' 
    });
  }

  try {
    console.log('[v0] Fetching user profile for email:', email);
    
    const query = 'SELECT id, email, fullname, company, dob, city, state, country, phone, status, qualification, branch, passoutyear, profile_image_url, bio, is_premium, created_at FROM users WHERE email = $1';
    const result = await pool.query(query, [email.toLowerCase()]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const user = result.rows[0];
    
    res.status(200).json({ 
      success: true, 
      user 
    });
  } catch (err) {
    console.error('[v0] Error fetching user profile:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Error fetching user profile', 
      error: err.message 
    });
  }
});

// Update user profile
router.put('/user/:email', async (req, res) => {
  const { email } = req.params;
  const { fullname, company, phone, city, state, country, bio, profile_image_url } = req.body;

  if (!email) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email is required' 
    });
  }

  try {
    console.log('[v0] Updating user profile for email:', email);
    
    const query = `
      UPDATE users 
      SET fullname = COALESCE($1, fullname),
          company = COALESCE($2, company),
          phone = COALESCE($3, phone),
          city = COALESCE($4, city),
          state = COALESCE($5, state),
          country = COALESCE($6, country),
          bio = COALESCE($7, bio),
          profile_image_url = COALESCE($8, profile_image_url),
          updated_at = NOW()
      WHERE email = $9
      RETURNING id, email, fullname, company, phone, city, state, country, bio, profile_image_url
    `;
    
    const values = [fullname, company, phone, city, state, country, bio, profile_image_url, email.toLowerCase()];
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    console.log('[v0] User profile updated successfully:', email);
    
    res.status(200).json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('[v0] Error updating user profile:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Error updating profile', 
      error: err.message 
    });
  }
});

module.exports = router;
