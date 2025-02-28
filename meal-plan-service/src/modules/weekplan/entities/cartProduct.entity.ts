import {Timestamp} from "@google-cloud/firestore";
import {CartProductItem} from "./cartProductItem.entity";
import {CartUser} from "./cartUser.entity";

export class CartProduct {
    id: string;
    createdAt: Timestamp;
    checkedAt: Timestamp;
    quantity: number;
    user: CartUser;
    productItem: CartProductItem;

    public constructor(id: string, createdAt: Timestamp = Timestamp.now(), checkedAt: Timestamp = Timestamp.now(), quantity: number, user: CartUser, productItem: CartProductItem) {
        this.id = id;
        this.createdAt = createdAt;
        this.checkedAt = checkedAt;
        this.quantity = quantity;
        this.user = user;
        this.productItem = productItem;
    }

    static fromFirestoreDocument(id: any, data: any): CartProduct {
        return new CartProduct(id, data.createdAt, data.checkedAt, data.quantity, CartUser.fromFirestoreDocument(data.user.id, data.user), CartProductItem.fromFirestoreDocument(data.productItem.id, data.productItem));
    }

    static fromJson(data: any): CartProduct {
        return new CartProduct(data.id, data.createdAt, data.checkedAt, data.quantity, CartUser.fromJson(data.user), CartProductItem.fromJson(data.productItem));
    }

    toFirestoreDocument(): any {
        return {
            id: this.id,
            createdAt: this.createdAt,
            checkedAt: this.checkedAt,
            quantity: this.quantity,
            user: this.user.toFirestoreDocument(),
            productItem: this.productItem.toFirestoreDocument(),
        };
    }

    toJson(): any {
        return {
            id: this.id,
            createdAt: this.createdAt,
            checkedAt: this.checkedAt,
            quantity: this.quantity,
            user: this.user.toJson(),
            productItem: this.productItem.toJson(),
        };
    }
}