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
      =======
### Adding a New Module

To add a new module to the project, follow these steps, using the `generation` module as a reference:

1. **Create Module Directory**: Create a new directory under `src/modules` for your module.

2. **Define the Controller**:
    - Create a controller file (e.g., `weekplan.controller.ts`).
    - Use decorators like `@Controller`, `@Get`, `@Post` to define routes.
    - Inject the service using the constructor.

   Example:
   ```typescript                                                                                                            
   @Controller('example')                                                                                                   
   export class ExampleController {                                                                                         
     constructor(private readonly exampleService: ExampleService) {}                                                        
                                                                                                                            
     @Get()                                                                                                                 
     getExample(): string {                                                                                                 
       return this.exampleService.getExample();                                                                             
     }                                                                                                                      
   }                                                                                                                        
   ```                                                                                                                      

3. **Implement the Service**:
    - Create a service file (e.g., `example.service.ts`).
    - Implement business logic and interact with Firestore using injected providers.

   Example:
   ```typescript                                                                                                            
   @Injectable()                                                                                                            
   export class ExampleService {                                                                                            
     constructor(@Inject(FirebaseProvider) private readonly firestoreProvider: FirebaseProvider) {}                         
                                                                                                                            
     getExample(): string {                                                                                                 
       return 'Example data';                                                                                               
     }                                                                                                                      
   }                                                                                                                        
   ```                                                                                                                      

4. **Create DTOs**:
    - Define DTOs for data validation and transfer (e.g., `create-example.dto.ts`).
    - Use decorators like `@ApiProperty`, `@IsNotEmpty`, `@IsString` for validation.

5. **Define Entities**:
    - Create entity files to represent database entities (e.g., `example.entity.ts`).
    - Implement methods like `toJson`, `fromJson`, and `toFirestoreDocument`.

6. **Implement Converters**:
    - Create a converter file (e.g., `example.converter.ts`).
    - Implement `toFirestore` and `fromFirestore` methods to handle data conversion.

7. **Register the Module**:
    - Create a module file (e.g., `example.module.ts`).
    - Register controllers, providers, and any other dependencies.

   Example:
   ```typescript                                                                                                            
   @Module({                                                                                                                
     controllers: [ExampleController],                                                                                      
     providers: [ExampleService, ExampleConverter, FirebaseProvider],                                                       
   })                                                                                                                       
   export class ExampleModule {}                                                                                            
   ```                                                                                                                      

8. **Update App Module**:
    - Import and add the new module to the `app.module.ts` to ensure it is part of the application.

### Authentication Logic

The authentication logic in this project is implemented using Firebase Authentication, JWT, and API Key strategies. Here's how it works:

- **Firebase Authentication**:
  - Firebase Authentication is used to manage user identities and provide secure authentication.
  - The `AuthService` interacts with Firebase to verify tokens and retrieve user information.

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

#### User Context in Request

The authenticated user is added to the request context, allowing easy access to user information in controllers. This is achieved by the `PassportModule` and the `JwtStrategy`, which validate the token and attach the user to the request.

- **AuthUser Entity**: The `AuthUser` entity represents the user data added to the request. It includes fields like `id`, `role`, and `disabled` status.

Example of `AuthUser`:
```typescript
export class AuthUser {
    id: string;
    role: string;
    disabled: boolean;

    constructor(id: string, role: string, disabled: boolean = false) {
        this.id = id;
        this.role = role;
        this.disabled = disabled;
    }

    static fromFirebaseUser(firebaseUser: any): AuthUser {
        return new AuthUser(firebaseUser.uid, "", firebaseUser.disabled);
    }

    static fromJson(json: any): AuthUser {
        return new AuthUser(json.id, json.role, json.disabled);
    }
}
```

The `AuthUser` entity is used to ensure that only authenticated users can access certain routes, and it provides a consistent way to access user information across the application.

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
