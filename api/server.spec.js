const request = require('supertest');
const app = require('./server')
const port = 3001

    describe('Test the root path of express server2', () => {
    test('It should response the GET method', async (done) => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Api server setup');
        done();
        });
    })
    describe('Test graphQL paths', () => {
        test('It should response the query {status}', async (done) => {
            const response = await request(app).post('/graphql').send({query:'query {status}'});
            expect(response.statusCode).toBe(200);
            // expect(response.text).toBe( "{\"data\":{\"status\":\"OK\"}}");
            let body=JSON.parse(response.text);
            expect(body.data.status).toBe('GraphQL status: OK');
            done();
        });
    })