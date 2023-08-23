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
        profilo_commentato: 'imposter',
        titolo: 'amogus',
        testo: 'ciaone'
    };

    const loginRes = await request(server).put('/api/utente/login').send({ username: "Ilcalmissimo", password: 'Cotoletta.123' });
    const cookie = loginRes.body.token;

    const res = await request(server).post('/api/commento_profilo').send(commentBody).set('Cookie', `tokenEpiOpera=${cookie}`);
    newComment = res.body.Id;
});

afterAll(async () => {
    const loginRes = await request(server).put('/api/utente/login').send({ username: "Ilcalmissimo", password: 'Cotoletta.123' });
    const cookie = loginRes.body.token;
    await request(server).delete(`/api/commento_profilo/${newComment2}`).set('Cookie', `tokenEpiOpera=${cookie}`);

    jest.setTimeout(30000);
    await mongoose.connection.close();
});

describe('POST /api/commento_profilo', () => {
    test('POST /api/commento_profilo', async () => {
        const loginRes = await request(server).put('/api/utente/login').send({ username: "Ilcalmissimo", password: 'Cotoletta.123' });
        const cookie = loginRes.body.token;

        const commentBody = {
            profilo_commentato: 'imposter',
            titolo: 'bruuuh',
            testo: 'ciaoooaoaoa'
        };

        const res = await request(server).post('/api/commento_profilo').send(commentBody).set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(201);
        newComment2 = res.body.Id;
    });
});

describe('GET /api/commento_profilo/:id', () => {
    test('GET /api/commento_profilo/06fef304-2c14-4f07-a00a-3fd45e11e5dc should return comment', async () => {
        const res = await request(server).get('/api/commento_profilo/06fef304-2c14-4f07-a00a-3fd45e11e5dc');
        expect(res.status).toEqual(200);
        expect(res.body).toBeDefined();
    });

    test('GET /api/commento_profilo/aba should return 404', async () => {
        const res = await request(server).get('/api/commento_profilo/aba');
        expect(res.status).toEqual(404);
    });
});

describe('GET /api/commento_profilo/all/:user', () => {
    test('GET /api/commento_profilo/Ilcalmissimo should return a list of comments', async () => {
        const res = await request(server).get('/api/commento_profilo/all/Ilcalmissimo');
        expect(res.status).toEqual(200);
        expect(res.body).toBeDefined();
    });
});

describe('DELETE /api/commento_profilo/:id', () => {
    test(`DELETE /api/commento_profilo/${newComment} should return 401`, async () => {
        const loginRes = await request(server).put('/api/utente/login').send({ username: "Jesosky", password: 'Cotoletta.123' });
        const cookie = loginRes.body.token;
        const res = await request(server).delete(`/api/commento_profilo/${newComment}`).set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(401);
    });

    test(`DELETE /api/commento_profilo/${newComment} should succesfully delete comment`, async () => {
        const loginRes = await request(server).put('/api/utente/login').send({ username: "Ilcalmissimo", password: 'Cotoletta.123' });
        const cookie = loginRes.body.token;
        const res = await request(server).delete(`/api/commento_profilo/${newComment}`).set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(200);
    });
});

describe('PUT /api/commento_profilo/segnala', () => {
    let cookie;

    beforeAll(async () => {
        const loginRes = await request(server)
            .put('/api/utente/login')
            .send({ username: 'Ilcalmissimo', password: "Cotoletta.123" });
        cookie = loginRes.body.token;
    });

    test('PUT /api/commento_profilo/segnala should succesfully flag a post', async () => {
        const res = await request(server).put('/api/commento_profilo/segnala').send({ id: newComment2 }).set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(200);
    });

    test('PUT /api/commento_profilo/segnala should return 404', async () => {
        const res = await request(server).put('/api/commento_profilo/segnala').send({ id: 'aba' }).set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(404);
    });
});

describe('PUT /api/commento_profilo/valuta', () => {
    let cookie;

    beforeAll(async () => {
        const loginRes = await request(server)
        .put('/api/utente/login')
        .send({ username: 'Ilcalmissimo', password: "Cotoletta.123" });
    cookie = loginRes.body.token;
    });

    test('PUT /api/commento_profilo/valuta should return 404', async () => {
        const res = await request(server)
            .put('/api/commento_profilo/valuta')
            .send({ id: 'aba', valutazione: 1 })
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(404);
    });

    test('PUT /api/commento_profilo/valuta should succesfully evaluate comment', async () => {
        const res = await request(server)
            .put('/api/commento_profilo/valuta')
            .send({ id: newComment2, valutazione: 1 })
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(200);
    });

    test('PUT /api/commento_profilo/valuta should succesfully evaluate comment', async () => {
        const res = await request(server)
            .put('/api/commento_profilo/valuta')
            .send({ id: newComment2, valutazione: -1 })
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(200);
    });

    test('PUT /api/commento_profilo/valuta should return 400', async () => {
        const res = await request(server)
            .put('/api/commento_profilo/valuta')
            .send({ id: newComment2, valutazione: -2 })
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(400);
    });
});

describe('PUT /api/commento_profilo/modifica', () => {
    test('PUT /api/commento_profilo/modifica should return 401', async () => {
        const loginRes = await request(server)
        .put('/api/utente/login')
        .send({ username: 'Jesosky', password: "Cotoletta.123" });
        const cookie = loginRes.body.token;

        const res = await request(server)
            .put('/api/commento_profilo/modifica')
            .send({ id: newComment2, titolo: 'bro', testo: 'fraaaa' })
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(401);
    });

    test('PUT /api/commento_profilo/modifica should succesfully edit comment', async () => {
        const loginRes = await request(server)
        .put('/api/utente/login')
        .send({ username: 'Ilcalmissimo', password: "Cotoletta.123" });
        const cookie = loginRes.body.token;

        const res = await request(server)
            .put('/api/commento_profilo/modifica')
            .send({ id: newComment2, titolo: 'bro', testo: 'fraaaa' })
            .set('Cookie', `tokenEpiOpera=${cookie}`);
        expect(res.status).toEqual(200);
    });
});