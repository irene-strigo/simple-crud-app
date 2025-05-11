
import http from 'node:http';
import {v4 as uuidv4, validate} from 'uuid'
import dotenv from 'dotenv'
import {checkValidRequestData} from "./validationFunctions.js";
dotenv.config()



const server = http.createServer();
let DB = []

server.on('request', async (request, response) => {

    let urlArr = request.url.split('/').filter((el)=>el!='')

    if (request.method === 'GET'){
        if (urlArr[0]==='api'&& urlArr[1]==='users'&& urlArr.length===2) {
            response.statusCode = 200
            response.write(JSON.stringify(DB))
        }
        if(urlArr[0]!='api'||urlArr[1]!='users'||urlArr.length!=2&&urlArr.length!=3){
            response.statusCode = 400
            response.write("wrong url")

        }
    if (urlArr.length===3 && urlArr[2].match('|[0-9]+$|')) {
        let reqId = urlArr[2]
        if(!validate(urlArr[2])){
            response.statusCode = 400
            response.write('invalid user id')
        }
        if(validate(urlArr[2])) {
            let result = DB.filter((data) => data.id === reqId)

            if (result.length === 0) {
                response.statusCode = 404
                response.write('user not found')
            }
            if (result.length === 1) {
                response.statusCode = 200
                response.write(JSON.stringify(result))
            }
        }

    }

}
    if(request.method === 'POST'){
        if (urlArr[0]==='api'&& urlArr[1]==='users'&& urlArr.length===2) {
        try {
            let json = "";
            for await (const chunk of request) {
                json += chunk;
            }
            const result = JSON.parse(json);
            if(!checkValidRequestData(result)){

                response.statusCode = 400
                response.write("invalid request data")
            }
            if(checkValidRequestData(result)) {
                const unicId = uuidv4()
                result.id = unicId;
                DB.push(result);
                response.statusCode = 201
                response.write(JSON.stringify(DB))
            }
        } catch (err) {
            console.log(err)
        }}else{
            response.statusCode = 400
            response.write("wrong url")
        }
    }

    if (request.method === 'DELETE'){
        if (urlArr.length === 3) {
            let reqId = urlArr[2];
         if(!validate(urlArr[2])){
             response.statusCode = 400;
             response.write("invalid user id")
         }
         if(validate(urlArr[2])) {
            let checkExistence = DB.find((data)=>data.id === reqId)
            if (!checkExistence){
                response.statusCode = 404
                response.write('user not found')
            }
            DB =  DB.filter((data)=>data.id != reqId)
            response.statusCode = 204

        }}else{
            response.statusCode = 400
            response.write("wrong url")
        }

        }

    if (request.method === 'PUT') {
        if (urlArr.length === 3) {
            try {
                let json = "";
                for await (const chunk of request) {
                    json += chunk;
                }
                const resultRequest = JSON.parse(json);
                if(!checkValidRequestData(resultRequest)){
                    response.statusCode = 400;
                    response.write("invalid request data")
                }
                let reqId = urlArr[2];
                if(!validate(reqId)){
                    response.statusCode = 400;
                    response.write("invalid user id")
                }
                if(validate(reqId)){
                let target = DB.find((data) => data.id === reqId)
                if (!target){
                    response.statusCode = 404
                    response.write('user not found')
                }
                if(target&&checkValidRequestData(resultRequest)){
                target.name = resultRequest.name;
                target.age = resultRequest.age;
                target.hobbies = resultRequest.hobbies;
                target.id = reqId;
                response.statusCode = 200;
                response.write(JSON.stringify(DB));
                }

            } }catch (err) {
                console.log(err)
            }
        }else{
            response.statusCode = 400
            response.write("wrong url")
        }
    }
        response.end();


});

server.listen(process.env.PORT, function(){ console.log("Server is started at port:",process.env.PORT)})
