
import http from 'node:http';
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'
dotenv.config()



const server = http.createServer();
let DB = []

server.on('request', async (request, response) => {
    if (request.method === 'GET'){
        if (request.url === '/api/users/') {
            response.statusCode = 200
            response.write(JSON.stringify(DB))
        }
    if (request.url.match('|users/[0-9]+$|')) {
        console.log('its userid request')
        let reqId = request.url.split('/').pop()
        console.log(`ReqId: ${reqId}`);
      let result =  DB.filter((data) => data.id === reqId)

        response.statusCode = 200
        response.write(JSON.stringify(result))

    }
}
    if(request.method === 'POST'){
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
            response.write(JSON.stringify(DB))

        } catch (err) {
            console.log(err)
        }}

    if (request.method === 'DELETE'){
            console.log('its userDelete request')
            let reqId = request.url.split('/').pop()
            console.log(`ReqId: ${reqId}`);
            DB =  DB.filter((data)=>data.id != reqId)
            console.log('DB',DB)
            response.statusCode = 204
           response.write('Deleted')

        }

    if (request.method === 'PUT') {
            try {
                let json = "";
                for await (const chunk of request) {
                    json += chunk;
                }
                const resultRequest = JSON.parse(json);
                let reqId = request.url.split('/').pop()
                console.log('updateData', resultRequest)

                let target = DB.find((data) => data.id === reqId)
                console.log(target)
                target.name = resultRequest.name;
                target.age = resultRequest.age;
                target.hobbies = resultRequest.hobbies;
                target.id = reqId
                response.statusCode = 201
                response.write(JSON.stringify(DB))


            } catch (err) {
                console.log(err)
            }}

    response.end();


});

server.listen(process.env.PORT, function(){ console.log("Server is started at port:",process.env.PORT)})
