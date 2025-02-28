import { Inject, Injectable } from '@nestjs/common';
import { FirebaseProvider } from '../../../providers/firebase.provider';
import { Generation } from '../entities/generation.entity';
import { GeneratedImage } from '../entities/generated-image.entities';
import { GenerationConverter } from '../converters/generation.converter';
import { UsersService } from '../../users/users.service';
import { LocationsService } from '../../locations/locations.service';

@Injectable()
export class GenerationsService {
  static readonly collection : string = 'generations';
  constructor(@Inject(FirebaseProvider) private readonly firestoreProvider: FirebaseProvider, private generationConverter: GenerationConverter, @Inject(UsersService) private readonly userService: UsersService) {}

  async findOne(id: string, userId : string, locationId : string) : Promise<Generation | undefined> {
    const generation = await this.firestoreProvider.getFirestore().collection(UsersService.collection).doc(userId).collection(LocationsService.collection).doc(locationId).collection(GenerationsService.collection).doc(id).withConverter(this.generationConverter).get();
    if (!generation.exists) {
      return undefined;
    }
    return this.generationConverter.fromFirestoreDocumentSnapshot(generation);
  }

  async create(generatedImage: GeneratedImage | null, userId: string, locationId : string, prompt : string) : Promise<Generation> {
    const id = this.firestoreProvider.getFirestore().collection(UsersService.collection).doc(userId).collection(LocationsService.collection).doc(locationId).collection(GenerationsService.collection).doc().id;
    const generation = new Generation(id, generatedImage, 0, prompt);
    const generationRef = await this.firestoreProvider.getFirestore().collection(UsersService.collection).doc(userId).collection(LocationsService.collection).doc(locationId).collection(GenerationsService.collection).doc(generation.id).withConverter(this.generationConverter).set(generation);
    return generation;
  }

  async update(generation: Generation, userId: string, locationId : string, progress: number) : Promise<Generation> {
    generation.progress = progress;
    const generationRef = await this.firestoreProvider.getFirestore().collection(UsersService.collection).doc(userId).collection(LocationsService.collection).doc(locationId).collection(GenerationsService.collection).doc(generation.id).withConverter(this.generationConverter).set(generation);
    return generation;
  }
}
