import http from 'node:http';
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'
dotenv.config()



const server = http.createServer();
let DB = []

server.on('request', async (request, response) => {

    if (request.method === 'GET'&& request.url === '/users') {
        let data = "";
        request.on("data", chunk => {
            data += chunk;
        });
console.log(data)
        response.statusCode = 200;
        //response.setHeader('Content-Type', 'application/json')
        response.end(JSON.stringify(DB));
    }

    if (request.method === 'GET'&& request.url.match('|users/[0-9]+$|')) {
console.log('its userid request')
       let reqId = request.url.split('/').pop()
        console.log(`ReqId: ${reqId}`);
   let result = DB.find((data)=>data.id === reqId)
       //console.log('result of searching', result)
        response.statusCode = 200
        //response.setHeader('Content-Type', 'application/json')
        response.end(JSON.stringify(result));
    }

    if (request.method === 'POST'&& request.url === '/users') {
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
        response.setHeader('Content-Type', 'application/json')
        response.end(JSON.stringify(DB));
    }

    if (request.method === 'DELETE'&& request.url.match('|users/[0-9]+$|')) {
        console.log('its userDelete request')
        let reqId = request.url.split('/').pop()
        console.log(`ReqId: ${reqId}`);
      DB =  DB.filter((data)=>data.id != reqId)
        console.log('DB',DB)
        response.statusCode = 204
        response.setHeader('Content-Type', 'application/json')
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
            console.log('updateData',resultRequest)

           let target= DB.find((data)=>data.id === reqId)
            console.log(target)
           target.name = resultRequest.name;
            target.age = resultRequest.age;
            target.hobbies = resultRequest.hobbies;
            target.id = reqId
            response.statusCode = 201
        } catch (err) {
            console.log(err)
        }
        response.setHeader('Content-Type', 'application/json')
        response.end(JSON.stringify(DB));
    }

});

server.listen(process.env.PORT, function(){ console.log("Server is started at port:",process.env.PORT)})
