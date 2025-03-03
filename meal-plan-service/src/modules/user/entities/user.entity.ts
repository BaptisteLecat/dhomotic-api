export class User {
    uid: string;
    displayName: string;
    email: string;
    emailVerified: boolean;
    photoURL: string;
    houseId: string;

    public constructor(
        uid: string,
        displayName: string,
        email: string,
        emailVerified: boolean,
        photoURL: string,
        houseId: string,
    ) {
        this.uid = uid;
        this.displayName = displayName;
        this.email = email;
        this.emailVerified = emailVerified;
        this.photoURL = photoURL;
        this.houseId = houseId;
    }

    static fromFirestoreDocument(id: any, data: any): User {
        return new User(
            id,
            data.displayName,
            data.email,
            data.emailVerified,
            data.photoURL,
            data.houseId,
        );
    }

    static fromJson(data: any): User {
        return new User(
            data.uid,
            data.displayName,
            data.email,
            data.emailVerified,
            data.photoURL,
            data.houseId,
        );
    }

    toFirestoreDocument(): any {
        return {
            uid: this.uid,
            displayName: this.displayName,
            email: this.email,
            emailVerified: this.emailVerified,
            photoURL: this.photoURL,
            houseId: this.houseId,
        };
    }

    toJson(): any {
        return {
            uid: this.uid,
            displayName: this.displayName,
            email: this.email,
            emailVerified: this.emailVerified,
            photoURL: this.photoURL,
            houseId: this.houseId,
        };
    }
}
