import { WebSocketServer } from "ws";

console.log("Start")

const aWebSocketServer = new WebSocketServer({ port: 8080 });

let aWebSocketPlayer;

aWebSocketServer.on("connection", (aWebSocketClient, req) => {
    const ip = req.socket.remoteAddress;
    console.log(`Connected from IP= ${ip}`)

    if(!aWebSocketPlayer){
        console.log("Player connected")
        aWebSocketPlayer = aWebSocketClient

        aWebSocketPlayer.on("close", () =>{
            aWebSocketPlayer = null
        })
        aWebSocketClient.on('error', console.error)

        aWebSocketPlayer.on("message", (data) => {
            aWebSocketServer.clients.forEach((client) =>{
                if(client !== aWebSocketPlayer && WebSocket.OPEN === client.readyState){
                    client.send(data)
                }
            })
        })

        const akvData = {
            id: 1
        };

        aWebSocketClient.send(JSON.stringify(akvData))
    }
})

console.log("Done")