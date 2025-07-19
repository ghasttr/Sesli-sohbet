const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// public klasöründeki dosyaları sun
app.use(express.static("public"));

io.on("connection", (socket) => {
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", socket.id);

    socket.on("offer", data => io.to(data.to).emit("offer", { from: socket.id, offer: data.offer }));
    socket.on("answer", data => io.to(data.to).emit("answer", { from: socket.id, answer: data.answer }));
    socket.on("ice-candidate", data => io.to(data.to).emit("ice-candidate", { from: socket.id, candidate: data.candidate }));

    socket.on("disconnect", () => socket.to(roomId).emit("user-disconnected", socket.id));
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));