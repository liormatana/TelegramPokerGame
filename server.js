const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

let players = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinGame', (data) => {
        if (!players[data.seat]) {
            players[data.seat] = { id: socket.id, name: data.name, chips: 1000 };
            io.emit('updatePlayers', players);
            console.log(`${data.name} joined at seat ${data.seat}`);
        }
    });

    socket.on('disconnect', () => {
        Object.keys(players).forEach(seat => {
            if (players[seat].id === socket.id) {
                console.log(`${players[seat].name} disconnected`);
                delete players[seat];
                io.emit('updatePlayers', players);
            }
        });
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
