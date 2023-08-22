const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../server'); // Update the path to your server file
require('dotenv').config();

let cookie; // Store the authentication token

beforeAll(async () => {
    jest.setTimeout(10000);
    mongoose.connect(
        process.env.DB_TOKEN,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );

    // Perform user authentication and get the token
    const loginRes = await request(server)
        .put('/api/utente/login')
        .send({ username: "Ilcalmissimo", password: "Cotoletta.123" });
    cookie = loginRes.body.token;
});

afterAll(async () => {
    jest.setTimeout(30000);
    await mongoose.connection.close();
    return new Promise((resolve) => {
        server.close(() => {
            resolve();
        });
    });
});

describe('GET /api/utente/:user', () => {
    test('GET /api/utente/:user should return a user', async () => {
        const res = await request(server)
            .get('/api/utente/Ilcalmissimo')
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(200);
        expect(res.body).toBeDefined();
    });

    test('GET /api/utente/:user should return 404 for non-existing user', async () => {
        const res = await request(server)
            .get('/api/utente/nonexistinguser')
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(404);
    });
});

describe('GET /api/utente', () => {
    test('GET /api/utente should return a list of users', async () => {
        const res = await request(server)
            .get('/api/utente')
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(200);
        expect(res.body).toBeDefined();
    });
});

describe('POST /api/utente', () => {
    test('POST /api/utente should create a new user', async () => {
        const userBody = {
            username: 'newuser',
            email: 'newuser@studenti.unitn.it',
            password: 'NewPassword123', // Make sure the password meets your requirements
            // Other user properties
        };

        const res = await request(server)
            .post('/api/utente')
            .send(userBody)
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(201);
    });

    test('POST /api/utente should return 400 for invalid data', async () => {
        const userBody = {
            // Invalid user data
        };

        const res = await request(server)
            .post('/api/utente')
            .send(userBody)
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(400);
    });
});

describe('PUT /api/utente/login', () => {
    test('PUT /api/utente/login should return a token', async () => {
        const res = await request(server)
            .put('/api/utente/login')
            .send({ username: "Ilcalmissimo", password: "Cotoletta.123" });
        expect(res.status).toEqual(200);
        expect(res.body.token).toBeDefined();
    });

    test('PUT /api/utente/login should return 404 for non-existing user', async () => {
        const res = await request(server)
            .put('/api/utente/login')
            .send({ username: "nonexistinguser", password: "InvalidPassword" });
        expect(res.status).toEqual(404);
    });

    test('PUT /api/utente/login should return 401 for invalid password', async () => {
        const res = await request(server)
            .put('/api/utente/login')
            .send({ username: "Ilcalmissimo", password: "InvalidPassword" });
        expect(res.status).toEqual(401);
    });
});

// Add similar test blocks for other user APIs (PUT requests)

describe('DELETE /api/utente/:user', () => {
    test('DELETE /api/utente/:user should delete a user', async () => {
        const res = await request(server)
            .delete('/api/utente/newuser') // Replace with the username of the user you created
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(200);
    });

    test('DELETE /api/utente/:user should return 401 for unauthorized user', async () => {
        const res = await request(server)
            .delete('/api/utente/Ilcalmissimo')
            .set('Cookie', `tokenEpiOpera=invalidtoken`);
        expect(res.status).toEqual(401);
    });

    test('DELETE /api/utente/:user should return 404 for non-existing user', async () => {
        const res = await request(server)
            .delete('/api/utente/nonexistinguser')
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(404);
    });
});

// Add similar test blocks for other user APIs (DELETE requests)
