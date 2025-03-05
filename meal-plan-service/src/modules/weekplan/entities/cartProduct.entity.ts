import {Timestamp} from "@google-cloud/firestore";
import {CartProductItem} from "./cartProductItem.entity";
import {NestedUser} from "../../user/entities/nestedUser.entity";

export class CartProduct {
    id: string;
    quantity: number;
    user: NestedUser;
    cartProductItem: CartProductItem;
    checkedAt?: Timestamp;
    createdAt: Timestamp;

    public constructor(id: string, quantity: number, user: NestedUser, cartProductItem: CartProductItem, checkedAt?: Timestamp, createdAt: Timestamp = Timestamp.now()) {
        this.id = id;
        this.quantity = quantity;
        this.user = user;
        this.cartProductItem = cartProductItem;
        this.checkedAt = checkedAt;
        this.createdAt = createdAt;
    }

    static fromFirestoreDocument(id: any, data: any): CartProduct {
        return new CartProduct(id, data.quantity, NestedUser.fromFirestoreDocument(data.user.id, data.user), CartProductItem.fromFirestoreDocument(data.cartProductItem.id, data.cartProductItem), data.checkedAt, data.createdAt);
    }

    static fromJson(data: any): CartProduct {
        return new CartProduct(data.id, data.quantity, NestedUser.fromJson(data.user), CartProductItem.fromJson(data.cartProductItem), data.checkedAt, data.createdAt);
    }

    toFirestoreDocument(): any {
        return {
            id: this.id,
            quantity: this.quantity,
            user: this.user.toFirestoreDocument(),
            cartProductItem: this.cartProductItem.toFirestoreDocument(),
            checkedAt: this.checkedAt,
            createdAt: this.createdAt,
        };
    }

    toJson(): any {
        return {
            id: this.id,
            quantity: this.quantity,
            user: this.user.toJson(),
            cartProductItem: this.cartProductItem.toJson(),
            checkedAt: this.checkedAt,
            createdAt: this.createdAt,
        };
    }
}