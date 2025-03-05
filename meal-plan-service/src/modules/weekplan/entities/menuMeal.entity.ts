import {NestedUser} from "../../user/entities/nestedUser.entity";
import {Timestamp} from "@google-cloud/firestore";
import {Meal} from "../../meal/entities/meal.entity";

export class MenuMeal {
    id: string;
    user: NestedUser;
    meal: Meal;
    createdAt: Timestamp;

    public constructor(
        id: string,
        user: NestedUser,
        meal: Meal,
        createdAt: Timestamp = Timestamp.now(),
    ) {
        this.id = id;
        this.user = user;
        this.meal = meal;
        this.createdAt = createdAt;
    }

    static fromFirestoreDocument(id: any, data: any): MenuMeal {
        return new MenuMeal(
            id,
            NestedUser.fromFirestoreDocument(data.user.id, data.user),
            Meal.fromFirestoreDocument(data.meal.id, data.meal),
            data.createdAt,
        );
    }

    static fromJson(data: any): MenuMeal {
        return new MenuMeal(
            data.id,
            NestedUser.fromJson(data.user),
            Meal.fromJson(data.meal),
            data.createdAt,
        );
    }

    toFirestoreDocument(): any {
        return {
            id: this.id,
            user: this.user.toFirestoreDocument(),
            meal: this.meal.toFirestoreDocument(),
            createdAt: this.createdAt,
        };
    }

    toJson(): any {
        return {
            id: this.id,
            user: this.user.toJson(),
            meal: this.meal.toJson(),
            createdAt: this.createdAt,
        };
    }
}