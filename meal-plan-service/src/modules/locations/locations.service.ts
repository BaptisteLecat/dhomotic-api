import { Inject, Injectable } from '@nestjs/common';
import { FirebaseProvider } from '../../providers/firebase.provider';
import { LocationConverter } from './converters/location.converter';
import { Location } from './entities/location.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class LocationsService {
  static readonly collection : string = 'locations';
  constructor(@Inject(FirebaseProvider) private readonly firestoreProvider: FirebaseProvider, private locationConverter : LocationConverter, @Inject(UsersService) private readonly userService : UsersService) {}


  async findOne(id: string, userId : string) : Promise<Location | undefined> {
    const location = await this.firestoreProvider.getFirestore().collection(UsersService.collection).doc(userId).collection(LocationsService.collection).doc(id).withConverter(this.locationConverter).get();
    if (!location.exists) {
      return undefined;
    }
    return this.locationConverter.fromFirestoreDocumentSnapshot(location);
  }
}
