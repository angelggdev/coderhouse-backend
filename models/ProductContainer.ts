import FileSystem from './FileSystem';
import { Product } from './Product';

export default class ProductContainer extends FileSystem{

    constructor() {
        super('./txt/productos.txt')
    }

    async save(object: Product): Promise<string> {
        let objects:any = await this.readFile();
        if (!object.id) {
            const id =
                objects.length === 0 ? 1 : objects[objects.length - 1].id + 1;
            objects.push({ ...object, id });
            await this.writeFile(objects);
            return `se agregó un producto con el id ${id}`;
        } else {
            let objectIndex: number | undefined;
            objects.forEach((x: Product, i: number) => x.id === object.id && (objectIndex = i));
            if (objectIndex) {
                Object.assign(objects[objectIndex], object);
                await this.writeFile(objects);
                return `se actualizó el producto con el id ${object.id}`;
            } else {
                return `no se encontró un producto con el id ${object.id}`;
            }
        }
    }

    async getById(number: number): Promise<Product | null> {
        let object:any = await this.readFile();
        object = object.filter((x:Product) => x.id === number)[0];
        if (object) {
            return object;
        } else {
            return null;
        }
    }

    async getAll(): Promise<Product|string> {
        const objects: any = await this.readFile();
        if (objects.length > 0) {
            return objects;
        } else {
            return 'no se han encontrado productos';
        }
    }

    async deleteById(number: number): Promise<void> {
        let objects:any = await this.readFile();
        objects = objects.filter((x:Product) => x.id !== number);
        await this.writeFile(objects);
    }
}
