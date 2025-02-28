# Meal Plan Service

## Coding Guidelines

This document outlines the coding conventions and structure for developing modules within the Meal Plan Service. Following these guidelines will ensure consistency and maintainability across the codebase.

### Module Structure

Each module should be organized into the following components:

1. **Controller**: Handles incoming requests and returns responses to the client. It should use decorators to define routes and HTTP methods.

2. **Service**: Contains the business logic and interacts with the database or other services. It should be injected into the controller.

3. **DTO (Data Transfer Object)**: Defines the shape of data sent over the network. Use decorators to enforce validation rules.

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

### General Conventions

- Use dependency injection to manage service dependencies.
- Use NestJS decorators for routing, validation, and dependency injection.
- Follow the naming conventions for files and classes (e.g., `PascalCase` for classes, `kebab-case` for filenames).
- Ensure all modules are registered in the `app.module.ts`.

By adhering to these guidelines, you will contribute to a clean and consistent codebase that is easy to navigate and maintain.
