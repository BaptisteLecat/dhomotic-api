import { Style } from "../entities/style.entity";
import { Injectable } from "@nestjs/common";
import { FirestoreDataConverter, Firestore } from '@google-cloud/firestore';
import * as firebase from 'firebase-admin';

@Injectable()
export class StyleConverter implements FirestoreDataConverter<Style> {
    toFirestore(modelObject: Style): firebase.firestore.DocumentData {
        return modelObject.toFirestoreDocument();
    }
    fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): Style {
        const id = snapshot.id;
        const data = snapshot.data();
        return Style.fromFirestoreDocument(id, data);
    }

    fromFirestoreDocumentSnapshot(documentSnapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>): Style {
        const id = documentSnapshot.id;
        const data = documentSnapshot.data();
        return Style.fromFirestoreDocument(id, data);
    }

    async fromFirestoreDocumentReference(documentReference: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>): Promise<Style> {
        const id = documentReference.id;
        const docRef = await documentReference.get();
        const data = docRef.data();
        return Style.fromFirestoreDocument(id, data);
    }

}
