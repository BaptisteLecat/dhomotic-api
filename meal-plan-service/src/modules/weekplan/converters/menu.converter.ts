import { Injectable } from "@nestjs/common";
import { FirestoreDataConverter, Firestore } from '@google-cloud/firestore';
import * as firebase from 'firebase-admin';
import {Menu} from "../entities/menu.entity";

@Injectable()
export class MenuConverter implements FirestoreDataConverter<Menu> {
    toFirestore(modelObject: Menu): firebase.firestore.DocumentData {
        return modelObject.toFirestoreDocument();
    }
    fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): Menu {
        const id = snapshot.id;
        const data = snapshot.data();
        return Menu.fromFirestoreDocument(id, data);
    }

    fromFirestoreDocumentSnapshot(documentSnapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>): Menu {
        const id = documentSnapshot.id;
        const data = documentSnapshot.data();
        return Menu.fromFirestoreDocument(id, data);
    }

    async fromFirestoreDocumentReference(documentReference: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>): Promise<Menu> {
        const id = documentReference.id;
        const docRef = await documentReference.get();
        const data = docRef.data();
        return Menu.fromFirestoreDocument(id, data);
    }

}