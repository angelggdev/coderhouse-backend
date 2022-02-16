const random = (num) => {
    const count = {};
    for (let i = 0; i < num; i++) {
        let number = Math.random();
        number = Math.ceil(number * 1000);
        count[number] = count[number] ? count[number] + 1 : 1;
    }
    return count;
};

const num = process.argv[2];

process.on('message', (data) => {
    process.send(random(num));
});
