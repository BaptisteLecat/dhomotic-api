export class CartProductItem {
    id: string;
    name: string;
    price: number;

    public constructor(id: string, name: string, price: number) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    static fromFirestoreDocument(id: any, data: any): CartProductItem {
        return new CartProductItem(id, data.name, data.price);
    }

    static fromJson(data: any): CartProductItem {
        return new CartProductItem(data.id, data.name, data.price);
    }

    toFirestoreDocument(): any {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
        };
    }

    toJson(): any {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
        };
    }
}