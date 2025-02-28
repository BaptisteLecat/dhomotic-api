export class Style {
  id: string;
  name: string;

  public constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  static fromFirestoreDocument(id: any, data: any): Style {
    return new Style(id, data.name);
  }

  static fromJson(data: any): Style {
    return new Style(data.id, data.name);
  }

  toFirestoreDocument(): any {
    return {
      id: this.id,
      name: this.name,
    };
  }

  toJson(): any {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
