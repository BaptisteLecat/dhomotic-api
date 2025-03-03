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
                            createdAt: Timestamp.now(),
                            cart: [],
                            menu: [],
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
            imports: [WeekplanModule, UserModule, ProductItemModule, ConfigModule.forRoot({
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
        const weekplan = await service.create({}, 'houseId');
        expect(weekplan).toBeInstanceOf(Weekplan);

        // Vérification optionnelle de l'appel à la collection "weekplans"
        expect(mockCollection).toHaveBeenCalledWith('weekplans');
    });

    describe('Add cart product:', () => {

        it('should add a new cart product', async () => {
            const cartProduct = await service.addCartProduct('weekplanId', 'houseId', {
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
            await service.addCartProduct('weekplanId', 'houseId', {
                userId: 'userUid',
                productItemId: 'productItemId',
                quantity: 1,
            });

            // Mise à jour de la quantité du produit
            const cartProduct = await service.addCartProduct('weekplanId', 'houseId', {
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

    });

    it('should remove a cart product', async () => {
        // Ajout d'un produit au panier
        await service.addCartProduct('weekplanId', 'houseId', {
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
