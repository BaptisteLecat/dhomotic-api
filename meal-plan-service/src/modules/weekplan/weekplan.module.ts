import {Module} from '@nestjs/common';
import {WeekPlanController} from './controllers/weekplan.controller';
import {WeekplanConverter} from "./converters/weekplan.converter";
import {WeekplanService} from "./services/weekplan.service";
import {UserModule} from "../user/user.module";
import {ProductItemModule} from "../productItem/productItem.module";
import {FirebaseProvider} from "../../providers/firebase.provider";

@Module({
    controllers: [WeekPlanController],
    providers: [FirebaseProvider, WeekplanService, WeekplanConverter],
    imports: [UserModule, ProductItemModule],
    exports: [WeekplanService, WeekplanConverter]
})
export class WeekplanModule {
}