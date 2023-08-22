const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../server');
require('dotenv').config();

var newPost;

// Behaviour

beforeAll(async () => {
    jest.setTimeout(10000);
    mongoose.connect(
        process.env.DB_TOKEN,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );

    const postBody = {
        titolo: 'titolo',
        testo: 'testo',
        media: null,
        tag: [ 'f', 'g' ],
        associato_a_contest: []
    };

    const loginRes = await request(server).put('/api/utente/login').send({ username: "Ilcalmissimo", password: "Cotoletta.123" });
    cookie = loginRes.body.token;
    const res = await request(server).post('/api/post').send(postBody).set('Cookie', `tokenEpiOpera=${cookie}`);
    newPost = res.body.Id;
});

afterAll(async (done) => {
    await mongoose.connection.close();
    server.close(() => {
        done();
    });
})

// TESTS

describe('GET /api/posts', () => {
    test('GET /api/posts should return a list of posts', async () => {
        const res = await request(server).get('/api/posts');
        expect(res.status).toEqual(200);
        expect(res.body).toBeDefined();
    })
});

describe('GET/api/post/id', () => {
    test(`GET /api/post/id/${newPost} should return a post`, async () => {
        const res = await request(server).get(`/api/post/id/${newPost}`);
        expect(res.status).toEqual(200);
        expect(res.body).toBeDefined();
    });

    test('GET /api/post/id/ab should return 404', async () => {
        const res = await request(server).get('/api/post/id/ab');
        expect(res.status).toEqual(404);
    });
});

describe('GET /api/post/user', () => {
    test('GET /api/post/user/Ilcalmissimo should return a list of posts', async () => {
        const res = await request(server).get('/api/post/user/Ilcalmissimo');
        expect(res.status).toEqual(200);
        expect(res.body).toBeDefined();
    });

    test('GET /api/post/user/ab should return 404', async () => {
        const res = await request(server).get('/api/post/user/ab');
        expect(res.status).toEqual(404);
    });
});

describe('POST /api/post', () => {
    test('POST /api/post should return 201', async () => {
        const postBody = {
            titolo: 'titolo',
            testo: 'testo',
            media: null,
            tag: [ 'f', 'g' ],
            associato_a_contest: []
        };

        const loginRes = await request(server).put('/api/utente/login').send({ username: "Ilcalmissimo", password: "Cotoletta.123" });
        cookie = loginRes.body.token;
        const res = await request(server).post('/api/post').send(postBody).set('Cookie', `tokenEpiOpera=${cookie}`);

        expect(res.status).toEqual(201);
    });

    test('POST /api/post should return 400', async () => {
        const postBody = {
            titolo: 'titolo',
            testo: 'testo',
            media: 'media',
            tag: [],
            associato_a_contest: []
        }

        const loginRes = await request(server).put('/api/utente/login').send({ username: "Ilcalmissimo", password: "Cotoletta.123" });
        cookie = loginRes.body.token;
        const res = await request(server).post('/api/post').send(postBody).set('Cookie', `tokenEpiOpera=${cookie}`);

        expect(res.status).toEqual(400);
    })
});

describe('PUT /api/post/segnala', () => {
    test('PUT /api/post/segnala should return 200', async () => {
        const loginRes = await request(server)
            .put('/api/utente/login')
            .send({ username: "Ilcalmissimo", password: "Cotoletta.123" });

        const cookie = loginRes.body.token;

        const res = await request(server)
            .put('/api/post/segnala')
            .send({ id: `${newPost}` })
            .set('Cookie', `tokenEpiOpera=${cookie}`);

        expect(res.status).toEqual(200);
    });

    test('PUT /api/post/segnala should return 404', async () => {
        const loginRes = await request(server)
            .put('/api/utente/login')
            .send({ username: "Ilcalmissimo", password: "Cotoletta.123" });

        const cookie = loginRes.body.token;

        const res = await request(server)
            .put('/api/post/segnala')
            .send({ id: 'bab' })
            .set('Cookie', `tokenEpiOpera=${cookie}`);

        expect(res.status).toEqual(404);
    });
});

describe('PUT /api/post/valuta', () => {
    test('PUT /api/post/valuta should return 200', async () => {
        const loginRes = await request(server)
            .put('/api/utente/login')
            .send({ username: "Ilcalmissimo", password: "Cotoletta.123" });

        const cookie = loginRes.body.token;

        const res = await request(server)
            .put('/api/post/valuta')
            .send({ id: `${newPost}`, valutazione: 1 })
            .set('Cookie', `tokenEpiOpera=${cookie}`);

        expect(res.status).toEqual(200);
    });

    test('PUT /api/post/valuta should return 200', async () => {
        const loginRes = await request(server)
            .put('/api/utente/login')
            .send({ username: "Ilcalmissimo", password: "Cotoletta.123" });

        const cookie = loginRes.body.token;

        const res = await request(server)
            .put('/api/post/valuta')
            .send({ id: `${newPost}`, valutazione: -1 })
            .set('Cookie', `tokenEpiOpera=${cookie}`);

        expect(res.status).toEqual(200);
    });

    test('PUT /api/post/valuta should return 404', async () => {
        const loginRes = await request(server)
            .put('/api/utente/login')
            .send({ username: "Ilcalmissimo", password: "Cotoletta.123" });

        const cookie = loginRes.body.token;

        const res = await request(server)
            .put('/api/post/valuta')
            .send({ id: 'bro', valutazione: 1 })
            .set('Cookie', `tokenEpiOpera=${cookie}`);

        expect(res.status).toEqual(404);
    });

    test('PUT /api/post/valuta should return 500 for invalid valutazione', async () => {
        const loginRes = await request(server)
            .put('/api/utente/login')
            .send({ username: "Ilcalmissimo", password: "Cotoletta.123" });

        const cookie = loginRes.body.token;

        const res = await request(server)
            .put('/api/post/valuta')
            .send({ id: `${newPost}`, valutazione: 2 })
            .set('Cookie', `tokenEpiOpera=${cookie}`);

        expect(res.status).toEqual(500);
    });
});

