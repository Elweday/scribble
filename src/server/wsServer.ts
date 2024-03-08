import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: '*',
  }
});


io.on("connection", (socket) => {
  socket.on("join", (data) => {
    socket.broadcast.emit("user-joined", data);
  })

  socket.on("leave", (data) => {
    socket.broadcast.emit("user-left", data);
  })

})


io.listen(5665);
