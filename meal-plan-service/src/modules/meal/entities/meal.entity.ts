import {MealProductItem} from "./mealProductItem.entity";

export class Meal {
    id: string;
    name: string;
    description: string;
    mealProductItem: MealProductItem[];

    public constructor(
        id: string,
        name: string,
        description: string,
        mealProductItem: MealProductItem[],
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.mealProductItem = mealProductItem;
    }

    static fromFirestoreDocument(id: any, data: any): Meal {
        return new Meal(
            id,
            data.name,
            data.description,
            data.mealProductItem.map((mealProductItem) =>
                MealProductItem.fromFirestoreDocument(
                    mealProductItem.id,
                    mealProductItem,
                ),
            ),
        );
    }

    static fromJson(data: any): Meal {
        return new Meal(
            data.id,
            data.name,
            data.description,
            data.mealProductItem.map((mealProductItem) =>
                MealProductItem.fromJson(mealProductItem),
            ),
        );
    }

    toFirestoreDocument(): any {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            mealProductItem: this.mealProductItem.map((mealProductItem) =>
                mealProductItem.toFirestoreDocument(),
            ),
        };
    }

    toJson(): any {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            mealProductItem: this.mealProductItem.map((mealProductItem) =>
                mealProductItem.toJson(),
            ),
        };
    }
}
