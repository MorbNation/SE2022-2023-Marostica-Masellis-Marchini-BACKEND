const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../server'); // Update the path to your server file
require('dotenv').config();

let cookie; // Store the authentication token
const username = 'newUser';

beforeAll(async () => {
    jest.setTimeout(10000);
    mongoose.connect(
        process.env.DB_TOKEN,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );

    const userBody = {
        username: username,
        email: 'tester@studenti.unitn.it',
        password: 'Cotoletta.123',
        lingua: 'italiano',
        followed_users: [],
        favourites: []
    };

    await request(server).post('/api/utente').send(userBody);
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
            .get(`/api/utente/${username}`)
        expect(res.status).toEqual(200);
        expect(res.body).toBeDefined();
    });

    test('GET /api/utente/:user should return 404 for non-existing user', async () => {
        const res = await request(server)
            .get('/api/utente/nonexistinguser')
        expect(res.status).toEqual(404);
    });
});

describe('GET /api/utente', () => {
    test('GET /api/utente should return a list of users', async () => {
        const res = await request(server)
            .get('/api/utente')
        expect(res.status).toEqual(200);
        expect(res.body).toBeDefined();
    });
});

describe('POST /api/utente', () => {
    test('POST /api/utente should create a new user', async () => {
        const userBody = {
            username: 'newuser',
            email: 'newuser@studenti.unitn.it',
            password: 'NewPassword.123',
            lingua: 'italiano',
            followed_users: [],
            favourites: []
        };

        const res = await request(server)
            .post('/api/utente')
            .send(userBody)
        expect(res.status).toEqual(201);
    });

    test('POST /api/utente should return 400 for invalid data', async () => {
        const userBody = {
            username: 'newuser',
            email: 'newuser@ciao.it',
            password: 'NewPassword.123',
            lingua: 'italiano',
            followed_users: [],
            favourites: []
        };

        const res = await request(server)
            .post('/api/utente')
            .send(userBody)
        expect(res.status).toEqual(400);
    });

    test('POST /api/utente should return 400 for invalid data', async () => {
        const userBody = {
            username: 'newuser',
            email: 'newuser@studenti.unitn.it',
            password: 'NewPassword123',
            lingua: 'italiano',
            followed_users: [],
            favourites: []
        };

        const res = await request(server)
            .post('/api/utente')
            .send(userBody)
        expect(res.status).toEqual(400);
    });

    test('POST /api/utente should return 400 for invalid data', async () => {
        const userBody = {
            username: 'a',
            email: 'newuser@studenti.unitn.it',
            password: 'NewPassword.123',
            lingua: 'italiano',
            followed_users: [],
            favourites: []
        };

        const res = await request(server)
            .post('/api/utente')
            .send(userBody)
        expect(res.status).toEqual(400);
    });
});

describe('PUT /api/utente/login', () => {
    test('PUT /api/utente/login should return a token', async () => {
        const res = await request(server)
            .put('/api/utente/login')
            .send({ username: `Ilcalmissimo`, password: "Cotoletta.123" });
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
            .send({ username: `${username}`, password: "InvalidPassword" });
        expect(res.status).toEqual(401);
    });
});

describe('DELETE /api/utente/:user', () => {
    test('DELETE /api/utente/:user should return 401 for unauthorized user', async () => {
        const res = await request(server)
            .delete(`/api/utente/${username}`)
        expect(res.status).toEqual(401);
    });

    test('DELETE /api/utente/:user should delete a user', async () => {
        const loginRes = await request(server).put('/api/utente/login').send({ username: `${username}`, password: "Cotoletta.123" });
        cookie = loginRes.body.token;
        const res = await request(server)
            .delete(`/api/utente/${username}`)
        expect(res.status).toEqual(200);
    });
});

