import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { FirebaseProvider } from '../../../providers/firebase.provider';

// Import et initialisation du mock officiel pour @google-cloud/firestore
const { mockGoogleCloudFirestore } = require('firestore-jest-mock');
mockGoogleCloudFirestore({
    database: {
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
    },
}, {
    // Très important : https://www.npmjs.com/package/firestore-jest-mock#mutable
    mutable: true,
});

// Import optionnel pour vérifier les appels sur les collections
const { mockCollection } = require('firestore-jest-mock/mocks/firestore');

import { Firestore } from '@google-cloud/firestore';
import {UserConverter} from "../converters/user.converter";
import {User} from "../entities/user.entity";
import {UserModule} from "../user.module";
import {ConfigModule} from "@nestjs/config";

describe('UserService', () => {
    let service: UserService;
    let firestore: Firestore;

    beforeAll(async () => {
        // Création d'une instance Firestore (elle sera mockée grâce à firestore-jest-mock)
        firestore = new Firestore();

        const module: TestingModule = await Test.createTestingModule({
            imports: [UserModule, ConfigModule.forRoot({
                isGlobal: true,
            })],
            providers: [
                {
                    provide: FirebaseProvider,
                    useValue: { getFirestore: () => firestore },
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    afterEach(() => {
        // Réinitialise-les mocks entre chaque test
        jest.clearAllMocks();
    });

    it('should find all users', async () => {
        // La donnée est déjà préchargée dans le mock via mockGoogleCloudFirestore
        const users = await service.findAll();
        expect(users).toBeInstanceOf(Array);
        expect(users.length).toBe(1);
        expect(users[0]).toBeInstanceOf(User);

        // Vérification optionnelle de l'appel à la collection "users"
        expect(mockCollection).toHaveBeenCalledWith('users');
    });

    it('should find one user', async () => {
        const user = await service.findOne('userUid');
        expect(user).toBeInstanceOf(User);

        // Vérification optionnelle de l'appel à la collection "users"
        expect(mockCollection).toHaveBeenCalledWith('users');
    });
});