describe('PUT /api/post/modifica', () => {
    test('PUT /api/post/modifica should return 401 for unauthorized user', async () => {
        const loginRes = await request(server)
            .put('/api/utente/login')
            .send({ username: "OtherUser", password: "Password123" });

        const cookie = loginRes.body.token;

        const res = await request(server)
            .put('/api/post/modifica')
            .send({
                id: `${newPost}`,
                username: 'OtherUser',
                titolo: 'Nuovo titolo',
                testo: 'Nuovo testo',
                media: 'Nuovo media',
                tag: ['x', 'y']
            })
            .set('Cookie', `tokenEpiOpera=${cookie}`);

        expect(res.status).toEqual(401);
    });
    
    test('PUT /api/post/modifica should return 200', async () => {
        const loginRes = await request(server)
            .put('/api/utente/login')
            .send({ username: "Ilcalmissimo", password: "Cotoletta.123" });

        const cookie = loginRes.body.token;

        const res = await request(server)
            .put('/api/post/modifica')
            .send({
                id: `${newPost}`,
                username: 'Ilcalmissimo',
                titolo: 'Nuovo titolo',
                testo: 'Nuovo testo',
                media: 'Nuovo media',
                tag: ['x', 'y']
            })
            .set('Cookie', `tokenEpiOpera=${cookie}`);

        expect(res.status).toEqual(200);
    });

    test('PUT /api/post/modifica should return 404 for invalid post', async () => {
        const loginRes = await request(server)
            .put('/api/utente/login')
            .send({ username: "Ilcalmissimo", password: "Cotoletta.123" });

        const cookie = loginRes.body.token;

        const res = await request(server)
            .put('/api/post/modifica')
            .send({
                id: 'invalid-post-id',
                username: 'Ilcalmissimo',
                titolo: 'Nuovo titolo',
                testo: 'Nuovo testo',
                media: 'Nuovo media',
                tag: ['x', 'y']
            })
            .set('Cookie', `tokenEpiOpera=${cookie}`);

        expect(res.status).toEqual(404);
    });
});

describe('PUT /api/post/salvaNeiFavoriti', () => {
    test('PUT /api/post/salvaNeiFavoriti should return 200', async () => {
        const loginRes = await request(server)
            .put('/api/utente/login')
            .send({ username: "Ilcalmissimo", password: "Cotoletta.123" });

        const cookie = loginRes.body.token;

        const res = await request(server)
            .put('/api/post/salvaNeiFavoriti')
            .send({ id: `${newPost}` })
            .set('Cookie', `tokenEpiOpera=${cookie}`);

        expect(res.status).toEqual(200);
    });

    test('PUT /api/post/salvaNeiFavoriti should return 404 for invalid post', async () => {
        const loginRes = await request(server)
            .put('/api/utente/login')
            .send({ username: "Ilcalmissimo", password: "Cotoletta.123" });

        const cookie = loginRes.body.token;

        const res = await request(server)
            .put('/api/post/salvaNeiFavoriti')
            .send({ id: 'invalid-post-id' })
            .set('Cookie', `tokenEpiOpera=${cookie}`);

        expect(res.status).toEqual(404);
    });
});

describe('DELETE /api/post/:id', () => {
    test('DELETE /api/post/:id should return 401 for unauthorized user', async () => {
        const loginRes = await request(server)
            .put('/api/utente/login')
            .send({ username: "OtherUser", password: "Password123" });

        const cookie = loginRes.body.token;

        const res = await request(server)
            .delete(`/api/post/${newPost}`)
            .set('Cookie', `tokenEpiOpera=${cookie}`);

        expect(res.status).toEqual(401);
    });
    
    test('DELETE /api/post/:id should return 200', async () => {
        const loginRes = await request(server)
            .put('/api/utente/login')
            .send({ username: "Ilcalmissimo", password: "Cotoletta.123" });

        const cookie = loginRes.body.token;

        const res = await request(server)
            .delete(`/api/post/${newPost}`)
            .set('Cookie', `tokenEpiOpera=${cookie}`);

        expect(res.status).toEqual(200);
    });

    test('DELETE /api/post/:id should return 404 for invalid post', async () => {
        const loginRes = await request(server)
            .put('/api/utente/login')
            .send({ username: "Ilcalmissimo", password: "Cotoletta.123" });

        const cookie = loginRes.body.token;

        const res = await request(server)
            .delete('/api/post/invalid-post-id')
            .set('Cookie', `tokenEpiOpera=${cookie}`);

        expect(res.status).toEqual(404);
    });
});