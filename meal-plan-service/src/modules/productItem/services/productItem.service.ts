import {Inject, Injectable} from '@nestjs/common';
import {FirebaseProvider} from '../../../providers/firebase.provider';
import {ProductItemConverter} from "../converters/productItem.converter";
import {ProductItem} from "../entities/productItem.entity";

@Injectable()
export class ProductItemService {
    static readonly collection: string = 'productItems';

    constructor(
        @Inject(FirebaseProvider)
        private readonly firestoreProvider: FirebaseProvider,
        private productItemConverter: ProductItemConverter,
    ) {
    }

    async findAll(): Promise<ProductItem[]> {
        const productItems = await this.firestoreProvider
            .getFirestore()
            .collection(ProductItemService.collection)
            .withConverter(this.productItemConverter)
            .get();
        return productItems.docs.map((weekPlan) =>
            this.productItemConverter.fromFirestore(weekPlan),
        );
    }

    async findOne(id: string): Promise<ProductItem | undefined> {
        const productItem = await this.firestoreProvider
            .getFirestore()
            .collection(ProductItemService.collection)
            .doc(id)
            .withConverter(this.productItemConverter)
            .get();
        if (!productItem.exists) {
            return undefined;
        }
        return this.productItemConverter.fromFirestoreDocumentSnapshot(productItem);
    }
}
