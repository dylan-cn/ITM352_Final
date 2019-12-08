module.exports = function (io) {
    io.on("connection", socket => {
        console.log("New client connected: " + socket.id);

        socket.on('testData', () => {
            socket.emit('msg', "This is some test data");
        });

        socket.on('sendMsg', (room, msg) => {
            socket.in(room).emit('receivedMsg', msg);
        });

        socket.on('joinRoom', room => {
            socket.join(room);
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