export class CartUser {
    id: string;
    displayName: string;
    email: string;
    photoURL: string;

    public constructor(
        id: string,
        displayName: string,
        email: string,
        photoURL: string,
    ) {
        this.id = id;
        this.displayName = displayName;
        this.email = email;
        this.photoURL = photoURL;
    }

    static fromFirestoreDocument(id: any, data: any): CartUser {
        return new CartUser(
            id,
            data.displayName,
            data.email,
            data.photoURL,
        );
    }

    static fromJson(data: any): CartUser {
        return new CartUser(
            data.id,
            data.displayName,
            data.email,
            data.photoURL,
        );
    }

    toFirestoreDocument(): any {
        return {
            id: this.id,
            displayName: this.displayName,
            email: this.email,
            photoURL: this.photoURL,
        };
    }

    toJson(): any {
        return {
            id: this.id,
            displayName: this.displayName,
            email: this.email,
            photoURL: this.photoURL,
        };
    }
}
