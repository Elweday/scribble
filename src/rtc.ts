
import { io } from "socket.io-client";

const socketClient = io("http://localhost:3000");

socketClient.on("connect", () => {
    console.log("Connected to server");
})


