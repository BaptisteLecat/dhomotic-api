import {Inject, Injectable} from '@nestjs/common';
import {WeekplanConverter} from '../converters/weekplan.converter';
import {FirebaseProvider} from '../../../providers/firebase.provider';
import {Weekplan} from '../entities/weekplan.entity';
import {CreateWeekplanDto} from "../dto/create-weekplan.dto";

@Injectable()
export class WeekplanService {
    static readonly collection: string = 'weekplans';

    constructor(
        @Inject(FirebaseProvider)
        private readonly firestoreProvider: FirebaseProvider,
        private weekPlanConverter: WeekplanConverter,
    ) {
    }

    async findAll(houseId: string): Promise<Weekplan[]> {
        const weekplans = await this.firestoreProvider
            .getFirestore()
            .collection('houses')
            .doc(houseId)
            .collection(WeekplanService.collection)
            .withConverter(this.weekPlanConverter)
            .get();
        return weekplans.docs.map((weekPlan) =>
            this.weekPlanConverter.fromFirestore(weekPlan),
        );
    }

    async findOne(id: string, houseId: string): Promise<Weekplan | undefined> {
        const weekPlan = await this.firestoreProvider
            .getFirestore()
            .collection('houses')
            .doc(houseId)
            .collection(WeekplanService.collection)
            .doc(id)
            .withConverter(this.weekPlanConverter)
            .get();
        if (!weekPlan.exists) {
            return undefined;
        }
        return this.weekPlanConverter.fromFirestoreDocumentSnapshot(weekPlan);
    }

    async create(createWeekplanDto: CreateWeekplanDto, houseId: string): Promise<Weekplan> {
        const id = this.firestoreProvider.getFirestore().collection('houses').doc(houseId).collection(WeekplanService.collection).doc().id;
        const weekPlan = new Weekplan(id);
        const weekPlanRef = await this.firestoreProvider
            .getFirestore()
            .collection('houses')
            .doc(houseId)
            .collection(WeekplanService.collection)
            .doc(id)
            .withConverter(this.weekPlanConverter)
            .set(weekPlan);
        return weekPlan;
    }
}
