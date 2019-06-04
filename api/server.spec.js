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
     describe('Register user testing', () => {
        test('Should return status code 200 and confirmation for valid input when user details are provided', async (done) => {
           let payLoad= `mutation {createUser(name:"John",email:"j.ohn@hotmail.com",password:"letmeib"){name}}`;

            const response = await request(app).post('/graphql').send({query:payLoad});
            expect(response.statusCode).toBe(200);
            // expect(response.text).toBe( "{\"data\":{\"status\":\"OK\"}}");
            let body=JSON.parse(response.text);
            expect(body.data.createUser.name).toBe('John');
            done();
        });

        test('Should throw error when name is not present', async (done) => {
           let payLoad= `mutation {createUser(email:"j.ohn@hotmail.com",password:"letmeib"){name}}`;

            const response = await request(app).post('/graphql').send({query:payLoad});
            expect(response.statusCode).toBe(200);
            let body=JSON.parse(response.text);
            expect(body.errors[0].message).toBe('Name not recieved');
            done();
        });
        test('Should throw error when email is not present', async (done) => {
           let payLoad= `mutation {createUser(name:"John",password:"letmeib"){name}}`;

            const response = await request(app).post('/graphql').send({query:payLoad});
            expect(response.statusCode).toBe(200);
            let body=JSON.parse(response.text);
            expect(body.errors[0].message).toBe('Email not recieved');
            done();
        });
        test('Should throw error when password is not present', async (done) => {
           let payLoad= `mutation {createUser(name:"John",email:"j.ohn@hotmail.com"){name}}`;

            const response = await request(app).post('/graphql').send({query:payLoad});
            expect(response.statusCode).toBe(200);
            let body=JSON.parse(response.text);
            expect(body.errors[0].message).toBe('Password not recieved');
            done();
        });
    })
