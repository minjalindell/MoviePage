import { expect } from "chai";
import { insertTestUser, getToken } from "./helpers/test.js"; // Poista initializeTestDb, koska ei tarvita
const base_url = 'http://localhost:3001';

import { before, after } from 'mocha';  
import { pool } from './helpers/db.js'


before(async () => {
    const email = 'login@foo.com';
    const password = 'login123';
    await insertTestUser(email, password); 
});



after(async () => {
    await pool.query('DELETE FROM users WHERE email = $1', ['login@foo.com']);  // Poistetaan testikäyttäjä
});


describe('POST register', () => {

    const email = 'register' + Date.now() + '@foo.com';
    const password = 'Register123'; 

    it('should register with valid email and password', async () => {
        const response = await fetch(base_url + '/user/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        expect(response.status).to.equal(201, data.error);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('user_id', 'email');
    });
});


describe('POST login', () => {
    const email = 'login@foo.com';  
    const password = 'login123';  

    it('should login with valid credentials', async () => {
        const response = await fetch(base_url + '/user/login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        expect(response.status).to.equal(200, data.error); 
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('user_id', 'email', 'token'); 
    });
});


