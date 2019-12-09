module.exports = function (io) {
    io.on("connection", socket => {
        console.log("New client connected: " + socket.id);

        socket.on('sendMsg', (room, msg) => {
            socket.in(room).emit('receivedMsg', msg);
        });

        socket.on('joinRoom', room => {
            socket.join(room);
        });

        socket.on('send', data => {
            // Send to everyone else
            socket.broadcast.emit('msg', `${data.username}: ${data.msg}`);
            // Also send to client
            socket.emit('msg', `${data.username}: ${data.msg}`);
        });

        // disconnect is fired when a client leaves the server
        socket.on("disconnect", () => {
            console.log(socket.id + " has disconnected");
        });

        socket.on("disconnecting", () => {
            console.log(socket.id + " is disconnecting");
            for (let room in socket.rooms) {
                io.in(room).emit('receivedMsg', socket.id + " leaving room");
            }

        });
    });
}

console.log("running socket.js");