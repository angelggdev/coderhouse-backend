const fs = require('fs');

class FileSystem {

    constructor(fileName) {
        this.fileName = fileName;
    }

    async readFile() {
        let object = [];
        try {
            object = JSON.parse(
                await fs.promises.readFile(this.fileName, 'utf-8')
            );
        } catch (err) {
            console.log(err);
        }
        return object;
    }

    async writeFile(object) {
        try {
            await fs.promises.writeFile(this.fileName, JSON.stringify(object));
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = FileSystem;