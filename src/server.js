import http from 'node:http';
import dotenv from 'dotenv'
dotenv.config()

// Create a local server to receive data from
const server = http.createServer();

// Listen to the request event
server.on('request', (request, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        data: 'Hello World!',
    }));
});

server.listen(process.env.PORT, function(){ console.log("Server is started at port:",process.env.PORT)})
