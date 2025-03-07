import { Injectable } from "@nestjs/common";
import { FirestoreDataConverter, Firestore } from '@google-cloud/firestore';
import * as firebase from 'firebase-admin';
import {MealProduct} from "../entities/mealProduct.entity";

@Injectable()
export class MealProductConverter implements FirestoreDataConverter<MealProduct> {
    toFirestore(modelObject: MealProduct): firebase.firestore.DocumentData {
        return modelObject.toFirestoreDocument();
    }
    fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): MealProduct {
        const id = snapshot.id;
        const data = snapshot.data();
        return MealProduct.fromFirestoreDocument(id, data);
    }

    fromFirestoreDocumentSnapshot(documentSnapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>): MealProduct {
        const id = documentSnapshot.id;
        const data = documentSnapshot.data();
        return MealProduct.fromFirestoreDocument(id, data);
    }

    async fromFirestoreDocumentReference(documentReference: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>): Promise<MealProduct> {
        const id = documentReference.id;
        const docRef = await documentReference.get();
        const data = docRef.data();
        return MealProduct.fromFirestoreDocument(id, data);
    }

}