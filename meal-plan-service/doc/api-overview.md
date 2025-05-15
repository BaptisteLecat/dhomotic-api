# Meal Plan Service API - Endpoint Overview

This document provides an overview of the main API endpoints and their business logic.

---

## Weekplan Endpoints

- **POST `/houses/:houseId/weekplans`**
  - Create a new weekplan for a house.
  - Automatically generates menus for each day and meal slice.

- **GET `/houses/:houseId/weekplans`**
  - Retrieve all weekplans for a house.

- **GET `/houses/:houseId/weekplans/:id`**
  - Retrieve a specific weekplan by ID.

---

## Cart Endpoints

- **PUT `/houses/:houseId/weekplans/:id/cart`**
  - Add or update a product in the weekplan's cart.
  - If the product exists, updates its quantity; otherwise, adds it.

- **DELETE `/houses/:houseId/weekplans/:id/cart/:cartProductId`**
  - Remove a product from the weekplan's cart.

---

## Menu & Meal Endpoints

- **POST `/houses/:houseId/weekplans/:id/menu/:menuId/menu-meals`**
  - Assign a meal to a menu slot.
  - Automatically updates the cart with required products for the meal.

- **DELETE `/houses/:houseId/weekplans/:id/menu/:menuId/menu-meals/:menuMealId`**
  - Remove a meal assignment from a menu slot.

---

## Authentication

- All endpoints require a valid JWT and API Key.

---

## Notes

- All data is scoped to a house.
- Business logic ensures data consistency and prevents duplicate assignments.
