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

---

### 🕑 10:33 - Invoice Editor Dropdown Integration + Company Logo

#### Schema
- **Updated**: `prisma/schema.prisma` — added `logo String?` field to the `Company` model.

#### Backend — New Data API Routes
- **Added**: `routes/customers.js` — `GET /api/customers` (list, ordered by name) and `GET /api/customers/:id` (single); queries via Prisma.
- **Added**: `routes/services.js` — `GET /api/services` (list, ordered by name) and `GET /api/services/:id` (single); Prisma `Decimal` fields serialized to `Number` for JSON.
- **Updated**: `server.js` — mounted `/api/customers` and `/api/services`.

#### Frontend — Dropdown UI
- **Added**: `src/hooks/useApiData.js` — generic fetch hook (`useApiData(path)`) that attaches the JWT `Authorization` header automatically, returns `{ data, isLoading, error, refetch }`.
- **Rewritten**: `InvoiceEditor.jsx`:
  - **Client section**: replaced all free-text inputs with a single styled customer `<select>` dropdown. Selecting a customer auto-populates a read-only detail card (name, email, phone, GST number).
  - **Line Items section**: replaced description text input per item with a service `<select>` dropdown. Selecting a service auto-fills `rate`, `description`, and `gstRate` from the service record. Rate, Qty, GST %, and Notes remain editable. A per-item GST preview is shown.
  - Both dropdowns render graceful loading and error states when the backend is unavailable.
- **Updated**: `InvoiceEditor.css` — added `.editor-select`, `.editor-select-wrap`, `.editor-select-icon`, `.customer-detail-card`, and related styles.
- **Updated**: `src/constants/invoiceDefaults.js` — added `serviceId`, `gstRate` to item default shape; added `id`, `gstNumber` to client default shape.

---

### 🕑 10:40 - Bug Fix: Prisma Config Missing dotenv

- **Fixed**: `prisma.config.ts` — added `import 'dotenv/config'` at the top. Prisma CLI executes this file in isolation (without automatically loading `.env`), so `process.env.DATABASE_URL` was `undefined`, causing the error: *"The datasource.url property is required"*. The dotenv import ensures env variables are loaded before the config is read.

---

### 🕑 10:43 - Bug Fix: Prisma v7 Missing Driver Adapter

- **Root cause**: Prisma v7 removed the legacy binary query engine. `PrismaClient` now requires either a driver adapter or Prisma Accelerate URL — passing connection URLs in the schema alone is no longer sufficient.
- **Fixed**: `lib/prisma.js` — replaced the plain `new PrismaClient()` with an adapter-backed instance using `@prisma/adapter-pg` and a `pg.Pool` seeded from `process.env.DATABASE_URL`.
- **Installed**: `pg` and `@prisma/adapter-pg` packages.
- **Note**: Prisma auto-promoted `driverAdapters` out of preview in v7, so `previewFeatures = ["driverAdapters"]` in `schema.prisma` was added then immediately removed (it generated a deprecation warning and is not required).
- **Ran**: `npx prisma generate` to regenerate the Prisma Client with adapter support.

---

### 🕑 11:11 - Bug Fix: White Screen (Missing Icon Exports)

