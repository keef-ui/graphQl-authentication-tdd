const request = require('supertest');
const app = require('./server')
const port = 3001
app.listen(port, () => {
    console.log(`Running on http://localhost:${port}/graphql`)
})
describe('Test the root path', () => {
    test('It should response the GET method', async () => {
        const response = await request(app).post('/graphql').send({query:'query {status}'});
        expect(response.statusCode).toBe(200);
    });
})