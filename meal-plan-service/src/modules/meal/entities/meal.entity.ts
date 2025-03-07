import {MealProduct} from "./mealProduct.entity";

export class Meal {
    id: string;
    name: string;
    description: string;
    mealProduct: MealProduct[];

    public constructor(
        id: string,
        name: string,
        description: string,
        mealProduct: MealProduct[],
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.mealProduct = mealProduct;
    }

    static fromFirestoreDocument(id: any, data: any): Meal {
        return new Meal(
            id,
            data.name,
            data.description,
            data.mealProduct.map((mealProduct) =>
                MealProduct.fromFirestoreDocument(
                    mealProduct.id,
                    mealProduct,
                ),
            ),
        );
    }

    static fromJson(data: any): Meal {
        return new Meal(
            data.id,
            data.name,
            data.description,
            data.mealProduct.map((mealProduct) =>
                MealProduct.fromJson(mealProduct),
            ),
        );
    }

    toFirestoreDocument(): any {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            mealProduct: this.mealProduct.map((mealProduct) =>
                mealProduct.toFirestoreDocument(),
            ),
        };
    }

    toJson(): any {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            mealProduct: this.mealProduct.map((mealProduct) =>
                mealProduct.toJson(),
            ),
        };
    }
}
