/* import express from 'express';
import { pool } from '../helpers/db.js';
import { authenticateToken } from '../helpers/auth.js';

const router = express.Router();

// Ryhmän luominen
router.post('/new', authenticateToken, async (req, res) => {
  const { name, id } = req.body; // Ryhmän nimi ja käyttäjän ID (admin)

  if (!name) {
    return res.status(400).json({ message: 'Group name is required' }); // Validoi syöte
  }

  try {
    // Lisää uusi ryhmä tietokantaan ja asettaa nykyisen käyttäjän ylläpitäjäksi
    const result = await pool.query(
      'INSERT INTO groups (name, admin_id) VALUES ($1, $2) RETURNING group_id',
      [name, id]
    );

    const newGroupId = result.rows[0].group_id;

    // Lisää ylläpitäjä ryhmän jäsenlistaan
    await pool.query(
      'INSERT INTO group_members (group_id, user_id, role) VALUES ($1, $2, $3)',
      [newGroupId, id, 'admin']
    );

    res.status(201).json({ id: newGroupId, name });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Käyttäjän omien ryhmien haku
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Käyttäjän ID tokenista
    const result = await pool.query(
      `SELECT g.group_id, g.name FROM groups g
       JOIN group_members gm ON g.group_id = gm.group_id
       WHERE gm.user_id = $1`,
      [userId]
    );
    res.status(200).json(result.rows); // Palauttaa käyttäjän ryhmät
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Kaikkien ryhmien haku (julkinen reitti)
router.get('/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT group_id, name FROM groups');
    res.status(200).json(result.rows); // Palauttaa kaikki ryhmät
  } catch (error) {
    console.error('Error fetching all groups:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Käyttäjän liittyminen ryhmään
router.post('/:groupId/join', authenticateToken, async (req, res) => {
  const { groupId } = req.params; // Ryhmän ID reitistä
  const userId = req.user.userId;

  try {
    // Tarkistaa, onko käyttäjä jo jäsen
    const isMember = await pool.query(
      `SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [groupId, userId]
    );
    if (isMember.rowCount > 0) {
      return res.status(400).json({ message: 'You are already a member of this group.' });
    }

    // Lisää jäsenen ryhmään
    await pool.query(
      `INSERT INTO group_members (group_id, user_id, role) VALUES ($1, $2, 'member')`,
      [groupId, userId]
    );

    res.status(200).json({ message: 'You have successfully joined the group.' });
  } catch (error) {
    console.error('Error joining group:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Käyttäjän poistuminen ryhmästä
router.post('/:groupId/leave', authenticateToken, async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.userId;

  try {
    // Poistaa käyttäjän ryhmän jäsenlistasta
    const result = await pool.query(
      `DELETE FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [groupId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Membership not found.' });
    }

    res.status(200).json({ message: 'You have left the group.' });
  } catch (error) {
    console.error('Error leaving group:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Ryhmän poistaminen
router.delete('/:groupId', authenticateToken, async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.userId;

  try {
    // Tarkistaa, onko käyttäjä ryhmän ylläpitäjä
    const group = await pool.query(
      `SELECT * FROM groups WHERE group_id = $1 AND admin_id = $2`,
      [groupId, userId]
    );

    if (group.rowCount === 0) {
      return res.status(403).json({ message: 'You do not have permission to delete this group.' });
    }

    // Poistaa ryhmän
    await pool.query(`DELETE FROM groups WHERE group_id = $1`, [groupId]);
    res.status(200).json({ message: 'Group deleted successfully.' });
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
*/

import express from 'express';
import { pool } from '../helpers/db.js';
import { authenticateToken } from '../helpers/auth.js';

const router = express.Router();

// Ryhmän luominen
router.post('/new', authenticateToken, async (req, res) => {
  const { name, id } = req.body;
 
  if (!name) {
    console.error('Group name is missing in the request body');
    return res.status(400).json({ message: 'Group name is required' });
  }
 
  try {
    console.log('Attempting to insert group:', name);
 
    const result = await pool.query(
      'INSERT INTO groups (name, admin_id) VALUES ($1, $2) RETURNING group_id',
      [name, id]
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

// Käyttäjän ryhmien haku
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

// Hakee kaikki ryhmät
router.get('/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT group_id, name FROM groups');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching all groups:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Hakee yksittäisen ryhmän tiedot, jäsenet ja admin-tiedot
router.get('/:id', authenticateToken, async (req, res) => {
  const groupId = req.params.id;
  try {
    // Hakee ryhmän perustiedot
    const groupResult = await pool.query(
      `SELECT group_id, name, admin_id FROM groups WHERE group_id = $1`,
      [groupId]
    );
    if (groupResult.rowCount === 0) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const group = groupResult.rows[0];

    // Hakee ryhmän jäsenet
    const membersResult = await pool.query(
      `SELECT gm.user_id, u.email, 
              CASE WHEN g.admin_id = gm.user_id THEN 'admin' ELSE 'member' END AS role
       FROM group_members gm
       JOIN users u ON gm.user_id = u.user_id
       JOIN groups g ON gm.group_id = g.group_id
       WHERE gm.group_id = $1`,
      [groupId]
    );

    const members = membersResult.rows;

    // Liittää jäsenet ryhmän palautukseen
    res.status(200).json({ ...group, members });
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Liity ryhmään
router.post('/:id/join', authenticateToken, async (req, res) => {
  const groupId = req.params.id;
  const userId = req.user.userId;

  try {
    // Tarkista, onko käyttäjä jo jäsen ryhmässä
    const result = await pool.query(
      'SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2',
      [groupId, userId]
    );

    if (result.rowCount > 0) {
      return res.status(400).json({ message: 'User is already a member of this group' });
    }

    // Lisää jäsen ryhmään
    await pool.query(
      'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)',
      [groupId, userId]
    );

    res.status(200).json({ message: 'User successfully joined the group' });
  } catch (error) {
    console.error('Error joining group:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


export default router;
