import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {FirebaseProvider} from './providers/firebase.provider';
import {AuthService} from './modules/auth/auth.service';
import {AuthModule} from './modules/auth/auth.module';
import {FirebaseAuthService} from './services/firebase.auth.service';
import {WeekplanModule} from './modules/weekplan/weekplan.module';


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env'
        }),
        AuthModule,
        WeekplanModule,
    ],
    controllers: [],
    providers: [FirebaseProvider, AuthService, FirebaseAuthService],
})
export class AppModule {
}
