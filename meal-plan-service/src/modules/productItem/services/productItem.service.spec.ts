import {Test, TestingModule} from '@nestjs/testing';
import {ProductItemService} from './productItem.service';
import {FirebaseProvider} from '../../../providers/firebase.provider';
import {Firestore} from '@google-cloud/firestore';
import {ProductItem} from "../entities/productItem.entity";
import {ProductItemModule} from "../productItem.module";
import {ConfigModule} from "@nestjs/config";

// Import et initialisation du mock officiel pour @google-cloud/firestore
const {mockGoogleCloudFirestore} = require('firestore-jest-mock');
mockGoogleCloudFirestore({
    database: {
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

describe('ProductItemService', () => {
    let service: ProductItemService;
    let firestore: Firestore;

    beforeAll(async () => {
        // Création d'une instance Firestore (elle sera mockée grâce à firestore-jest-mock)
        firestore = new Firestore();

        const module: TestingModule = await Test.createTestingModule({
            imports: [ProductItemModule, ConfigModule.forRoot({
                isGlobal: true,
            })],
            providers: [
                {
                    provide: FirebaseProvider,
                    useValue: {getFirestore: () => firestore},
                },
            ],
        }).compile();

        service = module.get<ProductItemService>(ProductItemService);
    });

    afterEach(() => {
        // Réinitialise-les mocks entre chaque test
        jest.clearAllMocks();
    });

    it('should find all productItems', async () => {
        // La donnée est déjà préchargée dans le mock via mockGoogleCloudFirestore
        const productItems = await service.findAll();
        expect(productItems).toBeInstanceOf(Array);
        expect(productItems.length).toBe(1);
        expect(productItems[0]).toBeInstanceOf(ProductItem);

        // Vérification optionnelle de l'appel à la collection "productItems"
        expect(mockCollection).toHaveBeenCalledWith('productItems');
    });

    it('should find one productItem', async () => {
        const productItem = await service.findOne('productItemId');
        expect(productItem).toBeInstanceOf(ProductItem);

        // Vérification optionnelle de l'appel à la collection "productItems"
        expect(mockCollection).toHaveBeenCalledWith('productItems');
    });
});
