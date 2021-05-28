const express = require('express');
const path = require('path');
const http = require('http');
const SocketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = SocketIO(server);

server.listen(3000);

app.use(express.static(path.join(__dirname, 'public'))); //por qual pasta vai começar a ler os arquivos

//cada nova conexão irá rodar o que está na função
io.on('connection', (socket) => {
    
});