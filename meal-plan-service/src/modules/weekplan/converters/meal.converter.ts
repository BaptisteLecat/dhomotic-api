import { Meal } from "../entities/meal.entity";
import { Injectable } from "@nestjs/common";
import { FirestoreDataConverter, Firestore } from '@google-cloud/firestore';
import * as firebase from 'firebase-admin';

@Injectable()
export class MealConverter implements FirestoreDataConverter<Meal> {
    toFirestore(modelObject: Meal): firebase.firestore.DocumentData {
        return modelObject.toFirestoreDocument();
    }
    fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): Meal {
        const id = snapshot.id;
        const data = snapshot.data();
        return Meal.fromFirestoreDocument(id, data);
    }

    fromFirestoreDocumentSnapshot(documentSnapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>): Meal {
        const id = documentSnapshot.id;
        const data = documentSnapshot.data();
        return Meal.fromFirestoreDocument(id, data);
    }

    async fromFirestoreDocumentReference(documentReference: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>): Promise<Meal> {
        const id = documentReference.id;
        const docRef = await documentReference.get();
        const data = docRef.data();
        return Meal.fromFirestoreDocument(id, data);
    }

}