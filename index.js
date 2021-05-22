
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from 'express'
import expressWs from 'express-ws'
import http from 'http'

// Our port
let port = 3000;

// App and server
let app = express();
let server = http.createServer(app).listen(port);    

// Apply expressWs
expressWs(app, server);

app.use(express.static(__dirname + '/views'));

// Get the route / 
app.get('/', (req, res) => {
    res.status(200).send("Welcome to our app");
});

// Get the /ws websocket route
app.ws('/ws', async function(ws, req) {
    ws.on('message', async function(msg) {
        // What was the message?
        console.log(msg);
        // Send back some data
        ws.send(JSON.stringify({
            "append" : true,
            "returnText" : "I am using websockets!"
        }));
    });
});