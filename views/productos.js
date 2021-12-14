const socket2 = io.connect();

socket2.on('products', data => {
    render2(data);
});

function render2(data){
    $('#tablaProductos').html(data);
}

$('#productForm').submit(e => {
    e.preventDefault();

    const product = {
        title: $('#title').val(),
        price: $('#price').val(),
        thumbnail: $('#thumbnail').val(),
    }
    
    socket2.emit('new-product', product);
    return false;
});