describe('PUT /api/utente/segui', () => {
    test('PUT /api/utente/segui should return true after following a user', async () => {
        const loginRes = await request(server).put('/api/utente/login').send({ username: `${username}`, password: "Cotoletta.123" });
        cookie = loginRes.body.token;
        const res = await request(server)
            .put('/api/utente/segui')
            .send({ utenteDaSeguire: 'Ilcalmissimo' })
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(200);
        expect(res.body.IsFollowing).toBe(true);
    });

    test('PUT /api/utente/segui should return false after unfollowing a user', async () => {
        const loginRes = await request(server).put('/api/utente/login').send({ username: `${username}`, password: "Cotoletta.123" });
        cookie = loginRes.body.token;
        const res = await request(server)
            .put('/api/utente/segui')
            .send({ utenteDaSeguire: 'Ilcalmissimo' })
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(200);
        expect(res.body.IsFollowing).toBe(false);
    });

    test('PUT /api/utente/segui should return 404 for non-existing user to follow', async () => {
        const loginRes = await request(server).put('/api/utente/login').send({ username: `${username}`, password: "Cotoletta.123" });
        cookie = loginRes.body.token;
        const res = await request(server)
            .put('/api/utente/segui')
            .send({ utenteDaSeguire: 'nonexistinguser' })
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(404);
    });
});

describe('PUT /api/utente/logout', () => {
    test('PUT /api/utente/logout should clear the cookie', async () => {
        const res = await request(server)
            .put('/api/utente/logout')
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(200);
        expect(res.header['set-cookie']).toBeDefined();
    });
});

describe('PUT /api/utente/modificaMail', () => {
    test('PUT /api/utente/modificaMail should update email successfully', async () => {
        const loginRes = await request(server).put('/api/utente/login').send({ username: `${username}`, password: "Cotoletta.123" });
        cookie = loginRes.body.token;
        const newEmail = 'newemail@studenti.unitn.it';
        const res = await request(server)
            .put('/api/utente/modificaMail')
            .send({ email: newEmail })
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(200);
        expect(res.body.email).toEqual(newEmail);
    });

    test('PUT /api/utente/modificaMail should return 400 for invalid email', async () => {
        const loginRes = await request(server).put('/api/utente/login').send({ username: `${username}`, password: "Cotoletta.123" });
        cookie = loginRes.body.token;
        const invalidEmail = 'invalidemail@ciao.it';
        const res = await request(server)
            .put('/api/utente/modificaMail')
            .send({ email: invalidEmail })
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(400);
    });
});

describe('PUT /api/utente/modificaPassword', () => {
    test('PUT /api/utente/modificaPassword should update password successfully', async () => {
        const newPassword = 'NewPassword123.!';
        const res = await request(server)
            .put('/api/utente/modificaPassword')
            .send({ newPassword: newPassword })
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(200);
    });

    test('PUT /api/utente/modificaPassword should return 400 for invalid password', async () => {
        const loginRes = await request(server).put('/api/utente/login').send({ username: `${username}`, password: "Cotoletta.123" });
        cookie = loginRes.body.token;
        const invalidPassword = 'invalidpassword';
        const res = await request(server)
            .put('/api/utente/modificaPassword')
            .send({ newPassword: invalidPassword })
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(400);
    });
});

describe('PUT /api/utente/modificaNSFW', () => {
    test('PUT /api/utente/modificaNSFW should update NSFW setting successfully', async () => {
        const loginRes = await request(server).put('/api/utente/login').send({ username: `${username}`, password: "Cotoletta.123" });
        cookie = loginRes.body.token;
        const newNSFWSetting = 'yes';
        const res = await request(server)
            .put('/api/utente/modificaNSFW')
            .send({ nsfw: newNSFWSetting })
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(200);
    });

    test('PUT /api/utente/modificaNSFW should return 400 for invalid NSFW setting', async () => {
        const loginRes = await request(server).put('/api/utente/login').send({ username: `${username}`, password: "Cotoletta.123" });
        cookie = loginRes.body.token;
        const invalidNSFWSetting = 'invalid';
        const res = await request(server)
            .put('/api/utente/modificaNSFW')
            .send({ nsfw: invalidNSFWSetting })
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(400);
    });
});
