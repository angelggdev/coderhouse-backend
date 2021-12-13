const socket = io.connect();

socket.on('messages', data => {
    render(data);
});

function render(data){
    data.forEach((info) => {
        $('#messages').prepend(`
            <div>
                <strong style="color:blue">${info.author}</strong>
                <span style="color:brown">[${info.time}]</span> 
                <i style="color:green">${info.text}</i>
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
