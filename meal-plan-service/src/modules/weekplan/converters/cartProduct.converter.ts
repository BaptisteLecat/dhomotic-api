import { CartProduct } from "../entities/cartProduct.entity";
import { Injectable } from "@nestjs/common";
import { FirestoreDataConverter, Firestore } from '@google-cloud/firestore';
import * as firebase from 'firebase-admin';

@Injectable()
export class CartProductConverter implements FirestoreDataConverter<CartProduct> {
    toFirestore(modelObject: CartProduct): firebase.firestore.DocumentData {
        return modelObject.toFirestoreDocument();
    }
    fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): CartProduct {
        const id = snapshot.id;
        const data = snapshot.data();
        return CartProduct.fromFirestoreDocument(id, data);
    }

    fromFirestoreDocumentSnapshot(documentSnapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>): CartProduct {
        const id = documentSnapshot.id;
        const data = documentSnapshot.data();
        return CartProduct.fromFirestoreDocument(id, data);
    }

    async fromFirestoreDocumentReference(documentReference: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>): Promise<CartProduct> {
        const id = documentReference.id;
        const docRef = await documentReference.get();
        const data = docRef.data();
        return CartProduct.fromFirestoreDocument(id, data);
    }

}