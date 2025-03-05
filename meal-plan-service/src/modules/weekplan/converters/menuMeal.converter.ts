import { Injectable } from "@nestjs/common";
import { FirestoreDataConverter, Firestore } from '@google-cloud/firestore';
import * as firebase from 'firebase-admin';
import {MenuMeal} from "../entities/menuMeal.entity";

@Injectable()
export class MenuMealConverter implements FirestoreDataConverter<MenuMeal> {
    toFirestore(modelObject: MenuMeal): firebase.firestore.DocumentData {
        return modelObject.toFirestoreDocument();
    }
    fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): MenuMeal {
        const id = snapshot.id;
        const data = snapshot.data();
        return MenuMeal.fromFirestoreDocument(id, data);
    }

    fromFirestoreDocumentSnapshot(documentSnapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>): MenuMeal {
        const id = documentSnapshot.id;
        const data = documentSnapshot.data();
        return MenuMeal.fromFirestoreDocument(id, data);
    }

    async fromFirestoreDocumentReference(documentReference: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>): Promise<MenuMeal> {
        const id = documentReference.id;
        const docRef = await documentReference.get();
        const data = docRef.data();
        return MenuMeal.fromFirestoreDocument(id, data);
    }

}