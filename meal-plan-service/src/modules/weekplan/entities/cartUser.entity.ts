export class CartUser {
    id: string;
    lastname: string;
    firstname: string;
    email: string;
    photoURL: string;

    public constructor(
        id: string,
        lastname: string,
        firstname: string,
        email: string,
        photoURL: string,
    ) {
        this.id = id;
        this.lastname = lastname;
        this.firstname = firstname;
        this.email = email;
        this.photoURL = photoURL;
    }

    static fromFirestoreDocument(id: any, data: any): CartUser {
        return new CartUser(
            id,
            data.lastname,
            data.firstname,
            data.email,
            data.photoURL,
        );
    }

    static fromJson(data: any): CartUser {
        return new CartUser(
            data.id,
            data.lastname,
            data.firstname,
            data.email,
            data.photoURL,
        );
    }

    toFirestoreDocument(): any {
        return {
            id: this.id,
            lastname: this.lastname,
            firstname: this.firstname,
            email: this.email,
            photoURL: this.photoURL,
        };
    }

    toJson(): any {
        return {
            id: this.id,
            lastname: this.lastname,
            firstname: this.firstname,
            email: this.email,
            photoURL: this.photoURL,
        };
    }
}
