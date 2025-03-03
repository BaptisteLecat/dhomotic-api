import {Timestamp} from "@google-cloud/firestore";
import {CartProduct} from "./cartProduct.entity";
import {MenuMeal} from "./menuMeal.entity";

export class Weekplan {
    id: string;
    createdAt: Timestamp;
    cart: CartProduct[];
    menu: MenuMeal[];

    public constructor(id: string, createdAt: Timestamp = Timestamp.now(), cart: CartProduct[] = [], menu: MenuMeal[] = []) {
        this.id = id;
        this.createdAt = createdAt;
        this.cart = cart;
        this.menu = menu;
    }

    static fromFirestoreDocument(id: any, data: any): Weekplan {
        return new Weekplan(id, data.createdAt, data.cart.map((cartProduct) => CartProduct.fromFirestoreDocument(cartProduct.id, cartProduct)), data.menu.map((menuMeal) => MenuMeal.fromFirestoreDocument(menuMeal.id, menuMeal)));
    }

    static fromJson(data: any): Weekplan {
        return new Weekplan(data.id, data.createdAt, data.cart.map((cartProduct) => CartProduct.fromJson(cartProduct)), data.menu.map((menuMeal) => MenuMeal.fromJson(menuMeal)));
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