import http from 'node:http';
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'
dotenv.config()



const server = http.createServer();
let DB = []

server.on('request', async (request, response) => {

    if (request.method === 'GET'&& request.url === '/app/users'|| '/app/users/') {
        let data = "";
        request.on("data", chunk => {
            data += chunk;
        });

        response.statusCode = 200;

        response.end(JSON.stringify(DB));
    }

    if (request.method === 'GET'&& request.url.match('|users/[0-9]+$|')) {

       let reqId = request.url.split('/').pop()

   let result = DB.find((data)=>data.id === reqId)

        response.statusCode = 200

        response.end(JSON.stringify(result));
    }

    if (request.method === 'POST'&& request.url === '/app/users'|| '/app/users/') {
        try {
            let json = "";
            for await (const chunk of request) {
                json += chunk;
            }
            const result = JSON.parse(json);
            const unicId = uuidv4()
            result.id = unicId;
            DB.push(result);
            response.statusCode = 201
        } catch (err) {
            console.log(err)
        }

        response.end(JSON.stringify(DB));
    }

    if (request.method === 'DELETE'&& request.url.match('|users/[0-9]+$|')) {
        console.log('its userDelete request')
        let reqId = request.url.split('/').pop()
        console.log(`ReqId: ${reqId}`);
      DB =  DB.filter((data)=>data.id != reqId)

        response.statusCode = 204

        response.end(JSON.stringify(DB));
    }

    if (request.method === 'PUT'&& request.url.match('|users/[0-9]+$|')) {
        try {
            let json = "";
            for await (const chunk of request) {
                json += chunk;
            }
            const resultRequest = JSON.parse(json);
            let reqId = request.url.split('/').pop()


           let target= DB.find((data)=>data.id === reqId)

           target.name = resultRequest.name;
            target.age = resultRequest.age;
            target.hobbies = resultRequest.hobbies;
            target.id = reqId
            response.statusCode = 201
        } catch (err) {
            console.log(err)
        }

        response.end(JSON.stringify(DB));
    }

});

server.listen(process.env.PORT, function(){ console.log("Server is started at port:",process.env.PORT)})
