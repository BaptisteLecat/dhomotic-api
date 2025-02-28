export class CartProductItem {
    id: string;
    name: string;

    public constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    static fromFirestoreDocument(id: any, data: any): CartProductItem {
        return new CartProductItem(id, data.name);
    }

    static fromJson(data: any): CartProductItem {
        return new CartProductItem(data.id, data.name);
    }

    toFirestoreDocument(): any {
        return {
            id: this.id,
            name: this.name,
        };
    }

    toJson(): any {
        return {
            id: this.id,
            name: this.name,
        };
    }
}