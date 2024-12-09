import express from 'express';
import { pool } from '../helpers/db.js';
 
const router = express.Router();
 
// Ryhmien tallentamiseen käytettävä lista
let groups = [];
 
// Simuloitu kirjautuneen käyttäjän ID
const loggedInUserId = 1; // Kovakoodattu käyttäjän ID
 
// Luo uusi ryhmä
router.post('/', async (req, res) => {
  const { name } = req.body;
 
  if (!name) {
    console.error('Group name is missing in the request body');
    return res.status(400).json({ message: 'Group name is required' });
  }
 
try {
    console.log('Attempting to insert group:', name); // Lokitus ennen kyselyä
 
    // Lisää uusi ryhmä tietokantaan
    const result = await pool.query(
        'INSERT INTO groups (name) VALUES ($1) RETURNING id',
        [name]
    );
    console.log('Insert result:', result.rows); // Näytä kyselyn tulos
 
    const newGroupId = result.rows[0].id;
 
    // Lisää käyttäjä ryhmän jäseneksi
    await pool.query(
        'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)',
        [newGroupId, 1] // käytetään kovakoodattua käyttäjää ID:llä 1
      );
 
      console.log('Group membership added for group ID:', newGroupId);
     
      res.status(201).json({ id: newGroupId, name }); // Lähetä takaisin luotu ryhmä
    } catch (error) {
      console.error('Error creating group:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});
 
// GET-reitti kaikkien ryhmien hakemiseen (kirjautuneelle käyttäjälle)
router.get('/groups', async (req, res) => {
    const loggedInUserId = 1; // Kovakoodattu käyttäjän ID
 
    try {
      const result = await pool.query(
        'SELECT g.id, g.name FROM groups g ' +
        'JOIN group_members gm ON g.id = gm.group_id ' +
        'WHERE gm.user_id = $1',
        [loggedInUserId]
      );
 
      res.json(result.rows); // Lähetä takaisin ryhmät
    } catch (error) {
      console.error('Error fetching groups:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
 
  export default router;