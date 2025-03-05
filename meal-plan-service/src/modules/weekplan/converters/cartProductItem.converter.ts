import { CartProductItem } from "../entities/cartProductItem.entity";
import { Injectable } from "@nestjs/common";
import { FirestoreDataConverter, Firestore } from '@google-cloud/firestore';
import * as firebase from 'firebase-admin';

@Injectable()
export class CartProductItemConverter implements FirestoreDataConverter<CartProductItem> {
    toFirestore(modelObject: CartProductItem): firebase.firestore.DocumentData {
        return modelObject.toFirestoreDocument();
    }
    fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): CartProductItem {
        const id = snapshot.id;
        const data = snapshot.data();
        return CartProductItem.fromFirestoreDocument(id, data);
    }

    fromFirestoreDocumentSnapshot(documentSnapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>): CartProductItem {
        const id = documentSnapshot.id;
        const data = documentSnapshot.data();
        return CartProductItem.fromFirestoreDocument(id, data);
    }

    async fromFirestoreDocumentReference(documentReference: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>): Promise<CartProductItem> {
        const id = documentReference.id;
        const docRef = await documentReference.get();
        const data = docRef.data();
        return CartProductItem.fromFirestoreDocument(id, data);
    }

}