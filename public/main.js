const socket = io(); //iniciando minha conexão socket
let username = '';
let userList = [];

let loginPage = document.querySelector('#loginPage');
let chatPage = document.querySelector('#chatPage');

let loginInput = document.querySelector('#loginNameInput');
let textInput = document.querySelector('#chatTextInput');

loginPage.style.display = 'flex';
chatPage.style.display = 'none';

function renderUserList(){
    let ul = document.querySelector('.userList');
    ul.innerHTML = '';

    userList.forEach(i => {
        ul.innerHTML += '<li>'+i+'</li>';
    });
}

function addMessage(type, user, msg) {
    let ul = document.querySelector('.chatList');

    switch(type){
        case 'status':
            ul.innerHTML += '<li class="m-status">'+msg+'</li>';
        break;
        case 'msg':
            //Verifica se a mensagem é minha
            if(username == user){
                ul.innerHTML += `<li class="m-txt"><span class="me">${user}:</span> ${msg}</li>`;
            }
            else{
                ul.innerHTML += `<li class="m-txt"><span>${user}:</span> ${msg}</li>`;
            }
        break;
    }

    ul.scrollTop = ul.scrollHeight;
}

//Evento por apertada de tecla
loginInput.addEventListener('keyup', (e) => {
    //se a tecla pressionada for Enter
    if(e.keyCode === 13){
        let name = loginInput.value.trim();
        if(name != ''){
            username = name;
            document.title = 'Chat ('+username+')';

            socket.emit('join-request', username);
        }
    }
});

textInput.addEventListener('keyup', (e)=> {
    if(e.keyCode === 13){
        let txt = textInput.value.trim();
        textInput.value = '';

        if(txt != ''){
            addMessage('msg', username, txt);
            socket.emit('send-msg', txt);
        }
    }
})

//Conexão estabelecida após digitar o nome
socket.on('user-ok', (list) => {
    loginPage.style.display = 'none';
    chatPage.style.display = 'flex';

    textInput.focus();

    addMessage('status', null, 'Conectado!');

    userList = list;
    renderUserList();
});

//Atualizar a lista de usuários conectados
socket.on('list-update', (data) => {
    if(data.joined){
        addMessage('status', null, data.joined+ ' entrou no chat!');
    }

    if(data.left){
        addMessage('status', null, data.left+ ' saiu do chat!');
    }

    userList = data.list;
    renderUserList();
});

socket.on('show-msg', (data) => {
    addMessage('msg', data.username, data.message);
});

//Toda vez que uma tentativa de reconexão falhar
socket.io.on('reconnect_error', () => {
    addMessage('status', null, 'Tentando reconectar');
});

//Reconexão estabelecida
socket.io.on('reconnect', () => {
    addMessage('status', null, 'Reconectado!');

    if(username != ''){
        socket.emit('join-request', username);
    }
});

//Caiu minha conexão
socket.on('disconnect', () => {
    addMessage('status', null, 'Você foi desconectado!');
    userList = [];
    renderUserList();
});

