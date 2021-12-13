const socket = io.connect();

socket.on('messages', data => {
    render(data);
});

function render(data){
    data.forEach((info) => {
        $('#messages').prepend(`
            <div>
                [${info.time}] <strong>${info.author}</strong>
                <em>${info.text}</em>
            </div>
        `)
    })
}

$('#myForm').submit(e => {
    e.preventDefault();

    let username = $('#username').val();

    if(username) {
        const message = {
            author: username,
            text: $('#texto').val()
        }
        socket.emit('new-message', message);
        return false;
    } else {
        alert("Ingrese nombre de usuario")
    }

});
