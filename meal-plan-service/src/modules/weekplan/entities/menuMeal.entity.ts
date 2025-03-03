import {Timestamp} from '@google-cloud/firestore';
import {MealProductItem} from './mealProductItem.entity';

export class MenuMeal {
    id: string;
    createdAt: Timestamp;
    name: string;
    description: string;
    mealProductItem: MealProductItem[];

    public constructor(
        id: string,
        createdAt: Timestamp = Timestamp.now(),
        name: string,
        description: string,
        mealProductItem: MealProductItem[] = [],
    ) {
        this.id = id;
        this.createdAt = createdAt;
        this.name = name;
        this.description = description;
        this.mealProductItem = mealProductItem;
    }

    static fromFirestoreDocument(id: any, data: any): MenuMeal {
        return new MenuMeal(
            id,
            data.createdAt,
            data.name,
            data.description,
            data.ingredients.map((mealProductItem) =>
                MealProductItem.fromFirestoreDocument(
                    mealProductItem.id,
                    mealProductItem,
                ),
            ),
        );
    }

    static fromJson(data: any): MenuMeal {
        return new MenuMeal(
            data.id,
            data.createdAt,
            data.name,
            data.description,
            data.ingredients.map((mealProductItem) =>
                MealProductItem.fromJson(mealProductItem),
            ),
        );
    }

    toFirestoreDocument(): any {
        return {
            id: this.id,
            createdAt: this.createdAt,
            name: this.name,
            description: this.description,
            ingredients: this.mealProductItem.map((mealProductItem) =>
                mealProductItem.toFirestoreDocument(),
            ),
        };
    }

    toJson(): any {
        return {
            id: this.id,
            createdAt: this.createdAt,
            name: this.name,
            description: this.description,
            ingredients: this.mealProductItem.map((mealProductItem) =>
                mealProductItem.toJson(),
            ),
        };
    }
}
