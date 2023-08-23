const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../server');
require('dotenv').config();

var newComment;
var newComment2;

beforeAll(async () => {
    jest.setTimeout(10000);
    mongoose.connect(
        process.env.DB_TOKEN,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );

    const commentBody = {
        id_post: 'cbef8ef6-4dec-41f8-a39f-7c512c3267c5',
        testo: 'ciaone'
    };

    const loginRes = await request(server).put('/api/utente/login').send({ username: "Ilcalmissimo", password: 'Cotoletta.123' });
    const cookie = loginRes.body.token;

    const res = await request(server).post('/api/commento_post').send(commentBody).set('Cookie', `tokenEpiOpera=${cookie}`);
    newComment = res.body.Id;
});

afterAll(async () => {
    const loginRes = await request(server).put('/api/utente/login').send({ username: "Ilcalmissimo", password: 'Cotoletta.123' });
    const cookie = loginRes.body.token;
    await request(server).delete(`/api/commento_post/${newComment2}`).set('Cookie', `tokenEpiOpera=${cookie}`);

    jest.setTimeout(30000);
    await mongoose.connection.close();
});

describe('POST /api/commento_post', () => {
    test('POST /api/commento_post', async () => {
        const loginRes = await request(server).put('/api/utente/login').send({ username: "Ilcalmissimo", password: 'Cotoletta.123' });
        const cookie = loginRes.body.token;

        const commentBody = {
            id_post: 'cbef8ef6-4dec-41f8-a39f-7c512c3267c5',
            testo: 'ciaoooaoaoa'
        };

        const res = await request(server).post('/api/commento_post').send(commentBody).set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(201);
        newComment2 = res.body.Id;
    });
});

describe('GET /api/commento_post/:id', () => {
    test('GET /api/commento_post/f8968b2a-7b23-488b-bddc-ff37b0597c1a should return comment', async () => {
        const res = await request(server).get('/api/commento_post/f8968b2a-7b23-488b-bddc-ff37b0597c1a');
        expect(res.status).toEqual(200);
        expect(res.body).toBeDefined();
    });

    test('GET /api/commento_post/aba should return 404', async () => {
        const res = await request(server).get('/api/commento_post/aba');
        expect(res.status).toEqual(404);
    });
});

describe('GET /api/commento_post/all/:id_post', () => {
    test('GET /api/commento_post/093edfa2-10d8-4716-999d-7efcab5eec79 should return a list of comments', async () => {
        const res = await request(server).get('/api/commento_post/all/093edfa2-10d8-4716-999d-7efcab5eec79');
        expect(res.status).toEqual(200);
        expect(res.body).toBeDefined();
    });
});

describe('DELETE /api/commento_post/:id', () => {
    test(`DELETE /api/commento_post/${newComment} should return 401`, async () => {
        const loginRes = await request(server).put('/api/utente/login').send({ username: "Jesosky", password: 'Cotoletta.123' });
        const cookie = loginRes.body.token;
        const res = await request(server).delete(`/api/commento_post/${newComment}`).set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(401);
    });

    test(`DELETE /api/commento_post/${newComment} should succesfully delete comment`, async () => {
        const loginRes = await request(server).put('/api/utente/login').send({ username: "Ilcalmissimo", password: 'Cotoletta.123' });
        const cookie = loginRes.body.token;
        const res = await request(server).delete(`/api/commento_post/${newComment}`).set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(200);
    });
});

describe('PUT /api/commento_post/segnala', () => {
    let cookie;

    beforeAll(async () => {
        const loginRes = await request(server)
            .put('/api/utente/login')
            .send({ username: 'Ilcalmissimo', password: "Cotoletta.123" });
        cookie = loginRes.body.token;
    });

    test('PUT /api/commento_post/segnala should succesfully flag a post', async () => {
        const res = await request(server).put('/api/commento_post/segnala').send({ id: newComment2 }).set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(200);
    });

    test('PUT /api/commento_post/segnala should return 404', async () => {
        const res = await request(server).put('/api/commento_post/segnala').send({ id: 'aba' }).set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(404);
    });
});

describe('PUT /api/commento_post/valuta', () => {
    let cookie;

    beforeAll(async () => {
        const loginRes = await request(server)
        .put('/api/utente/login')
        .send({ username: 'Ilcalmissimo', password: "Cotoletta.123" });
    cookie = loginRes.body.token;
    });

    test('PUT /api/commento_post/valuta should return 404', async () => {
        const res = await request(server)
            .put('/api/commento_post/valuta')
            .send({ id: 'aba', valutazione: 1 })
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(404);
    });

    test('PUT /api/commento_post/valuta should succesfully evaluate comment', async () => {
        const res = await request(server)
            .put('/api/commento_post/valuta')
            .send({ id: newComment2, valutazione: 1 })
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(200);
    });

    test('PUT /api/commento_post/valuta should succesfully evaluate comment', async () => {
        const res = await request(server)
            .put('/api/commento_post/valuta')
            .send({ id: newComment2, valutazione: -1 })
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(200);
    });

    test('PUT /api/commento_post/valuta should return 400', async () => {
        const res = await request(server)
            .put('/api/commento_post/valuta')
            .send({ id: newComment2, valutazione: -2 })
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(400);
    });
});

describe('PUT /api/commento_post/modifica', () => {
    test('PUT /api/commento_post/modifica should return 401', async () => {
        const loginRes = await request(server)
        .put('/api/utente/login')
        .send({ username: 'Jesosky', password: "Cotoletta.123" });
        const cookie = loginRes.body.token;

        const res = await request(server)
            .put('/api/commento_post/modifica')
            .send({ id: newComment2, testo: 'fraaaa' })
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(401);
    });

    test('PUT /api/commento_post/modifica should succesfully edit comment', async () => {
        const loginRes = await request(server)
        .put('/api/utente/login')
        .send({ username: 'Ilcalmissimo', password: "Cotoletta.123" });
        const cookie = loginRes.body.token;

        const res = await request(server)
            .put('/api/commento_post/modifica')
            .send({ id: newComment2, testo: 'fraaaa' })
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(200);
    });
});