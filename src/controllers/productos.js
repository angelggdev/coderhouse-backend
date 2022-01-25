const productsSocket = io.connect();

productsSocket.on('products', (data) => {
    renderProducts(data);
});

function renderProducts(data) {
    $('#tablaProductos').html(data);
}

$('#productForm').submit((e) => {
    e.preventDefault();

    const product = {
        title: $('#title').val(),
        price: $('#price').val(),
        thumbnail: $('#thumbnail').val(),
    };

    productsSocket.emit('new-product', product);

    $('#title').val(null);
    $('#price').val(null);
    $('#thumbnail').val(null);

    return false;
});