- **Issue**: The application was failing to render, resulting in a blank white screen. Console revealed a `SyntaxError`: *"The requested module... does not provide an export named 'LuAlertCircle'"*.
- **Investigation**: Used a browser subagent to capture the error. Ran node commands to inspect `react-icons/lu` exports in `node_modules`. Found that `LuAlertCircle` and `LuAlertTriangle` were missing in the installed version of the package.
- **Fixed**: Updated `InvoiceEditor.jsx` to use `LuCircleAlert`, which was verified to exist.
- **Audited**: Proactively verified that other new icons (`LuPackage`, `LuChevronDown`) are available to prevent similar crashes.
- **Result**: Application rendering restored; the Invoice Editor now loads correctly with the new dropdown features.
### 🕑 14:15 - CSS Extraction & Code Refactoring
- **Refactor**: Decoupled UI logic from styling in `CustomersPage.jsx`, `ProductsPage.jsx`, and `InvoiceEditor.jsx`. Extracted over 1,500 lines of inline styles into dedicated `.css` files.
- **Refactor**: Shifted `Sidebar.jsx` styling to `Sidebar.css`, implementing a standardized `sb-` class prefix to prevent global namespace pollution.
- **Improved**: Component readability and maintainability significantly enhanced across the primary dashboard views.
- **Added**: Toggleable **Edit Mode** for Business Information in `InvoiceEditor.jsx`. Fields are read-only until the user clicks "Edit".
- **Database**: Updated Prisma schema to include `email` and `website` fields for the `Company` model.
- **Backend**: Updated `PUT /api/companies` to support persisting extended business profile details.
- **Added**: Sequential **Invoice Numbering** via `GET /api/invoices/next-number`. Backend parses the latest invoice number and increments it (e.g., `INV-005` → `INV-006`).
- **Improved**: Locked the Invoice # field in `InvoiceEditor.jsx` to prevent manual overrides and ensure sequence integrity.
- **Bug Fix**: Resolved `PayloadTooLargeError: request entity too large` by increasing Express `json` and `urlencoded` limits to **10MB** in `server.js`. This allows for large logos and complex profile data.
- **Bug Fix**: Addressed intermittent 404 errors by adding request logging and standardizing API endpoint registration in the backend.
- **Sync**: Migrated `ProductsPage.jsx` from `localStorage` to the central backend API. 
- **Backend**: Implemented `POST` and `DELETE` endpoints in `services.js` to support full CRUD for the product catalog.
- **Verify**: Confirmed through testing that products added in the Products Page now correctly populate the Invoice Editor dropdown.
- **Verify**: Successfully ran global application builds to confirm production readiness and styling integrity.

### 🕑 20:20 - Tailwind CSS & UI Layout Fixes

- **Fixed**: Resolved a PostCSS/Tailwind v4 "unknown utility class" error in `src/index.css`. The arbitrary shadow utility `shadow-[20px_0_50px_-20px_rgba(0, 0, 0, 0.5)]` was causing a truncation bug due to internal spaces. Removed spaces to fix the build.
- **Fixed**: Addressed a word-wrap issue in the "Created By" column on the `InvoicesPage`. 
- **Added**: Missing CSS for `.ip-creator-badge` and `.ip-creator-avatar` in `InvoicesPage.css`. 
- **Improved**: Applied `white-space: nowrap` to the creator name to ensure "U System" (or similar) stays on a single line, maintaining table alignment.
- **Verify**: Successfully ran `npm run build` in the `invoice` package to confirm CSS integrity and build status.

---

## 📅 March 17, 2026

### 🕑 11:30 - UI Refinements & User Experience
- **Fixed**: Updated `SetupPasswordModal.jsx` to ensure the temporary reference password persists across page refreshes by fetching it from the backend `/me` endpoint.
- **Added**: Implemented a 12-character random fallback string for the temporary reference to avoid showing "GENERATING..." in the UI.
- **Improved**: Repurposed the brand icon in the sidebar as a functional toggle button. Removed the redundant and overflowing chevron collapse button.
- **Added**: Smooth CSS transitions for the sidebar's expanded and collapsed states, maximizing screen space for the main content area.

### 🕑 11:45 - Docker Orchestration & Infrastructure
- **Added**: Full Dockerization of the application stack.
  - `backend/Dockerfile`: Node.js 20 environment with automated Prisma client generation.
  - `invoice/Dockerfile`: Multi-stage build with Nginx for optimized SPA serving.
  - `docker-compose.yml`: Orchestrates Backend, Frontend, and a local PostgreSQL database.
- **Fixed**: Resolved Prisma client resolution issues in the Docker build by shifting `@prisma/client` to main dependencies.
- **Fixed**: Correctly passed `VITE_GOOGLE_CLIENT_ID` as a build argument to ensure Google Auth works within the containerized environment.
- **Updated**: Configured backend CORS to permit requests from the dockerized frontend at `http://localhost`.

