class Contenedor {
    constructor(productList) {
        this.productList = productList;
    }

    save(object) {
        const id =
            this.productList.length === 0
                ? 1
                : this.productList[this.productList.length - 1].id + 1;
        if (object.id) {
            let objectIndex;
            this.productList.forEach(
                (x, i) => x.id === object.id && (objectIndex = i)
            );
            this.productList[objectIndex] = object;
            console.log(`se actualizó el producto con el id ${object.id}`);
            return object.id;
        } else {
            this.productList.unshift({ ...object, id: id });
            console.log(`se agregó un producto con el id ${id}`);
            return id;
        }
    }

    getById(number) {
        const object = this.productList.filter((x) => x.id === number)[0];
        if (object) {
            console.log('producto con id 2: \n', object);
            return object;
        } else {
            console.log(`no se ha encontrado un producto con el id ${number}`);
            return null;
        }
    }

    getAll() {
        if (this.productList.length > 0) {
            return this.productList;
        } else {
            console.log('no se han encontrado productos');
            return [];
        }
    }

    deleteById(number) {
        this.productList = this.productList.filter((x) => x.id !== number);
        console.log(`producto con id ${number} eliminado`);
    }

    deleteAll() {
        this.productList = [];
    }
}

module.exports = Contenedor;
