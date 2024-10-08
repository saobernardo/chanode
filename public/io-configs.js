let connectedUsers = [];

//cada nova conexão irá rodar o que está na função
//Todo on é um listener
module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('join-request', (username) => {
        socket.username = username;
        connectedUsers.push(username);

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
}