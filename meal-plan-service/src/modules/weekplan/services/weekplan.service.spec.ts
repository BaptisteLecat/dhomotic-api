import {Test, TestingModule} from '@nestjs/testing';
import {WeekplanService} from './weekplan.service';
import {Weekplan} from '../entities/weekplan.entity';
import {Firestore, Timestamp} from '@google-cloud/firestore';
import {CartProduct} from "../entities/cartProduct.entity";
import {UserModule} from "../../user/user.module";
import {ProductItemModule} from "../../productItem/productItem.module";
import {FirebaseProvider} from "../../../providers/firebase.provider";
import {WeekplanModule} from "../weekplan.module";
import {ConfigModule} from "@nestjs/config";
import {Menu} from "../entities/menu.entity";
import {Meal} from "../../meal/entities/meal.entity";
import {MealModule} from "../../meal/meal.module";
import {MenuMeal} from "../entities/menuMeal.entity";

// Import et initialisation du mock officiel pour @google-cloud/firestore
const {mockGoogleCloudFirestore} = require('firestore-jest-mock');
mockGoogleCloudFirestore({
    database: {
        houses: [
            {
                id: 'houseId',
                // Pour les sous-collections, on utilise la propriété __collections__
                _collections: {
                    weekplans: [
                        {
                            id: 'weekplanId',
                            startDate: Timestamp.fromDate(new Date("2025-02-24")),
                            endDate: Timestamp.fromDate(new Date("2025-03-02")),
                            createdAt: Timestamp.now(),
                            cart: [],
                            menu: [
                                {
                                    id: 'menuId0',
                                    weekDayIndex: 0,
                                    daySliceIndex: 0,
                                    createdAt: Timestamp.now(),
                                    menuMeals: [],
                                }
                            ],
                        },
                    ],
                },
            },
        ],
        users: [
            {
                id: 'userUid',
                uid: 'userUid',
                displayName: 'userDisplayName',
                email: 'useremail@gmail.com',
                emailVerified: true,
                photoURL: 'userPhotoURL',
                houseId: 'houseId',
            },
        ],
        productItems: [
            {
                id: 'productItemId',
                name: 'productItemName',
                price: 100,
            },
            {
                id: 'productItemId2',
                name: 'productItemName2',
                price: 200,
            },
        ],
        meals: [
            {
                id: 'mealId',
                name: 'mealName',
                description: 'mealDescription',
                mealProduct: [
                    {
                        id: 'mealProductId',
                        quantity: 1,
                        createdAt: Timestamp.now(),
                        mealProductItem:
                            {
                                id: 'productItemId',
                                name: 'productItemName',
                            },

                    },
                ],
            },
            {
                id: 'mealId2',
                name: 'mealName2',
                description: 'mealDescription2',
                mealProduct: [
                    {
                        id: 'mealProductId2',
                        quantity: 1,
                        createdAt: Timestamp.now(),
                        mealProductItem:
                            {
                                id: 'productItemId2',
                                name: 'productItemName2',
                            },

                    },
                ],
            },
        ],
    },
}, {
    // Très important : https://www.npmjs.com/package/firestore-jest-mock#mutable
    mutable: true,
});

// Import optionnel pour vérifier les appels sur les collections
const {mockCollection} = require('firestore-jest-mock/mocks/firestore');

