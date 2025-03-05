import {Inject, Injectable} from '@nestjs/common';
import {FirebaseProvider} from '../../../providers/firebase.provider';
import {UserConverter} from "../converters/user.converter";
import {User} from "../entities/user.entity";

@Injectable()
export class UserService {
    static readonly collection: string = 'users';

    constructor(
        @Inject(FirebaseProvider)
        private readonly firestoreProvider: FirebaseProvider,
        private userConverter: UserConverter,
    ) {
    }

    async findAll(): Promise<User[]> {
        const users = await this.firestoreProvider
            .getFirestore()
            .collection(UserService.collection)
            .withConverter(this.userConverter)
            .get();
        return users.docs.map((weekPlan) =>
            this.userConverter.fromFirestore(weekPlan),
        );
    }

    async findOne(id: string): Promise<User | undefined> {
        const user = await this.firestoreProvider
            .getFirestore()
            .collection(UserService.collection)
            .doc(id)
            .withConverter(this.userConverter)
            .get();
        if (!user.exists) {
            return undefined;
        }
        return this.userConverter.fromFirestoreDocumentSnapshot(user);
    }
}
