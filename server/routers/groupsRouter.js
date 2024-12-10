import express from 'express';
import { pool } from '../helpers/db.js';
import { authenticateToken } from '../helpers/auth.js';

const router = express.Router();

// Ryhmän luominen
router.post('/new', authenticateToken, async (req, res) => {
  const { name, id } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Group name is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO groups (name, admin_id) VALUES ($1, $2) RETURNING group_id',
      [name, id]
    );

    const newGroupId = result.rows[0].group_id;

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

// Käyttäjän ryhmien haku
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
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

// Kaikkien ryhmien haku
router.get('/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT group_id, name FROM groups');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching all groups:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Uuden jäsenen lisääminen liittymispyynnöllä
router.post('/:groupId/request', authenticateToken, async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.user_id;

  try {
    const isMember = await pool.query(
      `SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [groupId, userId]
    );
    if (isMember.rowCount > 0) {
      return res.status(400).json({ message: 'You are already a member of this group.' });
    }

    await pool.query(
      `UPDATE groups 
       SET join_requests = join_requests || $1::jsonb
       WHERE group_id = $2 AND NOT (join_requests @> $1::jsonb)`,
      [JSON.stringify({ user_id: userId, requested_at: new Date().toISOString() }), groupId]
    );

    res.status(201).json({ message: 'Request to join group has been sent.' });
  } catch (error) {
    console.error('Error sending join request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Liittymispyynnön hyväksyminen
router.post('/:groupId/approve', authenticateToken, async (req, res) => {
  const { groupId } = req.params;
  const { userIdToApprove } = req.body;
  const adminId = req.user.userId;

  try {
    const isAdmin = await pool.query(
      `SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2 AND role = 'admin'`,
      [groupId, adminId]
    );
    if (isAdmin.rowCount === 0) {
      return res.status(403).json({ message: 'Only admins can approve join requests.' });
    }

    const group = await pool.query(
      `SELECT join_requests FROM groups WHERE group_id = $1`,
      [groupId]
    );
    const joinRequests = group.rows[0]?.join_requests || [];
    const requestExists = joinRequests.some((req) => req.user_id === userIdToApprove);

    if (!requestExists) {
      return res.status(404).json({ message: 'Join request not found.' });
    }

    const updatedRequests = joinRequests.filter((req) => req.user_id !== userIdToApprove);
    await pool.query(
      `UPDATE groups SET join_requests = $1::jsonb WHERE group_id = $2`,
      [JSON.stringify(updatedRequests), groupId]
    );
    await pool.query(
      `INSERT INTO group_members (group_id, user_id, role) VALUES ($1, $2, 'member')`,
      [groupId, userIdToApprove]
    );

    res.status(200).json({ message: 'User has been added to the group.' });
  } catch (error) {
    console.error('Error approving join request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Ryhmän tietojen haku groupId:n perusteella
router.get('/:groupId', authenticateToken, async (req, res) => {
  const { groupId } = req.params;

  try {
    // Hae ryhmän tiedot
    const groupResult = await pool.query(
      `SELECT g.group_id, g.name, g.admin_id, 
              ARRAY_AGG(json_build_object('user_id', gm.user_id, 'role', gm.role)) AS members
       FROM groups g
       LEFT JOIN group_members gm ON g.group_id = gm.group_id
       WHERE g.group_id = $1
       GROUP BY g.group_id`,
      [groupId]
    );

    if (groupResult.rowCount === 0) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const group = groupResult.rows[0];

    res.status(200).json({
      group_id: group.group_id,
      name: group.name,
      admin_id: group.admin_id,
      members: group.members,
    });
  } catch (error) {
    console.error('Error fetching group details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;