import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiKeyStrategy } from './strategy/apikey.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { FirebaseAuthService } from '../../services/firebase.auth.service';
import { FirebaseProvider } from '../../providers/firebase.provider';

@Module({
    imports: [PassportModule, PassportModule.register({ property: 'user' })],
    providers: [AuthService, ApiKeyStrategy, JwtStrategy, FirebaseAuthService, FirebaseProvider],
    exports: [AuthService]
})
export class AuthModule {

}
