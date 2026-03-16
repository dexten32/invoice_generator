# Development Logbook - Invoice Generator

This logbook documents the chronological history of changes, features added, and bug fixes for the Professional Invoice Generator project.

## 📅 March 10, 2026

### 🕑 14:40 - Code Refactoring & Lean App.jsx
- **Refactor**: Cleaned up `App.jsx` by moving the central state management to a reusable custom hook `useInvoice.js`.
- **Added**: Extracted all hard-coded initial invoice data to `src/constants/invoiceDefaults.js`.
- **Improved**: Improved project scalability and readability by isolating business logic from the main entry component.

### 🕑 14:35 - UI Cleanup
- **Removed**: Order Summary dashboard from the editor to maintain a cleaner, data-focused interface.
- **Optimized**: Cleaned up unused calculation logic in `InvoiceEditor.jsx` and related CSS in `InvoiceEditor.css`.

### 🕑 14:20 - UX & UI Enhancements
- **Added**: Functional **Logo Upload** system storing Base64 image data in the app state.
- **Added**: Professional iconography across all editor categories (Business, Client, Meta, Items).
- **Improved**: Line Item data entry with a more compact, card-based layout and better input labels.
- **Added**: Order Summary dashboard (later removed) for live total tracking.
- **Updated**: `Invoice.jsx` to render the uploaded business logo dynamically.

### 🕑 14:05 - Visibility & Accessibility Fixes
- **Refactor**: Migrated global color variables from `oklch` to `hsl` in `index.css` for better visibility across all screens.
- **Updated**: Enhanced text contrast in the Editor by explicitly setting gray-800/900 colors for headings and labels.
- **Fixed**: Overlapping issues in accordion sections by refining padding and gaps.

### 🕑 13:45 - Layout Alignment
- **Fixed**: Aligned the Preview Heading and Download Button with the edges of the Invoice container.
- **Updated**: Balanced the typography size for "Balance Due" at the bottom of the invoice.

### 🕑 11:30 - Dynamic State Implementation
- **Added**: Centralized `invoiceData` state in `App.jsx` as the single source of truth.
- **Refactor**: Converted `Invoice.jsx` from a hard-coded layout to a dynamic component accepting props.
- **Implemented**: A comprehensive, responsive `InvoiceEditor` using Chakra UI components (Accordion, Input, Field).
- **Added**: Dynamic item management (Add/Remove items) with automatic total calculations.

### 🕑 10:00 - Project Foundation
- **Infrastructure**: Integrated Chakra UI Provider in `main.jsx`.
- **Feature**: Implemented professional PDF download functionality using `DownloadTrigger`.

---

---

## 📅 March 9, 2026

### 🕒 Afternoon - Layout & Bug Fixes
- **Bug Fix**: Resolved "Expression expected" error in `invoice.jsx`.
- **Redesign**: Complete layout overhaul of the invoice to match professional visual references.
- **CSS**: Optimized `invoice.css` for better print support and pixel-perfect alignment.

---

## 📅 March 16, 2026

### 🕑 09:41 - Authentication System (Login Page + Backend + Protected Routing)

#### Backend (`/backend`) — New Express.js Auth Server
- **Added**: New `backend/` folder at project root as a standalone Node/Express server running on port `4000`.
- **Added**: `server.js` — Express entry point with CORS, JSON body parsing, and a health check at `GET /api/health`.
- **Added**: `data/users.js` — in-memory mock user store with one pre-seeded account (`admin@example.com / password123`). Passwords hashed with `bcryptjs`.
- **Added**: `middleware/authMiddleware.js` — JWT verification middleware reading `Authorization: Bearer <token>`.
- **Added**: `routes/auth.js` — three endpoints:
  - `POST /api/auth/login` — validates credentials, returns signed JWT (7-day expiry)
  - `POST /api/auth/logout` — stateless logout (client discards token)
  - `GET /api/auth/me` — validates token, returns current user payload
- **Added**: `.env` and `.env.example` with `PORT` and `JWT_SECRET` variables.

#### Frontend — Auth Context & Hook
- **Added**: `src/context/AuthContext.jsx` — React context exposing `{ user, token, isLoading, login, logout }`. On mount, reads JWT from `localStorage` and re-validates via `/api/auth/me`. Clears state on token expiry.
- **Added**: `src/hooks/useAuth.js` — `useAuth()` hook wrapping `AuthContext`.

#### Frontend — Login Page
- **Added**: `src/pages/LoginPage.jsx` — premium two-panel login page: dark brand panel (left) with headline and feature pills, white form panel (right) with email/password fields, error display, show/hide password toggle, animated submit button, and a demo credentials hint.
- **Added**: Login page CSS tokens (`.login-*` classes) appended to `src/index.css`.

#### Frontend — Protected Routing
- **Added**: `src/components/auth/ProtectedRoute.jsx` — redirects unauthenticated users to `/login`, preserving the intended path via React Router's `state`. Shows a branded loading spinner during token validation.
- **Updated**: `src/App.jsx` — wrapped in `<AuthProvider>`, added public `/login` route, and protected all existing routes (`/`, `/customers`, `/products`) inside `<ProtectedRoute>`.
- **Updated**: `src/components/layout/Sidebar.jsx` — sidebar now shows the real authenticated user's name and email from `AuthContext`. Initials avatar generated from user's name. "Sign Out" button wired to `logout()`.

---

### 🕑 10:16 - Prisma Schema + Supabase Setup

- **Added**: `prisma/schema.prisma` — full database schema with 5 models:
  - `Company` — the business issuing invoices (name, GST number, address)
  - `Customer` — invoice recipients (name, email, phone, GST number)
  - `Service` — reusable catalog items (name, description, price, GST rate)
  - `Invoice` — invoice header with company/customer FK, issue date, monetary totals, and status enum (`DRAFT | SENT | PAID | OVERDUE | CANCELLED`)
  - `InvoiceItem` — line items with snapshot of service name at invoicing time; `serviceId` is nullable with `onDelete: SetNull` to preserve history if a service is deleted
  - All monetary fields typed as `Decimal(12,2)`; GST rates as `Decimal(5,2)`
- **Added**: `prisma.config.ts` — Prisma v7 configuration file; connection URLs moved here from `schema.prisma` per the new v7 spec (`DATABASE_URL` for pooled runtime, `DIRECT_URL` for migration-time direct connection).
- **Added**: `lib/prisma.js` — singleton `PrismaClient` instance, safe to use across hot-reloads in development.
- **Updated**: `.env` and `.env.example` with `DATABASE_URL` and `DIRECT_URL` placeholders for Supabase (Transaction-mode pooler URL and direct connection URL).
- **Installed**: `prisma`, `@prisma/client`, `typescript`, `ts-node`, `@types/node` as dev dependencies in the backend.

