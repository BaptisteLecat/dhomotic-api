import { Inject, Injectable } from '@nestjs/common';
import { FirebaseProvider } from '../../providers/firebase.provider';
import { StyleConverter } from './converters/style.converter';
import { Style } from './entities/style.entity';

@Injectable()
export class StylesService {
  static readonly collection : string = 'styles';
  constructor(@Inject(FirebaseProvider) private readonly firestoreProvider: FirebaseProvider, private styleConverter: StyleConverter) {}

  async findOne(id: string) : Promise<Style | undefined> {
    const style = await this.firestoreProvider.getFirestore().collection(StylesService.collection).doc(id).withConverter(this.styleConverter).get();
    if (!style.exists) {
      return undefined;
    }
    return this.styleConverter.fromFirestoreDocumentSnapshot(style);
  }

  async findAll(id: string[]) : Promise<Style[]> {
    if (id.length === 0) {
      return [];
    }
    const styles = await this.firestoreProvider.getFirestore().collection(StylesService.collection).where('id', 'in', id).withConverter(this.styleConverter).get();
    return styles.docs.map(style => this.styleConverter.fromFirestore(style));
  }
}
