const request = require('supertest');
const path = require('path');
const fs = require('fs');
const server = require('../server');
const mongoose = require('mongoose');

beforeAll(async () => {
    jest.setTimeout(10000);
    mongoose.connect(
        process.env.DB_TOKEN,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
});

afterAll(async () => {
    await mongoose.connection.close();
})

describe('POST /api/upload', () => {
    test('POST /api/upload should upload a file', async () => {
        const loginRes = await request(server).put('/api/utente/login').send({ username: "Ilcalmissimo", password: 'Cotoletta.123' });
        const cookie = loginRes.body.token;

        const fileContent = Buffer.from('dummy file content');
        const filePath = path.resolve(__dirname, 'dummy_file.txt');

        fs.writeFileSync(filePath, fileContent);

        const response = await request(server)
            .post('/api/upload')
            .attach('file', filePath)
            .set('Cookie', [`tokenEpiOpera=${cookie}`]); // Replace with your actual authentication token

        fs.unlinkSync(filePath);

        expect(response.status).toEqual(201);
        expect(response.body.name).toEqual('dummy_file.txt');
        expect(response.body.path).toEqual('./assets/dummy_file.txt');
    });

    test('POST /api/upload should handle missing file', async () => {
        const loginRes = await request(server).put('/api/utente/login').send({ username: "Ilcalmissimo", password: 'Cotoletta.123' });
        const cookie = loginRes.body.token;

        const response = await request(server)
            .post('/api/upload')
            .set('Cookie', [`tokenEpiOpera=${cookie}`]); // Replace with your actual authentication token

        expect(response.status).toEqual(500);
        expect(response.body.Error).toEqual('file not found');
    });

    test('POST /api/upload should handle upload error', async () => {
        const loginRes = await request(server).put('/api/utente/login').send({ username: "Ilcalmissimo", password: 'Cotoletta.123' });
        const cookie = loginRes.body.token;

        const response = await request(server)
            .post('/api/upload')
            .field('notFile', 'some data')
            .set('Cookie', [`tokenEpiOpera=${cookie}`]); // Replace with your actual authentication token

        expect(response.status).toEqual(500);
        expect(response.body.Error).toEqual('file not found');
    });
});