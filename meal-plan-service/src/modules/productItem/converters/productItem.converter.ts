import { Injectable } from "@nestjs/common";
import { FirestoreDataConverter, Firestore } from '@google-cloud/firestore';
import * as firebase from 'firebase-admin';
import {ProductItem} from "../entities/productItem.entity";

@Injectable()
export class ProductItemConverter implements FirestoreDataConverter<ProductItem> {
    toFirestore(modelObject: ProductItem): firebase.firestore.DocumentData {
        return modelObject.toFirestoreDocument();
    }
    fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): ProductItem {
        const id = snapshot.id;
        const data = snapshot.data();
        return ProductItem.fromFirestoreDocument(id, data);
    }

    fromFirestoreDocumentSnapshot(documentSnapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>): ProductItem {
        const id = documentSnapshot.id;
        const data = documentSnapshot.data();
        return ProductItem.fromFirestoreDocument(id, data);
    }

    async fromFirestoreDocumentReference(documentReference: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>): Promise<ProductItem> {
        const id = documentReference.id;
        const docRef = await documentReference.get();
        const data = docRef.data();
        return ProductItem.fromFirestoreDocument(id, data);
    }

}