const request = require('supertest');
const app = require('./server')
const port = 3001
app.listen(port, () => {
    console.log(`Running on http://localhost:${port}/graphql`)
})
describe('Test the root path of express server', () => {
    test('It should response the GET method', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        console.log(response);
    });
})