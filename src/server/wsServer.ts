import { Server } from "socket.io";

const io = new Server({
  cors: { origin: '*' }
});



io.on("connection", (socket) => {
  socket.on("game_event", (event) => {
    socket.broadcast.emit("broadcasted_game_event", event)
  })

  socket.on("aloha", ()=>{
    socket.emit("aloha")
    console.log("aloha from signaling server")
  })
})

io.listen(3001);