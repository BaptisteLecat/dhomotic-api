import { Weekplan } from "../entities/weekplan.entity";
import { Injectable } from "@nestjs/common";
import { FirestoreDataConverter, Firestore } from '@google-cloud/firestore';
import * as firebase from 'firebase-admin';

@Injectable()
export class WeekplanConverter implements FirestoreDataConverter<Weekplan> {
    toFirestore(modelObject: Weekplan): firebase.firestore.DocumentData {
        return modelObject.toFirestoreDocument();
    }
    fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): Weekplan {
        const id = snapshot.id;
        const data = snapshot.data();
        return Weekplan.fromFirestoreDocument(id, data);
    }

    fromFirestoreDocumentSnapshot(documentSnapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>): Weekplan {
        const id = documentSnapshot.id;
        const data = documentSnapshot.data();
        return Weekplan.fromFirestoreDocument(id, data);
    }

    async fromFirestoreDocumentReference(documentReference: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>): Promise<Weekplan> {
        const id = documentReference.id;
        const docRef = await documentReference.get();
        const data = docRef.data();
        return Weekplan.fromFirestoreDocument(id, data);
    }

}