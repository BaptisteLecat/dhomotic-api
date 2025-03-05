import {Module} from '@nestjs/common';
import {MealService} from "./services/meal.service";
import {FirebaseProvider} from "../../providers/firebase.provider";
import {MealConverter} from "./converters/meal.converter";
import {Meal} from "./entities/meal.entity";
import {MealProductItemConverter} from "./converters/mealProductItem.converter";

@Module({
    providers: [FirebaseProvider, MealService, MealConverter, MealProductItemConverter],
    exports: [MealService, MealConverter, MealProductItemConverter]
})
export class MealModule {
}