import {Timestamp} from "@google-cloud/firestore";
import {CartProductItem} from "./cartProductItem.entity";
import {CartUser} from "./cartUser.entity";

export class CartProduct {
    id: string;
    quantity: number;
    cartUser: CartUser;
    cartProductItem: CartProductItem;
    checkedAt?: Timestamp;
    createdAt: Timestamp;

    public constructor(id: string, quantity: number, cartUser: CartUser, cartProductItem: CartProductItem, checkedAt?: Timestamp, createdAt: Timestamp = Timestamp.now()) {
        this.id = id;
        this.quantity = quantity;
        this.cartUser = cartUser;
        this.cartProductItem = cartProductItem;
        this.checkedAt = checkedAt;
        this.createdAt = createdAt;
    }

    static fromFirestoreDocument(id: any, data: any): CartProduct {
        return new CartProduct(id, data.quantity, CartUser.fromFirestoreDocument(data.cartUser.id, data.cartUser), CartProductItem.fromFirestoreDocument(data.cartProductItem.id, data.cartProductItem), data.checkedAt, data.createdAt);
    }

    static fromJson(data: any): CartProduct {
        return new CartProduct(data.id, data.quantity, CartUser.fromJson(data.cartUser), CartProductItem.fromJson(data.cartProductItem), data.checkedAt, data.createdAt);
    }

    toFirestoreDocument(): any {
        return {
            id: this.id,
            quantity: this.quantity,
            cartUser: this.cartUser.toFirestoreDocument(),
            cartProductItem: this.cartProductItem.toFirestoreDocument(),
            checkedAt: this.checkedAt,
            createdAt: this.createdAt,
        };
    }

    toJson(): any {
        return {
            id: this.id,
            quantity: this.quantity,
            cartUser: this.cartUser.toJson(),
            cartProductItem: this.cartProductItem.toJson(),
            checkedAt: this.checkedAt,
            createdAt: this.createdAt,
        };
    }
}