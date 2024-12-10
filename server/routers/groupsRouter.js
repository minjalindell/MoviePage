import express from 'express';
import { pool } from '../helpers/db.js';
import { authenticateToken } from '../helpers/auth.js';

const router = express.Router();

router.post('/new', authenticateToken, async (req, res) => {
  const { name,id } = req.body;

  if (!name) {
    console.error('Group name is missing in the request body');
    return res.status(400).json({ message: 'Group name is required' });
  }

  try {
    console.log('Attempting to insert group:', name);

    
    const result = await pool.query(
      'INSERT INTO groups (name,admin_id) VALUES ($1, $2) RETURNING group_id',
      [name,id]
    );
    console.log('Insert result:', result.rows);

    const newGroupId = result.rows[0].group_id;

    
    await pool.query(
      'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)',
      [newGroupId, id]
    );

    console.log('Group membership added for group ID:', newGroupId);
    res.status(201).json({ id: newGroupId, name });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; 
    const result = await pool.query(
      `SELECT g.group_id, g.name FROM groups g 
       JOIN group_members gm ON g.group_id = gm.group_id 
       WHERE gm.user_id = $1`,
      [userId] 
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



export default router;

