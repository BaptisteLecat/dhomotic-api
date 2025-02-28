import { Inject, Injectable } from '@nestjs/common';
import { FirebaseAuthService } from '../../services/firebase.auth.service';
import { AuthUser } from './entity/auth-user.entity';

@Injectable()
export class AuthService {

    constructor(@Inject(FirebaseAuthService) private readonly firebaseAuthService: FirebaseAuthService) { }

    validateApiKey(apiKey: string): boolean {
        return apiKey === process.env.API_KEY;
    }

    async verifyIdToken(idToken: string): Promise<string> {
        return await this.firebaseAuthService.verifyIdToken(idToken);
    }

    async authUserFromToken(payload : any): Promise<AuthUser> {
        const id = await this.verifyIdToken(payload);
        const firebaseUser = await this.firebaseAuthService.getUser(id);
        if(!firebaseUser) {
            throw new Error('User not found');
        }
        return AuthUser.fromFirebaseUser(firebaseUser);
    }

    async getFirebaseUser(id: string): Promise<any> {
        return await this.firebaseAuthService.getUser(id);
    }

    async userEmailExists(email: string): Promise<boolean> {
        return await this.firebaseAuthService.userEmailExists(email);
    }

    async userExists(id: string): Promise<boolean> {
        return await this.firebaseAuthService.userExists(id);
    }
}
