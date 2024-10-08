const express = require('express');
const path = require('path');
const http = require('http');
const SocketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = SocketIO(server);

server.listen(3000);

app.use(express.static(path.join(__dirname, 'public'))); //por qual pasta vai começar a ler os arquivos

const io_config = require('./public/io-configs');
io_config(io)