import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {FirebaseProvider} from './providers/firebase.provider';
import {AuthService} from './modules/auth/services/auth.service';
import {AuthModule} from './modules/auth/auth.module';
import {FirebaseAuthService} from './modules/auth/services/firebase.auth.service';
import {WeekplanModule} from './modules/weekplan/weekplan.module';
import {UserModule} from "./modules/user/user.module";
import {ProductItemModule} from "./modules/productItem/productItem.module";


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env'
        }),
        AuthModule,
        WeekplanModule,
        UserModule,
        ProductItemModule
    ],
    controllers: [],
    providers: [FirebaseProvider, AuthService, FirebaseAuthService],
})
export class AppModule {
}
