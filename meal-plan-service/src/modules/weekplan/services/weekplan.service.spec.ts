import { Test, TestingModule } from '@nestjs/testing';
import { WeekplanService } from './weekplan.service';
import { FirebaseProvider } from '../../../providers/firebase.provider';
import { WeekplanConverter } from '../converters/weekplan.converter';
import { Weekplan } from '../entities/weekplan.entity';
import { Timestamp } from '@google-cloud/firestore';

// Import et initialisation du mock officiel pour @google-cloud/firestore
const { mockGoogleCloudFirestore } = require('firestore-jest-mock');
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
    },
});

// Import optionnel pour vérifier les appels sur les collections
const { mockCollection } = require('firestore-jest-mock/mocks/firestore');

import { Firestore } from '@google-cloud/firestore';

describe('WeekplanService', () => {
    let service: WeekplanService;
    let firestore: Firestore;

    beforeEach(async () => {
        // Création d'une instance Firestore (elle sera mockée grâce à firestore-jest-mock)
        firestore = new Firestore();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WeekplanService,
                {
                    provide: FirebaseProvider,
                    useValue: { getFirestore: () => firestore },
                },
                WeekplanConverter,
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
        const weekplans = await service.findAll('houseId');-
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
});
