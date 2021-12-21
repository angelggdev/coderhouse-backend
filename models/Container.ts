import fs from 'fs';

export default class Container {

    fileName:any;
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

    async save(object) {
        let objects:any = await this.readFile();
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
                objects[objectIndex] = {
                    ...object,
                };
                await this.writeFile(objects);
                return `se actualizó el producto con el id ${object.id}`;
            } else {
                return `no se encontró un producto con el id ${object.id}`;
            }
        }
    }

    async getById(number) {
        let object:any = await this.readFile();
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
            return 'no se han encontrado productos';
        }
    }

    async deleteById(number) {
        let objects:any = await this.readFile();
        objects = objects.filter((x) => x.id !== number);
        await this.writeFile(objects);
    }
}
