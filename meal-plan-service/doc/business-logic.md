# Meal Plan Service API - Business Logic

This document describes the business logic implemented in the Meal Plan Service API.

## Overview

The Meal Plan Service manages weekly meal planning, menu generation, shopping cart management, and meal assignment for users within a household. It integrates with Firebase for authentication and Firestore for data storage.

---

## Core Concepts

### 1. Weekplan

- Represents a weekly meal plan for a household.
- Contains a start and end date, a list of menus (one per meal per day), and a shopping cart.
- Created per house, with menus generated automatically for each day and meal slice.

### 2. Menu

- Represents a meal slot for a specific day and time (e.g., breakfast, lunch, dinner).
- Each menu can have multiple assigned meals (`MenuMeal`).

### 3. MenuMeal

- Represents a specific meal assigned to a menu slot by a user.
- Tracks which user assigned the meal and when.

### 4. CartProduct

- Represents a product item added to the shopping cart for the weekplan.
- Tracks the quantity, the user who added it, and whether it has been checked (purchased).

---

## Main Business Flows

### Weekplan Creation

- When a weekplan is created, menus are automatically generated for each day and meal slice between the start and end dates.
- Each menu is uniquely identified and ready to receive meal assignments.

### Assigning Meals to Menus

- Users can assign a meal to a menu slot by creating a `MenuMeal`.
- When a meal is assigned, the system automatically updates the shopping cart:
  - For each product required by the meal, the corresponding cart product's quantity is incremented.
  - If the product is not already in the cart, it is added.

### Shopping Cart Management

- Users can add or update products in the cart manually.
- If a product already exists in the cart, its quantity is updated.
- Products can be removed from the cart.

### Removing Meals from Menus

- When a `MenuMeal` is removed from a menu, the system does **not** automatically decrement the cart quantities (business logic can be extended if needed).

---

## Authentication & Authorization

- All endpoints are protected by JWT and API Key guards.
- Only authenticated users can interact with weekplans, menus, and carts.

---

## Data Consistency

- All entities are stored in Firestore, using converters to ensure type safety and consistent serialization/deserialization.
- Entity methods (`toJson`, `fromJson`, `toFirestoreDocument`) are used for data transformation.

---

## Error Handling

- The service throws descriptive errors if entities (weekplan, user, product, meal) are not found.
- Duplicate assignments (e.g., assigning the same meal twice to a menu) are prevented.

---

## Extensibility

- The modular structure allows for easy extension (e.g., adding new features, integrating with other services).
- Business logic is encapsulated in services, keeping controllers thin.

---
