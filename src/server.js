/*import http from 'node:http';
import dotenv from 'dotenv'
dotenv.config()
import { v4 as uuidv4 } from 'uuid'

const server = http.createServer();
let DB = []


server.on('request', async (request, res) => {

    if (request.method === 'POST') {
        try {
            let json = '';
            for await (const chunk of request) {
                json += chunk;
            }
            const res = JSON.parse(json);
            const unicId = uuidv4()
            res.id = unicId;
            DB.push(res);
        } catch (err) {
            console.log(err)
        }
    }
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(DB));
});

server.listen(process.env.PORT, function(){ console.log("Server is started at port:",process.env.PORT)})*/
