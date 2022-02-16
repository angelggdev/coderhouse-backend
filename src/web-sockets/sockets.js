const axios = require('axios');
const fs = require('fs');
const normalizr = require('normalizr');
const messagesSchema = require('../schemas/messages');

module.exports = function (io, PORT) {
    io.on('connection', async (socket) => {
        //chat socket
        try {
            messages = JSON.parse(
                await fs.promises.readFile('src/txt/messages.txt', 'utf-8')
            );
        } catch (err) {
            console.log(err);
        }

        const normalizedMessages = normalizr.normalize(
            messages,
            messagesSchema
        );
        socket.emit('messages', normalizedMessages);

        socket.on('new-message', async (data) => {
            data.time = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
            data.id = data.time;
            //messages.messages.push(data);
            let savedMessages;

            try {
                savedMessages = JSON.parse(
                    await fs.promises.readFile('src/txt/messages.txt', 'utf-8')
                );
            } catch (err) {
                console.log(err);
            }

            savedMessages.messages.push(data);

            try {
                fs.promises.writeFile(
                    'src/txt/messages.txt',
                    JSON.stringify(savedMessages)
                );
            } catch (err) {
                console.log(err);
            }
            const normalizedData = normalizr.normalize(
                savedMessages,
                messagesSchema
            );
            io.sockets.emit('messages', normalizedData);
        });

        //products socket

        let products;

        async function getProducts() {
            const url = `http://localhost:${PORT}/api/productos`;
            await axios(url, {
                method: 'GET',
                withCredentials: true,
            })
                .then((res) => (products = res.data))
                .catch((err) => console.log(err));
        }

        await getProducts();

        socket.emit('products', products);

        socket.on('new-product', async (data) => {
            await productContainer.saveProduct({
                name: data.title,
                price: data.price,
                thumbnail: data.thumbnail,
            });
            await getProducts();
            io.sockets.emit('products', products);
        });
    });
};
