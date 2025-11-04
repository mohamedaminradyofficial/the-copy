# Project Overview

This is a monorepo for a web application called "Firebase Studio", a drama analysis platform powered by AI. The project consists of a Next.js frontend and an Express.js backend, both written in TypeScript.

## Frontend

The frontend is a Next.js application that provides the user interface for the drama analysis platform. It uses Tailwind CSS for styling and `shadcn/ui` for UI components. It integrates with Google Genkit for AI-powered features.

**Key Technologies:**

*   Next.js
*   TypeScript
*   Tailwind CSS
*   Google Genkit
*   React Hook Form
*   Zod
*   Vitest (for unit testing)
*   Playwright (for E2E testing)

## Backend

The backend is an Express.js application that provides a RESTful API for the frontend. It uses Google Generative AI for text analysis and supports various file formats (PDF, DOCX, TXT). It uses `drizzle-orm` for database interactions.

**Key Technologies:**

*   Express.js
*   TypeScript
*   Google Generative AI
*   Drizzle ORM
*   Zod
*   Winston (for logging)
*   Vitest (for unit testing)

# Building and Running

## Prerequisites

*   Node.js (>=20.0.0)
*   pnpm

## Installation

1.  Install dependencies from the root directory:
    ```bash
    pnpm install
    ```
2.  Set up environment variables by copying `.env.example` to `.env.local` in both the `frontend` and `backend` directories and filling in the required values.

## Running the Application

### Frontend

To run the frontend development server:

```bash
pnpm --filter nextn dev
```

The frontend will be available at `http://localhost:9002`.

To run the Genkit development server:

```bash
pnpm --filter nextn genkit:dev
```

### Backend

To run the backend development server:

```bash
pnpm --filter @the-copy/backend dev
```

The backend will be available at `http://localhost:3001`.

# Development Conventions

*   The project uses `pnpm` for package management.
*   The project is a monorepo with `frontend` and `backend` packages.
*   Both packages are written in TypeScript.
*   The project uses ESLint for linting and Prettier for code formatting.
*   The project uses Vitest for unit testing and Playwright for end-to-end testing.
*   The project has a CI/CD pipeline with Firebase Hosting.
*   The project has a high test coverage requirement (>=80%).
