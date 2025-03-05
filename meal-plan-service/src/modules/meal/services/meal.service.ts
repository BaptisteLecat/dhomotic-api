import {Inject, Injectable} from '@nestjs/common';
import {FirebaseProvider} from '../../../providers/firebase.provider';
import {MealConverter} from "../converters/meal.converter";
import {Meal} from "../entities/meal.entity";

@Injectable()
export class MealService {
    static readonly collection: string = 'meals';

    constructor(
        @Inject(FirebaseProvider)
        private readonly firestoreProvider: FirebaseProvider,
        private mealConverter: MealConverter,
    ) {
    }

    async findAll(): Promise<Meal[]> {
        const meals = await this.firestoreProvider
            .getFirestore()
            .collection(MealService.collection)
            .withConverter(this.mealConverter)
            .get();
        return meals.docs.map((weekPlan) =>
            this.mealConverter.fromFirestore(weekPlan),
        );
    }

    async findOne(id: string): Promise<Meal | undefined> {
        const meal = await this.firestoreProvider
            .getFirestore()
            .collection(MealService.collection)
            .doc(id)
            .withConverter(this.mealConverter)
            .get();
        if (!meal.exists) {
            return undefined;
        }
        return this.mealConverter.fromFirestoreDocumentSnapshot(meal);
    }
}
