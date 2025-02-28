export class AuthUser {
    id: string;
    role: string;
    disabled: boolean;

    constructor(id: string, role: string, disabled: boolean = false) {
        this.id = id;
        this.role = role;
        this.disabled = disabled;
    }

    static fromFirebaseUser(firebaseUser: any): AuthUser {
        return new AuthUser(firebaseUser.uid, "", firebaseUser.disabled);
    }

    static fromJson(json: any): AuthUser {
        return new AuthUser(json.id, json.role, json.disabled);
    }
}