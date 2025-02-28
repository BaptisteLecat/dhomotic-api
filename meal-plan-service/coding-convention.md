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

### Use of Converters

Converters are used to map Firestore documents to TypeScript entities and vice versa. This ensures type safety and consistency when interacting with Firestore.

- **FirestoreDataConverter**:
  - Each entity has a corresponding converter that implements the `FirestoreDataConverter` interface.
  - The `toFirestore` method converts an entity to a Firestore document.
  - The `fromFirestore` method converts a Firestore document to an entity.
  - Converters are used in services to seamlessly interact with Firestore, ensuring that data is correctly formatted and parsed.

By adhering to these guidelines, you will contribute to a clean and consistent codebase that is easy to navigate and maintain.
