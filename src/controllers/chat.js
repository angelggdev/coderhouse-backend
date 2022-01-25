const chatSocket = io.connect();

chatSocket.on('messages', (data) => {
    render(data);
});

function render(data) {
    if (data.length > 0) {
        data.forEach((info) => {
            $('#messages').append(`
                <div>
                    <strong style="color:blue">${info.author}</strong>
                    <span style="color:brown">[${info.time}]</span> 
                    <i style="color:green">${info.text}</i>
                </div>
            `);
        });
    }
}

$('#myForm').submit((e) => {
    e.preventDefault();

    let username = $('#username').val();

    if (username) {
        const message = {
            author: username,
            text: $('#texto').val(),
        };
        chatSocket.emit('new-message', message);

        $('#texto').val(null);

        return false;
    } else {
        alert('Ingrese su email');
    }
});
