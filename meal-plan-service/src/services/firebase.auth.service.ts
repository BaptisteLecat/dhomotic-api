import { Inject, Injectable } from "@nestjs/common";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { FirebaseProvider } from "../providers/firebase.provider";

@Injectable()
export class FirebaseAuthService {
    constructor(@Inject(FirebaseProvider) private readonly firebaseProvider: FirebaseProvider) { }

    async userEmailExists(email: string): Promise<boolean> {
        const user = await this.firebaseProvider.getAuth().getUserByEmail(email).catch(error => {
            return undefined;
        });
        return user !== undefined;
    }

    async userExists(id: string): Promise<boolean> {
        const user = await this.firebaseProvider.getAuth().getUser(id).catch(error => {
            return undefined;
        });
        return user !== undefined;
    }

    async verifyIdToken(idToken: string): Promise<string> {
        const decodedToken = await this.firebaseProvider.getAuth().verifyIdToken(idToken);
        return decodedToken.uid;
    }

    async getUser(id: string): Promise<UserRecord> {
        return await this.firebaseProvider.getAuth().getUser(id);
    }
}