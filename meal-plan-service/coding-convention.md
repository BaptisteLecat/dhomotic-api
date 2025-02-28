# Meal Plan Service

## Coding Guidelines

This document outlines the coding conventions and structure for developing modules within the Meal Plan Service. Following  
these guidelines will ensure consistency and maintainability across the codebase.

### Module Structure

Each module should be organized into the following components:

1. **Controller**: Handles incoming requests and returns responses to the client. It should use decorators to define routes
   and HTTP methods.

2. **Service**: Contains the business logic and interacts with the database or other services. It should be injected into t
   controller.

3. **DTO (Data Transfer Object)**: Defines the shape of data sent over the network. Use decorators to enforce validation    
   rules.

4. **Entity**: Represents a database entity. It should map to a Firestore document or collection.

5. **Converter**: Implements the `FirestoreDataConverter` interface to convert between Firestore documents and entities.

### Example Module Structure

Below is an example of how a module should be structured, using the `generation` module as a reference:

- **Controller**: `generation.controller.ts`
    - Use decorators like `@Controller`, `@Get`, `@Post` to define routes.
    - Inject the service using the constructor.

- **Service**: `generations.service.ts`
    - Implement business logic.
    - Interact with Firestore using injected providers.

- **DTO**: `create-generation.dto.ts`
    - Use decorators like `@ApiProperty`, `@IsNotEmpty`, `@IsString` for validation.

- **Entity**: `generation.entity.ts`
    - Define properties that map to Firestore fields.

- **Converter**: `generation.converter.ts`
    - Implement `toFirestore` and `fromFirestore` methods.

### Authentication Logic

The authentication logic in this project is implemented using JWT and API Key strategies. Here's how it works:

- **JWT Strategy**: 
  - Implemented in `jwt.strategy.ts`, it uses the `passport-firebase-jwt` strategy to validate Firebase JWT tokens.
  - The `JwtAuthGuard` in `jwt-auth.guard.ts` is used to protect routes by checking the validity of the JWT token.
  - The `AuthService` provides methods to verify tokens and retrieve user information from Firebase.

- **API Key Strategy**:
  - Implemented in `apikey.strategy.ts`, it uses the `passport-headerapikey` strategy to validate API keys.
  - The `ApiKeyAuthGuard` in `api-key-auth.guard.ts` is used to protect routes by checking the validity of the API key.
  - The `AuthService` validates the API key against a predefined value in the environment variables.

#### Implementing Authentication in a Module

To implement authentication in a module, follow these steps:

1. **Use Guards**: Apply `@UseGuards(JwtAuthGuard, ApiKeyAuthGuard)` to your controller or specific routes to enforce authentication.

   ```typescript
   @UseGuards(JwtAuthGuard, ApiKeyAuthGuard)
   @Controller('example')
   export class ExampleController {
     // Your routes here
   }
   ```

2. **Accessing User Data**: Use the `@Request()` decorator to access the authenticated user's data within your route handlers.

   ```typescript
   @Get()
   async getData(@Request() req): Promise<any> {
     const user = req.user; // Access the authenticated user
     // Use user data to fetch additional information from Firestore
   }
   ```

3. **Fetching User Data from Firestore**: Use the `AuthService` to verify tokens and fetch user data.

   ```typescript
   const userId = await this.authService.verifyIdToken(req.headers.authorization);
   const user = await this.userService.findOne(userId);
   ```

### Use of Converters

Converters are used to map Firestore documents to TypeScript entities and vice versa. This ensures type safety and consistency when interacting with Firestore.

- **FirestoreDataConverter**:
  - Each entity has a corresponding converter that implements the `FirestoreDataConverter` interface.
  - The `toFirestore` method converts an entity to a Firestore document.
  - The `fromFirestore` method converts a Firestore document to an entity.
  - Converters are used in services to seamlessly interact with Firestore, ensuring that data is correctly formatted and parsed.

#### Implementing Converters in Services

When implementing a service, inject the appropriate converter to handle Firestore operations. This centralizes the conversion logic and ensures consistency.

Example:
```typescript
@Injectable()
export class ExampleService {
  constructor(
    @Inject(FirebaseProvider) private readonly firestoreProvider: FirebaseProvider,
    private exampleConverter: ExampleConverter
  ) {}

  async findOne(id: string): Promise<ExampleEntity | undefined> {
    const doc = await this.firestoreProvider.getFirestore()
      .collection('examples')
      .doc(id)
      .withConverter(this.exampleConverter)
      .get();
    return doc.exists ? this.exampleConverter.fromFirestoreDocumentSnapshot(doc) : undefined;
  }
}
```

### Entity Methods: `toJson`, `fromJson`, `toFirestoreDocument`

Entities should implement methods like `toJson`, `fromJson`, and `toFirestoreDocument` to facilitate conversion between different data formats.

- **toJson**: Converts the entity to a JSON object, useful for API responses.
- **fromJson**: Creates an entity instance from a JSON object, useful for parsing incoming data.
- **toFirestoreDocument**: Converts the entity to a Firestore document format, used by converters.

These methods ensure that data is consistently formatted and parsed, reducing errors and improving maintainability.

#### Example of Entity Methods

```typescript
export class ExampleEntity {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  static fromJson(data: any): ExampleEntity {
    return new ExampleEntity(data.id, data.name);
  }

  toJson(): any {
    return { id: this.id, name: this.name };
  }

  toFirestoreDocument(): any {
    return { id: this.id, name: this.name };
  }
}
```

By adhering to these guidelines, you will contribute to a clean and consistent codebase that is easy to navigate and maintain.