describe('WeekplanService', () => {
    let service: WeekplanService;
    let firestore: Firestore;

    beforeAll(async () => {
        // Création d'une instance Firestore (elle sera mockée grâce à firestore-jest-mock)
        firestore = new Firestore();

        const module: TestingModule = await Test.createTestingModule({
            imports: [MealModule, WeekplanModule, UserModule, ProductItemModule, ConfigModule.forRoot({
                isGlobal: true,
            }),],
            providers: [
                {
                    provide: FirebaseProvider,
                    useValue: {getFirestore: () => firestore},
                },
            ],
        }).compile();

        service = module.get<WeekplanService>(WeekplanService);
    });

    afterEach(() => {
        // Réinitialise les mocks entre chaque test
        jest.clearAllMocks();
    });

    it('should find all weekplans', async () => {
        // La donnée est déjà préchargée dans le mock via mockGoogleCloudFirestore
        const weekplans = await service.findAll('houseId');
        -
            expect(weekplans).toBeInstanceOf(Array);
        expect(weekplans.length).toBe(1);
        expect(weekplans[0]).toBeInstanceOf(Weekplan);

        // Vérification optionnelle de l'appel à la collection "weekplans"
        expect(mockCollection).toHaveBeenCalledWith('weekplans');
    });

    it('should find one weekplan', async () => {
        const weekplan = await service.findOne('weekplanId', 'houseId');
        expect(weekplan).toBeInstanceOf(Weekplan);

        // Vérification optionnelle de l'appel à la collection "weekplans"
        expect(mockCollection).toHaveBeenCalledWith('weekplans');
    });

    it('should create a weekplan', async () => {
        const weekplan = await service.create({
            startDate: new Date("2025-03-31").toISOString(),
            endDate: new Date("2025-04-06").toISOString()
        }, 'houseId');
        expect(weekplan).toBeInstanceOf(Weekplan);

        // Vérification optionnelle de l'appel à la collection "weekplans"
        expect(mockCollection).toHaveBeenCalledWith('weekplans');

        const updatedWeekplan = await service.findOne(weekplan.id, 'houseId');
        expect(updatedWeekplan.menu).toHaveLength(21);
        expect(updatedWeekplan.menu[0]).toMatchObject({
            weekDayIndex: 0,
            daySliceIndex: 0,
        });
        expect(updatedWeekplan.menu[2]).toMatchObject({
            weekDayIndex: 0,
            daySliceIndex: 2,
        });
        expect(updatedWeekplan.menu[20]).toMatchObject({
            weekDayIndex: 6,
            daySliceIndex: 2,
        });
    });

    describe('CartProduct', () => {
        describe('Add or Update cart product:', () => {

            it('should add a new cart product', async () => {
                const cartProduct = await service.addOrUpdateCartProduct('weekplanId', 'houseId', {
                    userId: 'userUid',
                    productItemId: 'productItemId',
                    quantity: 1,
                });
                expect(cartProduct).toBeInstanceOf(CartProduct);

                // Vérification de l'effet final : le weekplan récupéré doit contenir le nouveau cartProduct.
                const updatedWeekplan = await service.findOne('weekplanId', 'houseId');
                expect(updatedWeekplan.cart).toHaveLength(1);
                expect(updatedWeekplan.cart[0]).toMatchObject({
                    id: 'productItemId',
                    quantity: 1,
                });
            });

            it('should update the quantity of an existing cart product', async () => {
                // Ajout d'un produit au panier
                await service.addOrUpdateCartProduct('weekplanId', 'houseId', {
                    userId: 'userUid',
                    productItemId: 'productItemId',
                    quantity: 1,
                });

                // Mise à jour de la quantité du produit
                const cartProduct = await service.addOrUpdateCartProduct('weekplanId', 'houseId', {
                    userId: 'userUid',
                    productItemId: 'productItemId',
                    quantity: 2,
                });

                expect(cartProduct).toBeInstanceOf(CartProduct);

                // Vérification de l'effet final : le weekplan récupéré doit contenir le cartProduct mis à jour.
                const updatedWeekplan = await service.findOne('weekplanId', 'houseId');
                expect(updatedWeekplan.cart).toHaveLength(1);
                expect(updatedWeekplan.cart[0]).toMatchObject({
                    id: 'productItemId',
                    quantity: 2,
                });
            });

            it('should throw an error if the user does not exist', async () => {
                await expect(service.addOrUpdateCartProduct('weekplanId', 'houseId', {
                    userId: 'unknownUserId',
                    productItemId: 'productItemId',
                    quantity: 1,
                })).rejects.toThrowError('User with id unknownUserId not found');
            });

            it('should throw an error if the productItem does not exist', async () => {
                await expect(service.addOrUpdateCartProduct('weekplanId', 'houseId', {
                    userId: 'userUid',
                    productItemId: 'unknownProductItemId',
                    quantity: 1,
                })).rejects.toThrowError('ProductItem with id unknownProductItemId not found');
            });

        });

        it('should remove a cart product', async () => {
            // Ajout d'un produit au panier
            await service.addOrUpdateCartProduct('weekplanId', 'houseId', {
                userId: 'userUid',
                productItemId: 'productItemId',
                quantity: 1,
            });

            // Suppression du produit du panier
            await service.removeCartProduct('weekplanId', 'houseId', 'productItemId');

            // Vérification de l'effet final : le weekplan récupéré doit être vide.
            const updatedWeekplan = await service.findOne('weekplanId', 'houseId');
            expect(updatedWeekplan.cart).toHaveLength(0);

        });
    });

    describe('Menu', () => {
        describe('Add MenuMeal in the menu:', () => {

            it('should add a new MenuMeal', async () => {
                const menuMeal = await service.createMenuMeal("menuId0", 'weekplanId', 'houseId', {
                    userId: 'userUid',
                    mealId: 'mealId',
                });
                expect(menuMeal).toBeInstanceOf(MenuMeal);

                // Vérification de l'effet final : le weekplan récupéré doit contenir le nouveau cartProduct.
                const updatedWeekplan = await service.findOne('weekplanId', 'houseId');
                expect(updatedWeekplan.menu[0].menuMeals).toHaveLength(1);
                expect(updatedWeekplan.menu[0].menuMeals[0]).toMatchObject({
                    meal: {
                        id: 'mealId',
                        name: "mealName",
                    }
                });
            });

            it('should throw an error if the weekplan does not exist', async () => {
                await expect(service.createMenuMeal('menuId0', 'unknownWeekplanId', 'houseId', {
                    userId: 'userUid',
                    mealId: 'mealId',
                })).rejects.toThrowError('Weekplan with id unknownWeekplanId not found');
            });

            it('should throw an error if the user does not exist', async () => {
                await expect(service.createMenuMeal('menuId0', 'weekplanId', 'houseId', {
                    userId: 'unknownUserId',
                    mealId: 'mealId',
                })).rejects.toThrowError('User with id unknownUserId not found');
            });

            it('should throw an error if the menu does not exist', async () => {
                await expect(service.createMenuMeal('unknownMenuId', 'weekplanId', 'houseId', {
                    userId: 'userUid',
                    mealId: 'mealId',
                })).rejects.toThrowError('Menu with id unknownMenuId not found in the weekplan with id weekplanId');
            });

            it('should throw an error if the Meal already exist in the menu', async () => {
                // Ajout du même MenuMeal
                await expect(service.createMenuMeal('menuId0', 'weekplanId', 'houseId', {
                    userId: 'userUid',
                    mealId: 'mealId',
                })).rejects.toThrowError('Meal with id mealId already exist in the menu with id menuId0');
            });

            it('should throw an error if the Meal does not exist', async () => {
                await expect(service.createMenuMeal('menuId0', 'weekplanId', 'houseId', {
                    userId: 'userUid',
                    mealId: 'unknownMealId',
                })).rejects.toThrowError('Meal with id unknownMealId not found');
            });

            it('should remove a MenuMeal', async () => {
                // Ajout d'un MenuMeal
                const menuMeal = await service.createMenuMeal("menuId0", 'weekplanId', 'houseId', {
                    userId: 'userUid',
                    mealId: 'mealId2',
                });

                // Suppression du MenuMeal
                await service.removeMenuMeal(menuMeal.id, 'menuId0', 'weekplanId', 'houseId');

                // Vérification de l'effet final : le weekplan récupéré doit être vide.
                const updatedWeekplan = await service.findOne('weekplanId', 'houseId');
                expect(updatedWeekplan.menu[0].menuMeals).toHaveLength(1);
                expect(updatedWeekplan.menu[0].menuMeals[0]).toMatchObject({
                    meal: {
                        id: 'mealId',
                        name: "mealName",
                    }
                });
            });
        });
    });

});
