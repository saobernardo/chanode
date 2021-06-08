const express = require('express');
const path = require('path');
const http = require('http');
const SocketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = SocketIO(server);

server.listen(3000);

app.use(express.static(path.join(__dirname, 'public'))); //por qual pasta vai começar a ler os arquivos

let connectedUsers = [];

//cada nova conexão irá rodar o que está na função
//Todo on é um listener
io.on('connection', (socket) => {
    socket.on('join-request', (username) => {
        socket.username = username;
        connectedUsers.push(username);
        console.log(connectedUsers);

        socket.emit('user-ok', connectedUsers);
        //Transmissão para todos os usuários, menos o atual
        socket.broadcast.emit('list-update', {
            joined: username,
            list: connectedUsers
        });
    });

    //listener do socket que detecta quando uma conexão é interrompida
    socket.on('disconnect', () => {
        connectedUsers = connectedUsers.filter(u => u != socket.username);
        console.log(connectedUsers);

        socket.broadcast.emit('list-update', {
            left: socket.username,
            list: connectedUsers
        });
    });

    //Mensagem enviada por um usuário
    socket.on('send-msg', (txt) => {
        let obj = {
            username: socket.username,
            message: txt
        }

        //socket.emit('show-msg', obj);
        socket.broadcast.emit('show-msg', obj);
    });
});