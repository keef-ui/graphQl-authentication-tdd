const server = require('./server');
//Listen to port
const port = 3000
server.listen(port, () => {
    console.log(`Running on http://localhost:${port}/graphql`)
})