import {Timestamp} from "@google-cloud/firestore";
import {CartProduct} from "./cartProduct.entity";
import {Meal} from "./meal.entity";

export class Weekplan {
    id: string;
    createdAt: Timestamp;
    cart: CartProduct[];
    menu: Meal[];

    public constructor(id: string, createdAt: Timestamp = Timestamp.now(), cart: CartProduct[] = [], menu: Meal[] = []) {
        this.id = id;
        this.createdAt = createdAt;
        this.cart = cart;
        this.menu = menu;
    }

    static fromFirestoreDocument(id: any, data: any): Weekplan {
        return new Weekplan(id, data.createdAt, data.cart.map((cartProduct) => CartProduct.fromFirestoreDocument(cartProduct.id, cartProduct)), data.menu.map((meal) => Meal.fromFirestoreDocument(meal.id, meal)));
    }

    static fromJson(data: any): Weekplan {
        return new Weekplan(data.id, data.createdAt, data.cart.map((cartProduct) => CartProduct.fromJson(cartProduct)), data.menu.map((meal) => Meal.fromJson(meal)));
    }

    toFirestoreDocument(): any {
        return {
            id: this.id,
            createdAt: this.createdAt,
            cart: this.cart.map((cartProduct) => cartProduct.toFirestoreDocument()),
            menu: this.menu.map((meal) => meal.toFirestoreDocument()),
        };
    }

    toJson(): any {
        return {
            id: this.id,
            createdAt: this.createdAt,
            cart: this.cart.map((cartProduct) => cartProduct.toJson()),
            menu: this.menu.map((meal) => meal.toJson()),
        };
    }
}