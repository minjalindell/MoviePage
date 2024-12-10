import express from 'express';
import { pool } from '../helpers/db.js';
import { authenticateToken } from '../helpers/auth.js';

const router = express.Router();

router.use(authenticateToken);

// Luo uusi ryhmä
router.post('/new', async (req, res) => {
  const { name } = req.body;
  const userId = req.user.user_id;

  if (!name || name.trim() === '') {
    console.error('Group name is missing in the request body');
    return res.status(400).json({ message: 'Group name is required' });
  }

  try {
    console.log('Attempting to insert group:', name);

    // lisää uusi ryhmä tietokantaan
    const result = await pool.query(
      'INSERT INTO groups (name) VALUES ($1) RETURNING group_id',
      [name]
    );

    const newGroupId = result.rows[0].group_id;
    console.log('New group created with ID:', newGroupId);

    // ryhmän luoja ylläpitäjänä ryhmän jäseneksi
    await pool.query(
      'INSERT INTO group_members (group_id, user_id, role) VALUES ($1, $2, $3)',
      [newGroupId, userId, 'admin']
    );

    console.log('Group creator added as admin:', { userId, newGroupId });

    res.status(201).json({ group_id: newGroupId, name });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// näytä kirjautuneen käyttäjän ryhmät
router.get('/', async (req, res) => {
  const userId = req.user.id;

  try {
    console.log('Fetching groups for user ID:', userId);

    const result = await pool.query(
      `SELECT g.group_id, g.name 
       FROM groups g 
       JOIN group_members gm ON g.group_id = gm.group_id 
       WHERE gm.user_id = $1`,
      [userId]
    );

    console.log('Groups fetched successfully:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// uuden käyttäjän lisäys ryhmään
router.post('/:groupId/members', async (req, res) => {
  const { groupId } = req.params;
  const { userIdToAdd } = req.body;
  const userId = req.user.id;

  if (!userIdToAdd || isNaN(userIdToAdd)) {
    return res.status(400).json({ message: 'Valid User ID to add is required' });
  }

  try {
    console.log('Checking admin privileges for group:', { groupId, userId });

    // varmistetaan, että käyttäjä on ryhmän ylläpitäjä
    const adminCheck = await pool.query(
      `SELECT role 
       FROM group_members 
       WHERE group_id = $1 AND user_id = $2`,
      [groupId, userId]
    );

    if (adminCheck.rows.length === 0 || adminCheck.rows[0].role !== 'admin') {
      console.error('User is not an admin or not a member of the group');
      return res.status(403).json({ message: 'You are not authorized to add members to this group' });
    }

    // onko käyttäjä jo ryhmässä?
    const existingMember = await pool.query(
      'SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2',
      [groupId, userIdToAdd]
    );

    if (existingMember.rows.length > 0) {
      return res.status(400).json({ message: 'User is already a member of this group' });
    }

    // lisää uusi jäsen ryhmään
    await pool.query(
      'INSERT INTO group_members (group_id, user_id, role) VALUES ($1, $2, $3)',
      [groupId, userIdToAdd, 'member']
    );

    console.log('User added to group successfully:', { groupId, userIdToAdd });
    res.status(200).json({ message: 'User added to group successfully' });
  } catch (error) {
    console.error('Error adding user to group:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
