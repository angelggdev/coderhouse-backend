const fs = require('fs');
const FileSystem = require('./FileSystem');

class ProductContainer extends FileSystem {
    constructor() {
        super('./txt/productos.txt');
    }

    async save(object) {
        let objects = await this.readFile();
        if (!object.id) {
            const id =
                objects.length === 0 ? 1 : objects[objects.length - 1].id + 1;
            objects.push({ ...object, id });
            await this.writeFile(objects);
            return `se agregó un producto con el id ${id}`;
        } else {
            let objectIndex;
            objects.forEach((x, i) => x.id === object.id && (objectIndex = i));
            if (objectIndex) {
                Object.assign(objects[objectIndex], object);
                await this.writeFile(objects);
                return `se actualizó el producto con el id ${object.id}`;
            } else {
                return {
                    error: `no se encontró un producto con el id ${object.id}`,
                };
            }
        }
    }

    async getById(number) {
        let object = await this.readFile();
        object = object.filter((x) => x.id === number)[0];
        if (object) {
            return object;
        } else {
            return null;
        }
    }

    async getAll() {
        const objects = await this.readFile();
        if (objects.length > 0) {
            return objects;
        } else {
            return { error: 'no se han encontrado productos' };
        }
    }

    async deleteById(number) {
        let objects = await this.readFile();
        let filteredObjects = objects.filter((x) => x.id !== number);
        if (objects.length === filteredObjects.length) {
            return { error: `no se encontró el producto con id ${number}` };
        } else {
            await this.writeFile(filteredObjects);
            return `producto con id ${number} eliminado`;
        }
    }
}

module.exports = ProductContainer;
