import {Module} from '@nestjs/common';
import {WeekPlanController} from './controllers/weekplan.controller';
import {WeekplanConverter} from "./converters/weekplan.converter";
import {WeekplanService} from "./services/weekplan.service";
import {UserModule} from "../user/user.module";
import {ProductItemModule} from "../productItem/productItem.module";
import {FirebaseProvider} from "../../providers/firebase.provider";
import {MealModule} from "../meal/meal.module";
import {MenuMealConverter} from "./converters/menuMeal.converter";
import {MenuConverter} from "./converters/menu.converter";
import {CartProductItemConverter} from "./converters/cartProductItem.converter";
import {CartProductConverter} from "./converters/cartProduct.converter";

@Module({
    controllers: [WeekPlanController],
    providers: [FirebaseProvider, WeekplanService, WeekplanConverter, MenuMealConverter, MenuConverter, CartProductItemConverter, CartProductConverter],
    imports: [UserModule, ProductItemModule, MealModule],
    exports: [WeekplanService, WeekplanConverter, MenuMealConverter, MenuConverter, CartProductItemConverter, CartProductConverter]
})
export class WeekplanModule {
}