import { CartUser } from "../entities/cartUser.entity";
import { Injectable } from "@nestjs/common";
import { FirestoreDataConverter, Firestore } from '@google-cloud/firestore';
import * as firebase from 'firebase-admin';

@Injectable()
export class CartUserConverter implements FirestoreDataConverter<CartUser> {
    toFirestore(modelObject: CartUser): firebase.firestore.DocumentData {
        return modelObject.toFirestoreDocument();
    }
    fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): CartUser {
        const id = snapshot.id;
        const data = snapshot.data();
        return CartUser.fromFirestoreDocument(id, data);
    }

    fromFirestoreDocumentSnapshot(documentSnapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>): CartUser {
        const id = documentSnapshot.id;
        const data = documentSnapshot.data();
        return CartUser.fromFirestoreDocument(id, data);
    }

    async fromFirestoreDocumentReference(documentReference: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>): Promise<CartUser> {
        const id = documentReference.id;
        const docRef = await documentReference.get();
        const data = docRef.data();
        return CartUser.fromFirestoreDocument(id, data);
    }

}