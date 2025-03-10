import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {FirebaseProvider} from './providers/firebase.provider';
import {AuthService} from './modules/auth/services/auth.service';
import {AuthModule} from './modules/auth/auth.module';
import {FirebaseAuthService} from './modules/auth/services/firebase.auth.service';
import {WeekplanModule} from './modules/weekplan/weekplan.module';
import {UserModule} from "./modules/user/user.module";
import {ProductItemModule} from "./modules/productItem/productItem.module";
import {MealModule} from "./modules/meal/meal.module";


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        AuthModule,
        WeekplanModule,
        UserModule,
        ProductItemModule,
        MealModule
    ],
    controllers: [],
    providers: [FirebaseProvider, AuthService, FirebaseAuthService],
})
export class AppModule {
}
