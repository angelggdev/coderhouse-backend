const chatSocket = io.connect();

const authorSchema = new normalizr.schema.Entity('author');
const messagesSchema = new normalizr.schema.Entity('messages', {
    messages: [
        {
            author: authorSchema,
        },
    ],
});

chatSocket.on('messages', (data) => {
    const normalizedLength = JSON.stringify(data).length;
    const _data = normalizr.denormalize(
        data.result,
        messagesSchema,
        data.entities
    );
    let denormalizedLength = _data && JSON.stringify(_data).length;
    const compresion = `${Math.floor(
        (normalizedLength / denormalizedLength) * 100
    )}%`;
    _data && render(_data.messages, compresion);
});

function render(data, compresion) {
    if (data.length > 0) {
        $('#messages').empty();
        $('#compresion').empty();
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
        $('#compresion').append(compresion);
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
                avatar: avatar,
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
