import {Module} from '@nestjs/common';
import {MealService} from "./services/meal.service";
import {FirebaseProvider} from "../../providers/firebase.provider";
import {MealConverter} from "./converters/meal.converter";
import {Meal} from "./entities/meal.entity";
import {MealProductItemConverter} from "./converters/mealProductItem.converter";
import {MealProductConverter} from "./converters/mealProduct.converter";

@Module({
    providers: [FirebaseProvider, MealService, MealConverter, MealProductItemConverter, MealProductConverter],
    exports: [MealService, MealConverter, MealProductItemConverter, MealProductConverter],
})
export class MealModule {
}