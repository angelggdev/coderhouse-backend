const chatSocket = io.connect();

chatSocket.on('messages', (data) => {
    render(data);
});

function render(data) {
    if (data.length > 0) {
        data.forEach((info) => {
            $('#messages').append(`
                <div style="display:flex; align-items:center; gap: 5px;">
                    <strong style="color:blue">${info.author.id}</strong>
                    <span style="color:brown">[${info.time}]</span> 
                    <i style="color:green">${info.text}</i>
                    <img src=${info.author.avatar} alt="foto de perfil" style="width: 50px; height: 50px">
                </div>
            `);
        });
    }
}

$('#myForm').submit((e) => {
    e.preventDefault();

    const username = $('#username').val();
    const name = $('#name').val();
    const lastName = $('#lastName').val();
    const age = $('#age').val();
    const alias = $('#alias').val();
    const avatar = $('#avatar').val();
    const text = $('#texto').val();

    if (username) {
        const message = {
            author: {
                id: username,
                name: name, 
                lastName: lastName,
                age: age,
                alias: alias,
                avatar: avatar
            },
            text: text,
        };
        chatSocket.emit('new-message', message);

        $('#texto').val(null);

        return false;
    } else {
        alert('Ingrese su email');
    }
});
