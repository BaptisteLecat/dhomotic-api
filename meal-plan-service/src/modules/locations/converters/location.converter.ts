import { Location } from "../entities/location.entity";
import { Injectable } from "@nestjs/common";
import { FirestoreDataConverter, Firestore } from '@google-cloud/firestore';
import * as firebase from 'firebase-admin';

@Injectable()
export class LocationConverter implements FirestoreDataConverter<Location> {
    toFirestore(modelObject: Location): firebase.firestore.DocumentData {
        return modelObject.toFirestoreDocument();
    }
    fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): Location {
        const id = snapshot.id;
        const data = snapshot.data();
        return Location.fromFirestoreDocument(id, data);
    }

    fromFirestoreDocumentSnapshot(documentSnapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>): Location {
        const id = documentSnapshot.id;
        const data = documentSnapshot.data();
        return Location.fromFirestoreDocument(id, data);
    }

    async fromFirestoreDocumentReference(documentReference: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>): Promise<Location> {
        const id = documentReference.id;
        const docRef = await documentReference.get();
        const data = docRef.data();
        return Location.fromFirestoreDocument(id, data);
    }

}
