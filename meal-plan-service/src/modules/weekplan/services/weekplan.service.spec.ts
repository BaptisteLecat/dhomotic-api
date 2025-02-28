import { Test, TestingModule } from '@nestjs/testing';
import { WeekplanService } from './weekplan.service';
import { FirebaseProvider } from '../../../providers/firebase.provider';
import { WeekplanConverter } from '../converters/weekplan.converter';
import { Weekplan } from '../entities/weekplan.entity';
import * as admin from 'firebase-admin';
import { initializeTestApp, loadFirestoreRules, clearFirestoreData } from '@firebase/rules-unit-testing';

describe('WeekplanService', () => {
    let service: WeekplanService;
    let firestore: admin.firestore.Firestore;

    beforeAll(async () => {
        const app = initializeTestApp({ projectId: 'test-project' });
        firestore = app.firestore();
        await loadFirestoreRules({
            projectId: 'test-project',
            rules: fs.readFileSync('firestore.rules', 'utf8'),
        });
    });

    afterEach(async () => {
        await clearFirestoreData({ projectId: 'test-project' });
    });

    afterAll(async () => {
        await app.delete();
    });

    beforeEach(async () => {
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

    it('should find all weekplans', async () => {
        const weekplans = await service.findAll('houseId');
        expect(weekplans).toBeInstanceOf(Array);
    });

    it('should find one weekplan', async () => {
        const weekplan = await service.findOne('weekplanId', 'houseId');
        expect(weekplan).toBeInstanceOf(Weekplan);
    });
});
