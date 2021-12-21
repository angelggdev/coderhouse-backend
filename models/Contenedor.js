const fs = require('fs');

class Contenedor {
    constructor(fileName) {
        this.fileName = fileName;
    }

    async save(object) {
        let objects = [];
        try {
            objects = JSON.parse(
                await fs.promises.readFile(this.fileName, 'utf-8')
            );
        } catch (err) {
            console.log(err);
        }
        if(!object.id){
            const id = objects.length === 0 ? 1 : objects[objects.length - 1].id + 1;
            objects.push({ ...object, id });
            try {
                await fs.promises.writeFile(this.fileName, JSON.stringify(objects));
            } catch (err) {
                console.log(err);
            }
            return (`se agregó un producto con el id ${id}`);
        } else {
            let objectIndex;
            objects.forEach(
                (x, i) => x.id === object.id && (objectIndex = i)
            );
            if(objectIndex){
                objects[objectIndex] = {
                    ...object
                }
                try {
                    await fs.promises.writeFile(this.fileName, JSON.stringify(objects));
                } catch (err) {
                    console.log(err);
                }
                return (`se actualizó el producto con el id ${object.id}`);
            } else {
                return (`no se encontró un producto con el id ${object.id}`);
            }
        }
    }

    async getById(number) {
        let object;
        try {
            object = JSON.parse(
                await fs.promises.readFile(this.fileName, 'utf-8')
            ).filter((x) => x.id === number)[0];
        } catch (err) {
            console.log(err);
        }
        if (object) {
            console.log('producto con id 2: \n', object);
            return object;
        } else {
            console.log(`no se ha encontrado un producto con el id ${number}`);
            return null;
        }
    }

    async getAll() {
        try {
            const objects = JSON.parse(
                await fs.promises.readFile(this.fileName, 'utf-8')
            );
            console.log(objects)
            if (objects.length > 0) {
                console.log('lista de productos:', objects);
                return objects;
            } else {
                console.log('no se han encontrado productos');
                return 'no se han encontrado productos';
            }
        } catch (err) {
            console.log(err)
            console.log('no se han encontrado productos');
            return 'no se han encontrado productos';
        }
    }

    async deleteById(number) {
        try {
            const objects = JSON.parse(
                await fs.promises.readFile(this.fileName, 'utf-8')
            ).filter((x) => x.id !== number);
            await fs.promises.writeFile(this.fileName, JSON.stringify(objects));
            console.log(`producto con id ${number} eliminado`);
        } catch (err) {
            console.log(err);
        }
    }

    async deleteAll() {
        try {
            await fs.promises.writeFile(this.fileName, JSON.stringify([]));
            console.log('se han eliminado todos los productos');
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = Contenedor;
