# Books Archive Management System API

A robust RESTful API for managing a digital books archive, including users, profiles, authors, books, categories, and book reviews. Built with NestJS, TypeORM, and PostgreSQL.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Seeding](#database-seeding)
- [Entity-Relationship Diagram](#entity-relationship-diagram)
- [Entities](#entities)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [License](#license)

---

## Features

- User registration and management
- User profiles with bio, avatar, and location
- Author and book management
- Book categorization (many-to-many)
- Book reviews by users
- Advanced book search (by title, author, category)
- Get books by author or category
- Global error handling
- Database seeding for development

---

## Tech Stack

- **Backend:** NestJS
- **ORM:** TypeORM
- **Database:** PostgreSQL
- **Validation:** class-validator
- **Hashing:** bcryptjs

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database
- pnpm (or npm/yarn)

### Installation

```bash
git clone https://github.com/yourusername/Build-a-Books-Archive-Management-System-API.git
cd Build-a-Books-Archive-Management-System-API
pnpm install
```

### Environment Variables

Create a `.env` file in the root directory and set the following:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_NAME=your_db_name
PORT=5000
```

### Running the App

```bash
pnpm start:dev
```

The API will be available at `http://127.0.0.1:5000`.

---

## Database Seeding

To populate the database with sample data for development/testing:

```bash
pnpm seed
```

---

## Entity-Relationship Diagram

```
[User] 1---1 [Profile]
  |
  | 1---* [BookReview] *---1 [Book]
  |
  | 1---* [Book] *---1 [Author]
  |
  | *---* [Category] *---* [Book]

Entities:
---------
User
- id (PK)
- name
- email
- password
- isActive
- createdAt
- updatedAt
- profileId (FK)

Profile
- id (PK)
- bio
- avatar
- dateOfBirth
- location
- userId (FK)

Author
- id (PK)
- name
- bio
- birthDate
- isActive

Book
- id (PK)
- title
- description
- publicationYear
- isAvailable
- authorId (FK)

Category
- id (PK)
- name
- description

BookReview
- id (PK)
- content
- rating
- userId (FK)
- bookId (FK)
```

---

## Entities

### User
| Field      | Type    | Description                |
|------------|---------|----------------------------|
| id         | string  | UUID, primary key          |
| name       | string  | Unique, 2-50 chars, alphanumeric with spaces |
| email      | string  | Unique, valid email        |
| password   | string  | Hashed, min 8 chars, strong|
| isActive   | boolean | Default: true              |
| createdAt  | Date    | Auto-generated             |
| updatedAt  | Date    | Auto-generated             |
| profile    | Profile | One-to-one                 |
| reviews    | BookReview[] | One-to-many           |

### Profile
| Field      | Type    | Description                |
|------------|---------|----------------------------|
| id         | string  | UUID, primary key          |
| bio        | string  | Optional                   |
| avatar     | string  | Optional                   |
| dateOfBirth| string  | Optional, ISO 8601 date    |
| location   | string  | Optional                   |
| user       | User    | One-to-one                 |

### Author
| Field      | Type    | Description                |
|------------|---------|----------------------------|
| id         | string  | UUID, primary key          |
| name       | string  | 2-100 chars                |
| bio        | string  | Optional, max 1000 chars   |
| birthDate  | string  | Optional, not in future    |
| isActive   | boolean | Default: true              |
| books      | Book[]  | One-to-many                |

### Book
| Field           | Type    | Description                |
|-----------------|---------|----------------------------|
| id              | string  | UUID, primary key          |
| title           | string  | 1-200 chars                |
| description     | string  | 10-2000 chars              |
| publicationYear | number  | 1000-current year          |
| isAvailable     | boolean | Default: true              |
| author          | Author  | Many-to-one                |
| categories      | Category[] | Many-to-many            |
| reviews         | BookReview[] | One-to-many           |

### Category
| Field      | Type    | Description                |
|------------|---------|----------------------------|
| id         | string  | UUID, primary key          |
| name       | string  | 2-50 chars, unique         |
| description| string  | Optional, max 500 chars    |
| books      | Book[]  | Many-to-many               |

### BookReview
| Field      | Type    | Description                |
|------------|---------|----------------------------|
| id         | string  | UUID, primary key          |
| content    | string  | 10-1000 chars              |
| rating     | number  | 1-5                        |
| user       | User    | Many-to-one                |
| book       | Book    | Many-to-one                |

---

## API Reference

All endpoints are available at `http://127.0.0.1:5000` (or your deployed URL).

### Users

- `GET /users` — List all users
- `GET /users/:id` — Get user by ID
- `POST /users` — Create new user
- `PUT /users/:id` — Update user
- `DELETE /users/:id` — Delete user

**Sample Create User Request:**
```json
{
  "name": "Alice Wonderland",
  "email": "alicee@example.com",
  "password": "Password123!"
}
```

### Profiles

- `GET /profiles`
- `GET /profiles/:id`
- `POST /profiles`
- `PATCH /profiles/:id`
- `DELETE /profiles/:id`

**Sample Create Profile Request:**
```json
{
  "bio": "Loves reading thrillers.",
  "avatar": "avatar1.png",
  "dateOfBirth": "1990-05-15",
  "location": "New York"
}
```

### Authors

- `GET /authors`
- `GET /authors/:id`
- `POST /authors`
- `PUT /authors/:id`
- `DELETE /authors/:id`
- `GET /authors/:id/books` — Get books by author

**Sample Create Author Request:**
```json
{
  "name": "Jane Austen",
  "bio": "Renowned English novelist.",
  "birthDate": "1775-12-16",
  "isActive": true
}
```

### Books

- `GET /books`
- `GET /books/:id`
- `POST /books`
- `PUT /books/:id`
- `DELETE /books/:id`
- `GET /books/search?title=&authorName=&categoryName=` — Advanced search

**Sample Create Book Request:**
```json
{
  "title": "Pride and Prejudice",
  "description": "A romantic novel.",
  "publicationYear": 1813,
  "authorId": "2ca0dc83-5351-4a97-95f1-25bf5af5a454",
  "categoryIds": ["5946610a-a9c8-4287-a0a2-63811004a3a2"],
  "isAvailable": true
}
```

### Categories

- `GET /categories`
- `GET /categories/:id`
- `POST /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id`
- `GET /categories/:id/books` — Get books in category

**Sample Create Category Request:**
```json
{
  "name": "Classic Literature",
  "description": "Timeless works of fiction."
}
```

### Book Reviews

- `GET /book-reviews`
- `GET /book-reviews/:id`
- `POST /book-reviews`
- `PATCH /book-reviews/:id`
- `DELETE /book-reviews/:id`
- `POST /books/:bookId/reviews` — Add review to book

**Sample Create Book Review Request:**
```json
{
  "content": "A timeless classic, truly wonderful!",
  "rating": 5,
  "userId": "user-uuid",
  "bookId": "book-uuid"
}
```

---

## Error Handling

- All errors are returned in a consistent format:
```json
{
  "statusCode": 400,
  "timestamp": "2025-05-30T08:38:44.837Z",
  "path": "/authors",
  "error": "BadRequestException",
  "message": [
    "birthDate must be a valid ISO 8601 date string"
  ]
}
```
- Validation errors, not found, and unique constraint violations are handled gracefully.

---

## License

This project is licensed under the MIT License.

---

**For any questions or contributions, please open an issue or pull request!**
