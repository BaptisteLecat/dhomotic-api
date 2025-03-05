import {Test, TestingModule} from '@nestjs/testing';
import {MealService} from './meal.service';
import {FirebaseProvider} from '../../../providers/firebase.provider';

// Import et initialisation du mock officiel pour @google-cloud/firestore
const {mockGoogleCloudFirestore} = require('firestore-jest-mock');
mockGoogleCloudFirestore({
    database: {
        meals: [
            {
                id: 'mealId',
                name: 'mealName',
                description: 'mealDescription',
                mealProductItem: [
                    {
                        id: 'productItemId',
                        name: 'productItemName',
                    },
                ],
            },
        ],
        productItems: [
            {
                id: 'productItemId',
                name: 'productItemName',
                price: 100,
            },
        ],
    },
}, {
    // Très important : https://www.npmjs.com/package/firestore-jest-mock#mutable
    mutable: true,
});

// Import optionnel pour vérifier les appels sur les collections
const {mockCollection} = require('firestore-jest-mock/mocks/firestore');

import {Firestore} from '@google-cloud/firestore';
import {MealConverter} from "../converters/meal.converter";
import {Meal} from "../entities/meal.entity";
import {MealModule} from "../meal.module";
import {ConfigModule} from "@nestjs/config";

describe('MealService', () => {
    let service: MealService;
    let firestore: Firestore;

    beforeAll(async () => {
        // Création d'une instance Firestore (elle sera mockée grâce à firestore-jest-mock)
        firestore = new Firestore();

        const module: TestingModule = await Test.createTestingModule({
            imports: [MealModule, ConfigModule.forRoot({
                isGlobal: true,
            })],
            providers: [
                {
                    provide: FirebaseProvider,
                    useValue: {getFirestore: () => firestore},
                },
            ],
        }).compile();

        service = module.get<MealService>(MealService);
    });

    afterEach(() => {
        // Réinitialise-les mocks entre chaque test
        jest.clearAllMocks();
    });

    it('should find all meals', async () => {
        // La donnée est déjà préchargée dans le mock via mockGoogleCloudFirestore
        const meals = await service.findAll();
        expect(meals).toBeInstanceOf(Array);
        expect(meals.length).toBe(1);
        expect(meals[0]).toBeInstanceOf(Meal);

        // Vérification optionnelle de l'appel à la collection "meals"
        expect(mockCollection).toHaveBeenCalledWith('meals');
    });

    it('should find one meal', async () => {
        const meal = await service.findOne('mealId');
        expect(meal).toBeInstanceOf(Meal);

        // Vérification optionnelle de l'appel à la collection "meals"
        expect(mockCollection).toHaveBeenCalledWith('meals');
    });
});