### 🕑 12:00 - Localization & Data Scannability
- **Localization**: Switched the currency symbol from `$` to `₹` and updated the `DollarSign` icon to `IndianRupee` in the product catalog form.
- **Feature**: Implemented descending numeric sort for the Invoice Archive list, ensuring the latest invoices appear at the top by default.
- **Cleanup**: Removed the "Sign Up" link from the `LoginPage.jsx` to streamline the authentication flow.

### 🕑 13:45 - Truly Global Notifications & Price Validation
- **Added**: `src/context/ToastContext.jsx` implementing a centralized `ToastProvider`.
- **Refactor**: Replaced local toast logic in `EditorPage.jsx` and `ProductsPage.jsx` with the global `useToast()` hook.
- **Improved**: Added numeric overflow protection to the Product Catalog with a 1 Trillion limit and inline "Price limit" warning.
- **Improved**: Added React Portals to ensure notifications always render on the top layer of the DOM.

### 🕑 14:00 - Docker & Database Sync Fixes
- **Improved**: Updated `docker-compose.yml` with host-to-container volume mappings for `./backend` and `./invoice`. This enables real-time synchronization of `schema.prisma` and source code without image rebuilds.
- **Bug Fix**: Resolved an "Already in sync" migration error caused by container isolation.
- **Infrastructure**: Added `docker-compose.prod.yml` template for potential remote deployment.

### 🕑 15:10 - Dynamic API Configuration
- **Refactor**: Systematically eliminated all hardcoded `localhost:4000` strings from the frontend.
- **Added**: `VITE_API_URL` environment variable support across all core components (`AuthContext`, `useApiData`, `EditorPage`, `ProductsPage`, `CustomersPage`).
- **Improved**: The application is now fully deployment-agnostic; API end-points can be toggled via `.env` without code changes.

---

## 📅 March 30, 2026

### 🕑 17:30 - Financial Compliance & Footer Restructuring
- **Feature**: Implemented **Total in Words** conversion logic specifically for INR (Indian Rupee) formatting in `invoice.jsx`.
- **Feature**: Added a structured **Bank Details** section to the invoice footer (Bank Name, A/C, IFSC, Location).
- **Feature**: Integrated a dedicated **Terms & Conditions** section with standardized legal text for professional compliance.
- **Feature**: Added an **Authorized Signatory** section supporting base64 signature image uploads and signee names.
- **Improved**: Restructured the invoice footer layout: Bank Details & Signature (side-by-side) → Thank You Note → Terms & Conditions.
- **Feature**: Added **Balance Due** display to the invoice header metadata for immediate visual clarity.
- **CSS**: Optimized footer alignment and print-specific styles (`print-color-adjust`) in `invoice.css`.

### 🕑 18:15 - Data Persistence & UX Overhaul
- **Bug Fix**: Resolved a critical issue where the **Authorized Signatory** and other business profile fields (Address, Email, Website, Bank Details) were not persisting to the database.
- **Backend Refactor**: Updated `PUT /api/companies` in `companies.js` with a more robust extraction logic to handle nested state objects from the frontend.
- **UX**: Moved the "Save Changes" and "Cancel" buttons in `InvoiceEditor.jsx` to be globally accessible (top and bottom of the business profile area) to avoid confusion during long scroll editing.
- **Notifications**: Integrated `showToast` notifications into the business profile update flow to provide immediate success/error feedback.
- **Feature**: Added a **Business Phone Number** field across the entire stack:
  - **Database**: Updated Prisma schema for the `Company` model.
  - **API**: Updated GET/PUT routes in `companies.js`.
  - **Frontend**: Added phone input to `InvoiceEditor.jsx` and dynamic rendering in `invoice.jsx`.
- **Sync**: Automated database schema synchronization using `npx prisma db push` during development.
