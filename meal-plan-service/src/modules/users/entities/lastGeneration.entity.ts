import { Timestamp } from '@google-cloud/firestore';

export class LastGeneration {
  generationId: string;
  insertedTimestamp: Timestamp;

  public constructor(generationId: string, insertedTimestamp: Timestamp) {
    this.generationId = generationId;
    this.insertedTimestamp = insertedTimestamp;
  }

  static fromFirestoreDocument(id: any, data: any): LastGeneration {
    return new LastGeneration(id, data);
  }

  static fromJson(data: any): LastGeneration {
    return new LastGeneration(data.generationId, data.insertedTimestamp);
  }

  toFirestoreDocument(): any {
    return {
      generationId: this.generationId,
      insertedTimestamp: this.insertedTimestamp,
    };
  }

  toJson(): any {
    return {
      generationId: this.generationId,
      insertedTimestamp: this.insertedTimestamp,
    };
  }
}
