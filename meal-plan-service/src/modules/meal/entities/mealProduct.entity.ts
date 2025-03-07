import {Timestamp} from "@google-cloud/firestore";
import {MealProductItem} from "./mealProductItem.entity";

export class MealProduct {
    id: string;
    quantity: number;
    mealProductItem: MealProductItem;
    createdAt: Timestamp;

    public constructor(id: string, quantity: number, mealProductItem: MealProductItem, createdAt: Timestamp = Timestamp.now()) {
        this.id = id;
        this.quantity = quantity;
        this.mealProductItem = mealProductItem;
        this.createdAt = createdAt;
    }

    static fromFirestoreDocument(id: any, data: any): MealProduct {
        return new MealProduct(id, data.quantity, MealProductItem.fromFirestoreDocument(data.mealProductItem.id, data.mealProductItem), data.createdAt);
    }

    static fromJson(data: any): MealProduct {
        return new MealProduct(data.id, data.quantity, MealProductItem.fromJson(data.mealProductItem), data.createdAt);
    }

    toFirestoreDocument(): any {
        return {
            id: this.id,
            quantity: this.quantity,
            mealProductItem: this.mealProductItem.toFirestoreDocument(),
            createdAt: this.createdAt,
        };
    }

    toJson(): any {
        return {
            id: this.id,
            quantity: this.quantity,
            mealProductItem: this.mealProductItem.toJson(),
            createdAt: this.createdAt,
        };
    }
}