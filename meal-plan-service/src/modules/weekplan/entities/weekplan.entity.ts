import {Timestamp} from "@google-cloud/firestore";
import {CartProduct} from "./cartProduct.entity";
import {Menu} from "./menu.entity";

export class Weekplan {
    id: string;
    startDate: string | Timestamp
    endDate: string | Timestamp;
    createdAt: Timestamp;
    cart: CartProduct[];
    menu: Menu[];

    public constructor(id: string, startDate: string | Timestamp, endDate: string | Timestamp, createdAt: Timestamp = Timestamp.now(), cart: CartProduct[] = [], menu: Menu[] = []) {
        this.id = id;
        //start date can be given like this : '2025-02-24T00:00:00.000Z' but we need to convert it to Timestamp
        this.startDate = startDate instanceof Timestamp
            ? startDate
            : Timestamp.fromDate(new Date(startDate));

        this.endDate = endDate instanceof Timestamp
            ? endDate
            : Timestamp.fromDate(new Date(endDate));
        this.createdAt = createdAt;
        this.cart = cart;
        this.menu = menu;
    }

    get startDateTimestamp(): Timestamp {
        return this.startDate as Timestamp;
    }

    get endDateTimestamp(): Timestamp {
        return this.endDate as Timestamp;
    }

    static fromFirestoreDocument(id: any, data: any): Weekplan {
        return new Weekplan(id, data.startDate, data.endDate, data.createdAt, data.cart.map((cartProduct) => CartProduct.fromFirestoreDocument(cartProduct.id, cartProduct)), data.menu.map((menu) => Menu.fromFirestoreDocument(menu.id, menu)));
    }

    static fromJson(data: any): Weekplan {
        return new Weekplan(data.id, data.startDate, data.endDate, data.createdAt, data.cart.map((cartProduct) => CartProduct.fromJson(cartProduct)), data.menu.map((menu) => Menu.fromJson(menu)));
    }

    toFirestoreDocument(): any {
        return {
            id: this.id,
            startDate: this.startDate,
            endDate: this.endDate,
            createdAt: this.createdAt,
            cart: this.cart.map((cartProduct) => cartProduct.toFirestoreDocument()),
            menu: this.menu.map((menu) => menu.toFirestoreDocument()),
        };
    }

    toJson(): any {
        return {
            id: this.id,
            startDate: this.startDate,
            endDate: this.endDate,
            createdAt: this.createdAt,
            cart: this.cart.map((cartProduct) => cartProduct.toJson()),
            menu: this.menu.map((menu) => menu.toJson()),
        };
    }
}