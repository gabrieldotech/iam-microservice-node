# Identity & Access Management (IAM) Service

Project Status: This repository is currently a Work in Progress (WIP), being developed as part of my advanced backend studies.

## Objective

A professional and secure Identity and Access Management (IAM) service designed to handle user authentication and authorization. The project is built following Clean Architecture principles to ensure a decoupled, maintainable, and highly scalable codebase.

## Tech Stack

- Runtime: Node.js
- Framework: Fastify (High-performance & low overhead)
- Language: TypeScript
- ORM: Prisma (Type-safe database management)
- Validation: Zod (Schema validation)
- Security: Bcrypt (Password hashing) and JWT (JSON Web Tokens)
- Database: PostgreSQL

## Key Features (Already Implemented)

- User Registration: Secure sign-up process with password encryption.
- Authentication: Robust login system issuing signed JWT tokens.
- JWT Middleware: Custom authentication hook to protect private routes.
- Profile Access: Protected /me route to retrieve authenticated user details.

## How to Run (Development)

### Prerequisites
<<<<<<< HEAD
=======

- Node.js v22 or higher (Uses native --env-file support)
- Docker and Docker Compose
>>>>>>> 41300ae (docs: overhaul readme for portfolio and add MIT license)

- Node.js (v18 or higher)
- Docker (for database instance)

### Installation

1. Clone the repository:
   git clone <your-repository-url>

2. Install dependencies:
   npm install

3. Environment Setup:
   Create a .env file in the root directory and configure your DATABASE_URL and JWT_SECRET.

4. Database Migration:
   npx prisma migrate dev

5. Start the server:
   npm run dev

---

Developed with focus on software quality and security best practices.
