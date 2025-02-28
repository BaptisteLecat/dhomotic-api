import { User } from "../entities/user.entity";
import { Injectable } from "@nestjs/common";
import { FirestoreDataConverter, Firestore } from '@google-cloud/firestore';
import * as firebase from 'firebase-admin';

@Injectable()
export class UserConverter implements FirestoreDataConverter<User> {
    toFirestore(modelObject: User): firebase.firestore.DocumentData {
        return modelObject.toFirestoreDocument();
    }
    fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): User {
        const id = snapshot.id;
        const data = snapshot.data();
        return User.fromFirestoreDocument(id, data);
    }

    fromFirestoreDocumentSnapshot(documentSnapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>): User {
        const id = documentSnapshot.id;
        const data = documentSnapshot.data();
        return User.fromFirestoreDocument(id, data);
    }

    async fromFirestoreDocumentReference(documentReference: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>): Promise<User> {
        const id = documentReference.id;
        const docRef = await documentReference.get();
        const data = docRef.data();
        return User.fromFirestoreDocument(id, data);
    }

}
