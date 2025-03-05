import { Injectable } from "@nestjs/common";
import { FirestoreDataConverter, Firestore } from '@google-cloud/firestore';
import * as firebase from 'firebase-admin';
import {NestedUser} from "../entities/nestedUser.entity";

@Injectable()
export class NestedUserConverter implements FirestoreDataConverter<NestedUser> {
    toFirestore(modelObject: NestedUser): firebase.firestore.DocumentData {
        return modelObject.toFirestoreDocument();
    }
    fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): NestedUser {
        const id = snapshot.id;
        const data = snapshot.data();
        return NestedUser.fromFirestoreDocument(id, data);
    }

    fromFirestoreDocumentSnapshot(documentSnapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>): NestedUser {
        const id = documentSnapshot.id;
        const data = documentSnapshot.data();
        return NestedUser.fromFirestoreDocument(id, data);
    }

    async fromFirestoreDocumentReference(documentReference: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>): Promise<NestedUser> {
        const id = documentReference.id;
        const docRef = await documentReference.get();
        const data = docRef.data();
        return NestedUser.fromFirestoreDocument(id, data);
    }

}