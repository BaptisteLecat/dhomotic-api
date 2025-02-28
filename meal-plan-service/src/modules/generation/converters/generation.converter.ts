import { Generation } from "../entities/generation.entity";
import { Injectable } from "@nestjs/common";
import { FirestoreDataConverter, Firestore } from '@google-cloud/firestore';
import * as firebase from 'firebase-admin';

@Injectable()
export class GenerationConverter implements FirestoreDataConverter<Generation> {
    toFirestore(modelObject: Generation): firebase.firestore.DocumentData {
        return modelObject.toFirestoreDocument();
    }
    fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): Generation {
        const id = snapshot.id;
        const data = snapshot.data();
        return Generation.fromFirestoreDocument(id, data);
    }

    fromFirestoreDocumentSnapshot(documentSnapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>): Generation {
        const id = documentSnapshot.id;
        const data = documentSnapshot.data();
        return Generation.fromFirestoreDocument(id, data);
    }

    async fromFirestoreDocumentReference(documentReference: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>): Promise<Generation> {
        const id = documentReference.id;
        const docRef = await documentReference.get();
        const data = docRef.data();
        return Generation.fromFirestoreDocument(id, data);
    }

}
