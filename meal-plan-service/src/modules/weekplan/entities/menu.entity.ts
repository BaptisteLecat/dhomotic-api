import {Timestamp} from '@google-cloud/firestore';
import {MenuMeal} from "./menuMeal.entity";

export class Menu {
    id: string;
    weekDayIndex: number;
    daySliceIndex: number;
    createdAt: Timestamp;
    menuMeals: MenuMeal[];

    public constructor(
        id: string,
        weekDayIndex: number,
        daySliceIndex: number,
        createdAt: Timestamp = Timestamp.now(),
        menuMeals: MenuMeal[] = [],
    ) {
        this.id = id;
        this.weekDayIndex = weekDayIndex;
        this.daySliceIndex = daySliceIndex;
        this.createdAt = createdAt;
        this.menuMeals = menuMeals;
    }

    static fromFirestoreDocument(id: any, data: any): Menu {
        return new Menu(
            id,
            data.weekDayIndex,
            data.daySliceIndex,
            data.createdAt,
            data.menuMeals.map((menuMeal) =>
                MenuMeal.fromFirestoreDocument(menuMeal.id, menuMeal),
            ),
        );
    }

    static fromJson(data: any): Menu {
        return new Menu(
            data.id,
            data.weekDayIndex,
            data.daySliceIndex,
            data.createdAt,
            data.menuMeals.map((menuMeal) =>
                MenuMeal.fromJson(menuMeal),
            ),
        );
    }

    toFirestoreDocument(): any {
        return {
            id: this.id,
            createdAt: this.createdAt,
            weekDayIndex: this.weekDayIndex,
            daySliceIndex: this.daySliceIndex,
            menuMeals: this.menuMeals.map((menuMeal) =>
                menuMeal.toFirestoreDocument(),
            ),
        };
    }

    toJson(): any {
        return {
            id: this.id,
            weekDayIndex: this.weekDayIndex,
            daySliceIndex: this.daySliceIndex,
            createdAt: this.createdAt,
            menuMeals: this.menuMeals.map((menuMeal) =>
                menuMeal.toJson(),
            ),
        };
    }
}
