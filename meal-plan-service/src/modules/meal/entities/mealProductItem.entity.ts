export class MealProductItem {
    id: string;
    name: string;

    public constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    static fromFirestoreDocument(id: any, data: any): MealProductItem {
        return new MealProductItem(id, data.name);
    }

    static fromJson(data: any): MealProductItem {
        return new MealProductItem(data.id, data.name);
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