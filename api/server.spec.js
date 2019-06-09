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
            const body=JSON.parse(response.text);
            expect(body.data.status).toBe('GraphQL status: OK');
            done();
        });
    })
     describe('Register user testing', () => {
        test('Should return status code 200 and confirmation for valid input when user details are provided', async (done) => {
           const payLoad= `mutation {createUser(name:"John",email:"j.ohn@hotmail.com",password:"letmeinnow"){name}}`;

            const response = await request(app).post('/graphql').send({query:payLoad});
            expect(response.statusCode).toBe(200);
            // expect(response.text).toBe( "{\"data\":{\"status\":\"OK\"}}");
            const body=JSON.parse(response.text);
            expect(body.data.createUser.name).toBe('John');
            done();
        });

        test('Should throw error when name is not present', async (done) => {
           const payLoad= `mutation {createUser(email:"j.ohn@hotmail.com",password:"letmeinnow"){name}}`;

            const response = await request(app).post('/graphql').send({query:payLoad});
            expect(response.statusCode).toBe(200);
            const body=JSON.parse(response.text);
            expect(body.errors[0].message).toBe('Name not recieved');
            done();
        });
        test('Should throw error when email is not present', async (done) => {
           const payLoad= `mutation {createUser(name:"John",password:"letmeinnow"){name}}`;

            const response = await request(app).post('/graphql').send({query:payLoad});
            expect(response.statusCode).toBe(200);
            const body=JSON.parse(response.text);
            expect(body.errors[0].message).toBe('Email not recieved');
            done();
        });
        test('Should throw error when password is not present', async (done) => {
           let payLoad= `mutation {createUser(name:"John",email:"j.ohn@hotmail.com"){name}}`;

            const response = await request(app).post('/graphql').send({query:payLoad});
            expect(response.statusCode).toBe(200);
            const body=JSON.parse(response.text);
            expect(body.errors[0].message).toBe('Password not recieved');
            done();
        });
        test('Should throw error when length of name > 15 ', async (done) => {
           const payLoad= `mutation {createUser(name:"John with a very long name",email:"j.ohn@hotmail.com",password:"letmeinnow"){name}}`;

            const response = await request(app).post('/graphql').send({query:payLoad});
            expect(response.statusCode).toBe(200);
            const body=JSON.parse(response.text);
            expect(body.errors[0].message).toBe('Name should be less than 15 characters');
            done();
        });
        test('Should throw error when email is not valid ', async (done) => {
           const payLoad= `mutation {createUser(name:"John",email:"j.ohn[at]hotmail.com",password:"letmeinnow"){name}}`;
           const response = await request(app).post('/graphql').send({query:payLoad});
            expect(response.statusCode).toBe(200);
            const body=JSON.parse(response.text);
            expect(body.errors[0].message).toBe('Email is not valid');
            done();
        });
        test('Should throw error when password is less than 8 characters ', async (done) => {
           const payLoad= `mutation {createUser(name:"John",email:"j.ohn@hotmail.com",password:"abc"){name}}`;
           const response = await request(app).post('/graphql').send({query:payLoad});
            expect(response.statusCode).toBe(200);
            const body=JSON.parse(response.text);
            expect(body.errors[0].message).toBe('Password should be minimum 8 characters');
            done();
        });
        test('Should throw error when username or email already exists', async (done) => {
           
            const payLoad= `mutation {createUser(name:"JohnDup",email:"j.ohn@hotmail.com",password:"letmeinnow"){name}}`;
            const payLoadDuplicatEmail= `mutation {createUser(name:"anotherperson",email:"j.ohn@hotmail.com",password:"letmeinnow"){name}}`;
            const payLoadDuplicatUser= `mutation {createUser(name:"JohnDup",email:"anotheremail@hotmail.com",password:"letmeinnow"){name}}`;
            // await request(app).post('/graphql').send({query:payLoad});         
            const response = await request(app).post('/graphql').send({query:payLoadDuplicatUser});
             expect(response.statusCode).toBe(200);
             const body=JSON.parse(response.text);
             expect(body.errors[0].message).toBe('Name already exists');
             const response2 = await request(app).post('/graphql').send({query:payLoadDuplicatEmail});
             expect(response2.statusCode).toBe(200);
             const body2=JSON.parse(response2.text);
             expect(body2.errors[0].message).toBe('Email already exists');            
             done();
             //https://blog.pusher.com/handling-authentication-in-graphql-jwt/
         });


    })
