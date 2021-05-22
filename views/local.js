// @connect
// Connect to the websocket
let socket;
const connect = function() {
    return new Promise((resolve, reject) => {
        const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
        const port = 3000;
        const socketUrl = `${socketProtocol}//${window.location.hostname}:${port}/ws/`
        
        // Define socket
        socket = new WebSocket(socketUrl);

        socket.onopen = (e) => {
            // Send a little test data, which we can use on the server if we want
            socket.send(JSON.stringify({ "loaded" : true }));
            // Resolve the promise - we are connected
            resolve();
        }

        socket.onmessage = (data) => {
            console.log(data);
            // Any data from the server can be manipulated here.
            let parsedData = JSON.parse(data.data);
            if(parsedData.append === true) {
                const newEl = document.createElement('p');
                newEl.textContent = parsedData.returnText;
                document.getElementById('websocket-returns').appendChild(newEl);
            }
        }

        socket.onerror = (e) => {
            // Return an error if any occurs
            console.log(e);
            resolve();
            // Try to connect again
            connect();
        }
    });
}

// @isOpen
// check if a websocket is open
const isOpen = function(ws) { 
    return ws.readyState === ws.OPEN 
}

// When the document has loaded
document.addEventListener('DOMContentLoaded', function() {
    // Connect to the websocket
    connect();
    // And add our event listeners
    document.getElementById('websocket-button').addEventListener('click', function(e) {
        if(isOpen(socket)) {
            socket.send(JSON.stringify({
                "data" : "this is our data to send",
                "other" : "this can be in any format"
            }))
        }
    });
});
