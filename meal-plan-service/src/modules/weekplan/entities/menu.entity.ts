import {Timestamp} from '@google-cloud/firestore';
import {MenuMeal} from "./menuMeal.entity";

export class Menu {
    id: string;
    date: Timestamp;
    daySliceIndex: number;
    createdAt: Timestamp;
    menuMeals: MenuMeal[];

    public constructor(
        id: string,
        date: string | Timestamp,
        daySliceIndex: number,
        createdAt: Timestamp = Timestamp.now(),
        menuMeals: MenuMeal[] = [],
    ) {
        this.id = id;
        //date can be given like this : '2025-02-24T00:00:00.000Z' but we need to convert it to Timestamp
        this.date = date instanceof Timestamp
            ? date
            : Timestamp.fromDate(new Date(date));
        this.daySliceIndex = daySliceIndex;
        this.createdAt = createdAt;
        this.menuMeals = menuMeals;
    }

    static fromFirestoreDocument(id: any, data: any): Menu {
        return new Menu(
            id,
            data.date,
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
            data.date,
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
            date: this.date,
            daySliceIndex: this.daySliceIndex,
            createdAt: this.createdAt,
            menuMeals: this.menuMeals.map((menuMeal) =>
                menuMeal.toFirestoreDocument(),
            ),
        };
    }

    toJson(): any {
        return {
            id: this.id,
            date: this.date,
            daySliceIndex: this.daySliceIndex,
            createdAt: this.createdAt,
            menuMeals: this.menuMeals.map((menuMeal) =>
                menuMeal.toJson(),
            ),
        };
    }
}
