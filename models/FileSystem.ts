import fs from 'fs';
import { Cart } from './Cart';
import { Product } from './Product';

export default class FileSystem {
    
    fileName: string;

    constructor(fileName:string){
        this.fileName = fileName;
    }

    async readFile(): Promise<Array<Cart>|Array<Product>|Array<void>>{
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

    async writeFile(object: Array<Cart>|Array<Cart>|Array<void>): Promise<void> {
        try {
            await fs.promises.writeFile(this.fileName, JSON.stringify(object));
        } catch (err) {
            console.log(err);
        }
    }
}